document.addEventListener("DOMContentLoaded", function() {
    //Initialisation du jeu
    var game = new Game();
    var state = 0;

    //Fonction de nettoyage de tableau
    function clearBoard() {
        document.querySelectorAll(".square").forEach(function(square) {
            square.innerHTML = "";
        });
        setMessage("");
    }

    //Fonction de remplisage de la div message
    function setMessage(message) {
        document.getElementById("message").innerHTML = message;
    }

    // Action lors du clic sur le bouton
    document.getElementById("new-game").addEventListener("click", function() {
		state = 0;
        game.reset();
        clearBoard();
    });

    // Action lors du clic sur une case
    document.getElementById("board").addEventListener("click", function(event) {
        if (event.target.classList.contains("square") && state == 0) {
            squareInfo = event.target.id.split("_");
            row = Number(squareInfo[1]);
            col = Number(squareInfo[2]);
            var val = game.makeMove(row, col)
            if (val !== undefined) {
                var stateValue = Square.stateToString(val);
                event.target.innerHTML = `<span class=${stateValue}>${stateValue}</span>`;
            }
            state = game.winner();

            if (state === Board.X_WINS)
                setMessage("X Gagne!")
            else if (state === Board.O_WINS)
                setMessage("O Gagne!");
            else if (state === Board.TIE)
                setMessage("Egalité!");
        }
    });
});
