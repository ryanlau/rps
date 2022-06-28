const { Server } = require("socket.io");

const io = new Server({ /* options */ });

io.on("connection", (socket) => {
  socket.on('createGame', () => {
    console.log('message: ');
  });

  console.log("adfasf");
});

io.listen(5555);