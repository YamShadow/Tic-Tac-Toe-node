var express = require('express');
var app = express();
var Game = require('./game/game');

const game = new Game();
var state = 0;

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

app.post('/state', function (req, res) {
    // retourne le plateau de jeu
    res.setHeader('Content-Type', 'application/json');
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    res.send(JSON.stringify({
        'etat': state,
        'game' : game
    }, null, 3));
  })

app.post('/start', function (req, res) {
    // demarre une partie et retourne le plateau de jeu
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

app.post('/play/:player/:row/:col', function (req, res) {
    // place un pion du joueur player a la ligne row et a la colonne col. Renvoie le plateau de jeu
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

  app.post('/waitChallenger', function (req, res) {
    // Attente d'un second joueur
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        'wait': game.twoPlayer()
    }, null, 3));
  })

  app.post('/challenger', function (req, res) {
    //Attribution d'un état au joueur
    var player = game.assignation();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        'wait' : game.twoPlayer(),
        'player' : player
    }, null, 3));
  })

  app.post('/quit/:player', function (req, res) {
    //route de quit

    var player = req.params.player;

    var player = game.free(player);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        'quit' : true,
    }, null, 3));
  })



app.listen(8080, function () {
  console.log('Link Start !!!!!!')
})