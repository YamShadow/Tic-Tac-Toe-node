// Constructeur de la classe Game

function Game(playerX = "X", playerO = "O") {
    this.board = new Board();
    this.playerX = new Player(Square.X_STATE, playerX);
    this.playerO = new Player(Square.O_STATE, playerO);
    this.currentMove = this.playerX;
}

// effectue un deplacement
Game.prototype.makeMove = function(row, column) {

    if (this.board.empty(row, column) && this.board.setSquare(row, column, this.currentMove.squareState) !== undefined) {
        var tempState = this.currentMove.squareState;
        this.__changeTurn();
        return tempState;
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
};
