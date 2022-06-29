<script>
	import io from 'socket.io-client';
	import { page } from '$app/stores';
	import { browser } from '$app/env';

	let state = 'LOADING...';
	let players;

	if (browser) {
		const socket = io('ws://localhost:12382', {
			query: {
				playerId: localStorage.getItem('uuid'),
				gameId: $page.params.id
			}
		});

		socket.emit('joinGame', (response) => {
			state = response.state;
			players = response.players;
		});

		socket.on('update', (_players) => {
			players = _players;
		});
	}

	function startGame() {
		socket.emit('startGame');
	}
</script>

{#if state == 'ROOM_NOT_FOUND'}
	<p>error joining game, room not found</p>
{/if}

{#if state == 'ROOM_FULL'}
	<p>error joining game, room full</p>
{/if}

{#if state == 'LOBBY'}
	{#each players as player}
		<p>
			{player}
		</p>
	{/each}

	{#if players.length == 2}
		<button on:click|once={startGame}>start game</button>
	{/if}
{/if}
