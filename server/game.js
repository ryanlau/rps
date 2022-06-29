class Game {
    state
    players = []
    #moves = {}

    constructor() {
        this.state = "LOBBY"
    }

    join(_id) {
        if (this.players.indexOf(_id) == -1) {
            this.players.push(_id)
        } 
    }

    leave(_id) {
        this.players = this.players.filter((playerId) => playerId != _id)
    }

    chooseMove(_id, move) {
        this.#moves[_id] = move
    }

    bothMovesIn() {
        return Object.keys(this.#moves).length == 2
    }

    getWinner() {
        if (this.bothMovesIn) {
            let m1 = this.#moves[this.players[0]]
            let m2 = this.#moves[this.players[1]]

            if (m1 == m2) {
                return "DRAW"
            }

            if (m1 == "ROCK") {
                if (m2 == "SCISSORS") {
                    return this.players[0]
                } else {
                    return this.players[1]
                }
            }

            if (m1 == "PAPER") {
                if (m2 == "ROCK") {
                    return this.players[0]
                } else {
                    return this.players[1]
                }
            }

            if (m1 == "SCISSORS") {
                if (m2 == "PAPER") {
                    return this.players[0]
                } else {
                    return this.players[1]
                }
            }
        }
    }
}

module.exports = Game