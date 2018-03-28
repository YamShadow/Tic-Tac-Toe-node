var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Game = require('./game/game');

const game = new Game();
var state = 0;

app.get('/', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    res.send(JSON.stringify({ 'Route': {
        '/': 'Liste des routes disponibles'
        , '/state': 'retourne le plateau de jeu courant'
        , '/start': 'demarre une partie et retourne le plateau de jeu'
        , '/play/:player/:row/:col': 'place un pion du joueur player a la ligne row et a la colonne col. Renvoie le plateau de jeu'
    } }, null, 3));
})

app.get('/state', function (req, res) {
    // retourne le plateau de jeu
    res.setHeader('Content-Type', 'application/json');
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    res.send(JSON.stringify({
        'game' : game
    }, null, 3));
  })

app.get('/start', function (req, res) {
    // demarre une partie et retourne le plateau de jeu
    game.reset();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        'resert': true,
        'game' : game
    }, null, 3));

  })

app.get('/play/:player/:row/:col', function (req, res) {
    // place un pion du joueur player a la ligne row et a la colonne col. Renvoie le plateau de jeu
    var player = req.params.player;
    var row = req.params.row;
    var col = req.params.col;

    game.makeMove(player, row, col)
    state = game.winner(player);
    console.log('state : '+ state);

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        'coups': true,
        'game' : game
    }, null, 3));
    
  })

  app.get('/waitChallenger', function (req, res) {
    // Attente d'un second joueur
    //console.log(game.twoPlayer());
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        'wait': game.twoPlayer(),
    }, null, 3));
  })

  app.get('/challenger', function (req, res) {
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

  app.get('/quit/:player', function (req, res) {
    //route de quit

    var player = req.params.player;

    var player = game.free();
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