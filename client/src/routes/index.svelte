<script>
	import io from 'socket.io-client';
	const socket = io('ws://localhost:12382');
	import { goto } from '$app/navigation';

	function createGame() {
		socket.emit('createGame', (response) => {
			console.log(response.code);
			goto(`/${response.code}`);
		});
	}
</script>

<p>
	<button on:click|once={createGame}> create game </button>
</p>
