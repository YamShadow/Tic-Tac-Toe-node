var Board = require('./board');
var Player = require('./player');
var Square = require('./square');

// Constructeur de la classe Game
function Game(playerX = "X", playerO = "O") {
    this.board = new Board();
    this.playerX = new Player(Square.X_STATE, playerX);
    this.playerO = new Player(Square.O_STATE, playerO);
    this.currentMove = this.playerX;
    this.player1 = false;
    this.player2 = false;

}

// effectue un deplacement
Game.prototype.makeMove = function(player, row, column) {

    if (this.board.empty(row, column) && this.board.setSquare(row, column, player) !== undefined) {
        this.__changeTurn();
        return player;
    }

    return undefined;
};

// change de joueur 
Game.prototype.__changeTurn = function() {
    if (this.currentMove === this.playerX)
        this.currentMove = this.playerO;
    else
        this.currentMove = this.playerX;
};

// check si il y a un gagnant 
Game.prototype.winner = function() {
    return this.board.boardState();
};

// reset le jeu
Game.prototype.reset = function() {
    this.currentMove = this.playerX;
    this.board.reset();
    return true;
};

// asignation d'un statut au joueur
Game.prototype.assignation = function() {
    if(this.player1 == false){
        this.player1 = true;
        return new Player(Square.X_STATE, "X");
    }
    else if(this.player2 == false){
        this.player2 = true;
        return new Player(Square.O_STATE, "O");
    }
    else
        return new Player(Square.EMPTY_STATE, "spéctateur");
}
// Check si il y a deux joueurs
Game.prototype.twoPlayer = function() {
    return (this.player1 && this.player2) ? true : false;
}

// Libere la place d'un joueur
Game.prototype.free = function(player) {
    if(player == 1)
        player1 = false;
    else if(player == 2)
        player2 = false;
    return;
}


module.exports = Game;