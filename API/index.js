var express = require('express');
var app = express();
var Game = require('./game/game');

const game = new Game();
var state = 0;

// Route /
app.get('/', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    res.send(JSON.stringify({ 'Route': {
        '/': 'Liste des routes disponibles'
        , '/state': 'Retourne le plateau de jeu courant'
        , '/start': 'Démarre une partie et retourne le plateau de jeu'
        , '/play/:player/:row/:col': 'Place un pion du joueur player a la ligne row et a la colonne col. Renvoie le plateau de jeu'
        , '/waitChallenger': 'Verifie si on est bien deux joueurs'
        , '/challenger': 'Attribu un pion au client'
        , '/quit/:player': 'Quitte le salon'
    } }, null, 3));
})

// Route /state en post
// retourne le plateau de jeu
app.post('/state', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    res.send(JSON.stringify({
        'etat': state,
        'game' : game
    }, null, 3));
  })

// Route /start en post
// demarre une partie et retourne le plateau de jeu
app.post('/start', function (req, res) {
    game.reset();
    state = 0;

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        'etat' : state,
        'resert': true,
        'game' : game
    }, null, 3));

  })

// Route /play/:player/:row/:col
// place un pion du joueur player a la ligne row et a la colonne col. Renvoie le plateau de jeu
app.post('/play/:player/:row/:col', function (req, res) {
    var player = req.params.player;
    var row = req.params.row;
    var col = req.params.col;

    game.makeMove(player, row, col)
    state = game.winner();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        'coups': true,
        'etat': state,
        'game' : game
    }, null, 3));
    
  })

// Route /waitChallenger
// Attente d'un second joueur
app.post('/waitChallenger', function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        'wait': game.twoPlayer()
    }, null, 3));
})

// Route /challenger
//Attribution d'un état au joueur
app.post('/challenger', function (req, res) {
    var player = game.assignation();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        'wait' : game.twoPlayer(),
        'player' : player
    }, null, 3));
})

// /quit/:player
//route de quit
app.post('/quit/:player', function (req, res) {
    var player = req.params.player;
    var player = game.free(player);

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        'quit' : true,
    }, null, 3));
  })


//Lancement du 
app.listen(8080, function () {
  console.log('Link Start !!!!!!')
})