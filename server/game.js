class Game {
    state
    players = []

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
}

module.exports = Game