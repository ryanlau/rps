const { Server } = require("socket.io");
const crypto = require("crypto");
const Game = require("./game.js")
const games = {}

const io = new Server({
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET"]
  }
});

io.on("connection", (socket) => {
  socket.on("createGame", (callback) => {
    const game = new Game();
    const code = crypto.randomUUID()
    games[code] = game

    callback({
      code: code
    })
  });

  socket.on("joinGame", (callback) => {
    const gameId = socket.handshake.query.gameId
    const playerId = socket.handshake.query.playerId
    const game = games[gameId]

    if (game === undefined) {
      callback({
        state: "ROOM_NOT_FOUND"
        })
      return
    }

    if (game.players.length >= 2) {
      callback({
        state: "ROOM_FULL"
      })
      return
    }

    game.join(playerId)
    socket.join(gameId)
    socket.to(gameId).emit("update", game.players)

    callback({
      state: game.state,
      players: game.players
    })
  })

  socket.on("startGame", () => {

  })

  socket.on("disconnect", () => {
    const gameId = socket.handshake.query.gameId
    const playerId = socket.handshake.query.playerId
    const game = games[gameId]

    if (game !== undefined) {
      game.leave(playerId)
      socket.to(gameId).emit("update", game.players)
      return
    }
  });
});

io.listen(12382);