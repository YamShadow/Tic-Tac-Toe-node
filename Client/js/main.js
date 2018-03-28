document.addEventListener("DOMContentLoaded", function() {

    var currentPlayer = {'squareState': 1, 'name': "X" }, board, player = {'squareState': 1, 'name': "X"};
    init();

    function init() {
        $.ajax({
            url: 'http://localhost:8080/challenger',
            timeout: 4000,
            crossDomain: true,
            success: function (data) {
                player = data.player
                console.log(data);
                if(!data.wait)
                    matchMaking();
                else
                    setMessage('Au jour du joueur '+currentPlayer.name);
            },
            error: function() {
                setMessage('Echec....')
            }
        });
    }

    function matchMaking() {
        setMessage('On attend un second joueur ...');
                var wait = setInterval(function(){
                    twoPlayer(wait);
                }, 2000);
    }

    function twoPlayer(wait){
        return $.ajax({
            url: 'http://localhost:8080/waitChallenger',
            timeout: 4000,
           // async: false,
            crossDomain: true,
            success: function (data) {
                if(data.wait){
                    setMessage('Au jour du joueur X');
                    clearInterval(wait)
                }
                //return data;
            },
            error: function() {
                return false;
            }
        });
    }

    function showBoard(){
        console.log(board);
        for(var i = 0; i < 3; i++){
            for(var j = 0; j < 3; j++){
                if(board[i][j].state == 1){
                    $("#square_"+i+"_"+j).html('<span class="X">X</span>');
                }
                else if(board[i][j].state == 2) {
                    $("#square_"+i+"_"+j).html('<span class="O">O</span>');
                }
            }
        }
    }

    //Fonction de nettoyage de tableau
    function clearBoard() {
        document.querySelectorAll(".square").forEach(function(square) {
            square.innerHTML = "";
        });
    }

    //Fonction de remplisage de la div message
    function setMessage(message) {
        document.getElementById("message").innerHTML = message;
    }

    //Action lors du clic sur le bouton
    document.getElementById("new-game").addEventListener("click", function() {
        $.ajax({
            url: 'http://localhost:8080/start',
            timeout: 4000,
            crossDomain: true,
            success: function (data) {
                clearBoard();
                currentPlayer = data.game.currentMove;
                board = data.game.board.board;
                setMessage('Nouvelle partie !<br>Au joueur '+player.name+' !');
            },
            error: function() {
                setMessage('Echec....')
            }
        });
    });

    document.getElementById("quit").addEventListener("click", function() {
        $.ajax({
            url: 'http://localhost:8080/quit/'+player,
            timeout: 4000,
            crossDomain: true,
            success: function (data) {
                window.close();
            },
            error: function() {
                setMessage('Echec....')
            }
        });
    });

    // Action lors du clic sur une case
    document.getElementById("board").addEventListener("click", function(event) {
        console.log(currentPlayer);
        if (event.target.classList.contains("square") && player.squareState == currentPlayer.squareState)  {

            console.log(player);
            squareInfo = event.target.id.split("_");
            row = Number(squareInfo[1]);
            col = Number(squareInfo[2]);

            $.ajax({
                url: 'http://localhost:8080/play/'+player.squareState+'/'+row+'/'+col,
                timeout: 4000,
                crossDomain: true,
                success: function (data) {
                    //box.html(data);
                    currentPlayer = data.game.currentMove.name;
                    board = data.game.board.board;
                    showBoard();
                    setMessage('Au joueur '+currentPlayer+' !');
                },
                error: function() {
                    setMessage('Echec....')
                }
            });

        //     var val = game.makeMove(row, col)
        //     if (val !== undefined) {
        //         var stateValue = Square.stateToString(val);
        //         event.target.innerHTML = `<span class=${stateValue}>${stateValue}</span>`;
        //     }
        //     state = game.winner();

        //     if (state === Board.X_WINS)
        //         setMessage("X Gagne!")
        //     else if (state === Board.O_WINS)
        //         setMessage("O Gagne!");
        //     else if (state === Board.TIE)
        //         setMessage("Egalité!");
        }
    });

});
