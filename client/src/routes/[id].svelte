<script>
	import io from 'socket.io-client';
	import { page } from '$app/stores';
	import { browser } from '$app/env';

	let game = {
		state: '',
		players: []
	};

	let socket;
	let selection;
	let winner;

	if (browser) {
		socket = io('wss://wss.ryanlau.xyz', {
			query: {
				playerId: localStorage.getItem('uuid'),
				gameId: $page.params.id
			}
		});

		socket.emit('joinGame', (_game) => {
			game = _game;
		});

		socket.on('update', (_game) => {
			game = _game;
		});

		socket.on('winner', (_winner) => {
			winner = _winner;
		});

		socket.on('triggerReload', () => {
			window.location.reload()
		})
	}

	function playAgain() {
		socket.emit('resetGame')
	}
</script>

{#if game.state == 'ROOM_NOT_FOUND'}
	<p>error joining game, room not found</p>
{/if}

{#if game.state == 'ROOM_FULL'}
	<p>error joining game, room full</p>
{/if}

{#if game.state == 'LOBBY'}
	{#each game.players as player}
		<p>
			{player}
		</p>
	{/each}

	{#if game.players.length == 2}
		<button on:click|once={socket.emit('startGame')}>start game</button>
	{/if}
{/if}

{#if game.state == 'STARTED'}
	{#if selection == undefined}
		<button
			on:click={(e) => {
				socket.emit('setMove', 'ROCK');
				selection = 'ROCK';
			}}
		>
			rock</button
		>
		<button
			on:click={(e) => {
				socket.emit('setMove', 'PAPER');
				selection = 'PAPER';
			}}
		>
			paper
		</button>
		<button
			on:click={(e) => {
				socket.emit('setMove', 'SCISSORS');
				selection = 'SCISSORS';
			}}
		>
			scissors
		</button>
	{:else}
		<p>your selection is: {selection}</p>
	{/if}

	{#if winner != undefined}
		{#if winner == 'DRAW'}
			<p>it's a draw</p>
		{:else if winner == localStorage.getItem('uuid')}
			<p>you win</p>
		{:else}
			<p>you lose</p>
		{/if}


		<button on:click={playAgain}>play again</button>
	{/if}
{/if}
