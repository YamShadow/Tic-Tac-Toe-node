var Board = require('./board');
var Player = require('./player');
var Square = require('./square');
var player1 = false, player2 = false;

// Constructeur de la classe Game
function Game(playerX = "X", playerO = "O") {
    this.board = new Board();
    this.playerX = new Player(Square.X_STATE, playerX);
    this.playerO = new Player(Square.O_STATE, playerO);
    this.currentMove = this.playerX;
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
Game.prototype.winner = function(player) {
    return this.board.boardState(player);
};

// reset le jeu
Game.prototype.reset = function() {
    this.currentMove = this.playerX;
    this.board.reset();
    return true;
};

Game.prototype.assignation = function() {
    if(player1 == false){
        player1 = true;
        return new Player(Square.X_STATE, "X");
    }
    else if(player2 == false){
        player2 = true;
        return new Player(Square.O_STATE, "O");
    }
    else
        return new Player(Square.EMPTY_STATE, "Observer");
}

Game.prototype.twoPlayer = function() {
    return (player1 && player2) ? true : false;
}

Game.prototype.free = function(player) {
    if(player == 1)
        player1 = false;
    else if(player == 2)
        player2 = false;
    return;
}


module.exports = Game;