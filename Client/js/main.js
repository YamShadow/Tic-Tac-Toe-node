document.addEventListener("DOMContentLoaded", function() {

    var currentPlayer = {'squareState': 1, 'name': "X"}, 
        board, 
        player, 
        channel, 
        playing = -1, 
        url = 'http://localhost:8080';
    initClient();

    /*** ACTION ***/

    // fonction d'initialisation du client
    function initClient() {

        channel = window.location.href.split('=')[1];
        if(channel == undefined)
            document.location.href="index.html";
        document.getElementById("codePartie").innerHTML = 'Votre code de partie est <b>'+channel+'</b><br> Invitez vos amis !';

        $.ajax({
            type: "POST",
            url: url+'/challenger',
            timeout: 4000,
            crossDomain: true,
            data: {'token': channel},
            success: function (data) {
                player = data.player;
                document.getElementById("player").innerHTML = 'Vous êtes le joueur '+player.name;
                if(!data.wait)
                    matchMaking();
                else{
                    playing = 0;
                    setMessage('Au joueur X !');
                    waitChallengerPlaying();
                }
            },
            error: function() {
                setMessage('Echec de connexion au serveur....');
            }
        });
    }

    //Fonction de boucle pour la recherche d'un second joueur
    function matchMaking() {
        setMessage('On attend d\'un second joueur ...');
                var wait = setInterval(function(){
                    twoPlayer(wait);
                }, 1000);
    }

    // Fonction Ajx de check du matchmaking
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

    // Fonction de remplissage du board
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

    // Function d'initialisation de la boucle
    function waitChallengerPlaying(){
        setMessage('Au joueur '+currentPlayer.name+' !');
                var wait = setInterval(function(){
                    challengerPlaying(wait);
                }, 500);
    }

    // Function Ajax qui fait du long thread pour sonder l'API d'un changement sur le plateau
    function challengerPlaying(wait){
        $.ajax({
            type: "POST",
            url: url+'/state',
            timeout: 4000,
            crossDomain: true,
            data: {'token': channel},
            success: function (data) {
                reponseChallengerPlaying(data, wait);
            },
            error: function() {
                return false;
            }
        });
    }

    //Function de reponse d'Ajax du calcule de board
    function reponseChallengerPlaying(data,wait = false, bool = false){
        if(data.etat != 0){
            playing = data.etat;
            board = data.game.board.board;
            showBoard();
            if (playing === 1)
                setMessage("X Gagne!");
            else if (playing == 2)
                setMessage("O Gagne!");
            else if (playing == 3)
                setMessage("Egalité!");
            if(player.squareState != 0)
                $("#boutons").show();
            if(bool)
                waitChallengerPlaying();
        }else{
            if(player.squareState != 0)           
                $("#boutons").hide();     
            currentPlayer = data.game.currentMove;
            board = data.game.board.board;
            playing = data.etat;         
            showBoard();
            setMessage('Au joueur '+currentPlayer.name+' !');
            if(player.squareState == currentPlayer.squareState && wait)
                clearInterval(wait);
            if(bool)
                waitChallengerPlaying();
        }
    }

    /*** ACTION ***/

    //Action lors du clic sur le bouton " Nouvelle partie "
    document.getElementById("new-game").addEventListener("click", function() {
        if(playing != 0){
            $.ajax({
                type: "POST",
                url: url+'/start',
                timeout: 4000,
                crossDomain: true,
                data: {'token': channel},
                success: function (data) {

                },
                error: function() {
                    setMessage('Echec de connexion au serveur....');
                }
            });
        }
    });

    //Action lors du bouton " quitter le salon"
    document.getElementById("quit").addEventListener("click", function() {
        $.ajax({
            type: "POST",
            url: url+'/quit/'+player.squareState,
            timeout: 4000,
            crossDomain: true,
            data: {'token': channel},
            success: function (data) {
                window.close();
            },
            error: function() {
                setMessage('Echec de connexion au serveur....');
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
                    reponseChallengerPlaying(data, false, true);
                },
                error: function() {
                    setMessage('Echec de connexion au serveur....');
                }
            });
        }
    });

    // conflit avec le click
    // $(".square").mouseenter(function(){
    //     var elm = $(this).attr('id');
    //     console.log($("#"+elm).html());
    //     if($("#"+elm).html() == '')
    //         $("#"+elm).html('<span class="X">X</span>');
    //     console.log($("#"+elm).innerHTML);
    // });

    // $(".square").mouseleave(function(){
    //     var elm = $(this).attr('id');
    //     if($("#"+elm).html() != '')
    //     $("#"+elm).html('');
    // });

});
