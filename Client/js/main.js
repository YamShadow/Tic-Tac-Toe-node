document.addEventListener("DOMContentLoaded", function() {

    var currentPlayer = {'squareState': 1, 'name': "X"}, 
        board, 
        player, 
        channel, 
        playing = -1, 
        url = 'http://localhost:8080';
    init();

    function init() {

        channel = window.location.href.split('=')[1];
        console.log(channel);
        if(channel == undefined)
            document.location.href="index.html";

        $.ajax({
            type: "POST",
            url: url+'/challenger',
            timeout: 4000,
            crossDomain: true,
            data: {'token': channel},
            success: function (data) {
                player = data.player
                document.getElementById("player").innerHTML = 'Vous êtes le player '+player.name;
                if(!data.wait)
                    matchMaking();
                else{
                    playing = 0;
                    setMessage('Au joueur X !');
                    waitChallengerPlaying();
                }
            },
            error: function() {
                setMessage('Echec....')
            }
        });
    }

    function matchMaking() {
        setMessage('On attend d\'un second joueur ...');
                var wait = setInterval(function(){
                    twoPlayer(wait);
                }, 1000);
    }

    function twoPlayer(wait){
        $.ajax({
            type: "POST",
            url: url+'/waitChallenger',
            timeout: 4000,
            crossDomain: true,
            data: {'token': channel},
            success: function (data) {
                if(data.wait){
                    playing = 0;
                    clearInterval(wait);
                    setMessage('Au joueur '+currentPlayer.name+' !');
                }
            },
            error: function() {
                return false;
            }
        });
    }

    function showBoard(){
        for(var i = 0; i < 3; i++){
            for(var j = 0; j < 3; j++){
                if(board[i][j].state == 1)
                    $("#square_"+i+"_"+j).html('<span class="X">X</span>');
                else if(board[i][j].state == 2)
                    $("#square_"+i+"_"+j).html('<span class="O">O</span>');
                else
                    $("#square_"+i+"_"+j).html(''); 
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

    function waitChallengerPlaying(){
        setMessage('Au joueur '+currentPlayer.name+' !');
                var wait = setInterval(function(){
                    challengerPlaying(wait);
                }, 500);
    }

    function challengerPlaying(wait){
        $.ajax({
            type: "POST",
            url: url+'/state',
            timeout: 4000,
            crossDomain: true,
            data: {'token': channel},
            success: function (data) {
                if(data.etat != 0){
                    playing = data.etat
                    board = data.game.board.board;
                    showBoard();
                    if (playing === 1)
                        setMessage("X Gagne!")
                    else if (playing == 2)
                        setMessage("O Gagne!");
                    else if (playing == 3)
                        setMessage("Egalité!");
                    $("#boutons").show();
                    clearInterval(wait);
                }else{                
                    currentPlayer = data.game.currentMove;
                    board = data.game.board.board;         
                    showBoard();
                    setMessage('Au joueur '+currentPlayer.name+' !');
                    if(player.squareState == currentPlayer.squareState){
                        clearInterval(wait);
                    }
                }
            },
            error: function() {
                return false;
            }
        });
    }

    //Action lors du clic sur le bouton
    document.getElementById("new-game").addEventListener("click", function() {
        $.ajax({
            type: "POST",
            url: url+'/start',
            timeout: 4000,
            crossDomain: true,
            data: {'token': channel},
            success: function (data) {
                clearBoard();
                currentPlayer = data.game.currentMove;
                board = data.game.board.board;
                playing = data.etat

                setMessage('Nouvelle partie !<br>Au joueur '+player.name+' !');
            },
            error: function() {
                setMessage('Echec....')
            }
        });
    });

    document.getElementById("quit").addEventListener("click", function() {
        $.ajax({
            type: "POST",
            url: url+'/quit/'+player,
            timeout: 4000,
            crossDomain: true,
            data: {'token': channel},
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
        if (event.target.classList.contains("square") && playing == 0 && player.squareState == currentPlayer.squareState)  {

            squareInfo = event.target.id.split("_");
            row = Number(squareInfo[1]);
            col = Number(squareInfo[2]);

            $.ajax({
                type: "POST",
                url: url+'/play/'+player.squareState+'/'+row+'/'+col,
                timeout: 4000,
                crossDomain: true,
                data: {'token': channel},
                success: function (data) {
                    if(data.etat != 0){
                        playing = data.etat
                        board = data.game.board.board;
                        showBoard();
                        if (playing === 1)
                            setMessage("X Gagne!")
                        else if (playing == 2)
                            setMessage("O Gagne!");
                        else if (playing == 3)
                            setMessage("Egalité!");
                        $("#boutons").show();
                    }else{
                        currentPlayer = data.game.currentMove;
                        board = data.game.board.board;
                        showBoard();
                        setMessage('Au joueur '+currentPlayer+' !');
                        waitChallengerPlaying();
                    }
                },
                error: function() {
                    setMessage('Echec....')
                }
            });
        }
    });

});
