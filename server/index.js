const { Server } = require("socket.io");
const crypto = require("crypto");
const Game = require("./game.js")
const games = {}

const io = new Server({
  cors: {
    origin: ["http://127.0.0.1:3000" ,"http://localhost:3000"],
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
        state: "ROOM_NOT_FOUND",
        players: []
      })
      return
    }

    if (game.players.length >= 2) {
      callback({
        state: "ROOM_FULL",
        players: []
      })
      return
    }

    game.join(playerId)
    socket.join(gameId)

    socket.to(gameId).emit("update", game) // send new game state to other clients
    callback(game) // send state to self
  })

  socket.on("startGame", () => {
    const gameId = socket.handshake.query.gameId
    const game = games[gameId]

    if (game === undefined) {
      return
    }

    if (game.players.length != 2) {
      return
    }

    game.state = "STARTED"

    io.to(gameId).emit("update", game)
  })

  socket.on("setMove", (move) => {
    const gameId = socket.handshake.query.gameId
    const playerId = socket.handshake.query.playerId
    const game = games[gameId]
    game.chooseMove(playerId, move)

    if (game.bothMovesIn()) {
      winner = game.getWinner()
      io.to(gameId).emit("winner", winner)
    }
  })

  socket.on("resetGame", () => {
    const gameId = socket.handshake.query.gameId
    games[gameId] = new Game()

    io.to(gameId).emit("triggerReload")
  })

  socket.on("disconnect", () => {
    const gameId = socket.handshake.query.gameId
    const playerId = socket.handshake.query.playerId
    const game = games[gameId]

    if (game !== undefined) {
      game.leave(playerId)
      socket.to(gameId).emit("update", game)
      return
    }
  });
});

io.listen(12382);