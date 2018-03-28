// constructeur de la classe Square
function Square() {
    this.state = Square.EMPTY_STATE;
}

Square.EMPTY_STATE = 0;
Square.X_STATE = 1;
Square.O_STATE = 2;

// setter de l'état X
Square.prototype.x = function() {
    return this.state === Square.X_STATE;
};

// setter de l'état O
Square.prototype.o = function() {
    return this.state === Square.O_STATE;
};

// setter de l'état vide
Square.prototype.empty = function() {
    return this.state === Square.EMPTY_STATE;
};

// conversion de l'état numérique en visuel
Square.stateToString = function(state) {
  if (state == Square.X_STATE)
       return "X";
  else if (state == Square.O_STATE)
        return "O";
  else
        return "";
};

module.exports = Square;