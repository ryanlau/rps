<script>
  import io from 'socket.io-client'
  const socket = io("ws://localhost:5555");

  function createGame() {

    socket.emit("createGame")
    
  }




</script>

<p>
    <button on:click|once={createGame}> create game </button>
</p>


