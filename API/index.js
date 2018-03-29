var express = require('express');
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
var Game = require('./game/game');

//const game = new Game();
const channels = [];
var data = {uuid: '854712936', state:"0", game: new Game()}
channels.push(data)
var data = {uuid: '123456789', state:"1", game: new Game()}
channels.push(data)

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
    var uuid = req.body.token; 
    var idGame = checkChannelExist(uuid);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    res.send(JSON.stringify({
        'etat': channels[idGame].state,
        'game' : channels[idGame].game
    }, null, 3));
  })

// Route /start en post
// demarre une partie et retourne le plateau de jeu
app.post('/start', function (req, res) {
    var uuid = req.body.token; 
    var idGame = checkChannelExist(uuid);

    channels[idGame].game.reset();
    channels[idGame].state = 0;

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        'etat' : channels[idGame].state,
        'resert': true,
        'game' : channels[idGame].game
    }, null, 3));

  })

// Route /play/:player/:row/:col
// place un pion du joueur player a la ligne row et a la colonne col. Renvoie le plateau de jeu
app.post('/play/:player/:row/:col', function (req, res) {
    var player = req.params.player;
    var row = req.params.row;
    var col = req.params.col;
    var uuid = req.body.token; 

    var idGame = checkChannelExist(uuid);
    channels[idGame].game.makeMove(player, row, col)
    channels[idGame].state = channels[idGame].game.winner();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        'coups': true,
        'etat': channels[idGame].state,
        'game' : channels[idGame].game
    }, null, 3));
    
  })

// Route /waitChallenger
// Attente d'un second joueur
app.post('/waitChallenger', function (req, res) {

    var uuid = req.body.token; 
    var idGame = checkChannelExist(uuid);

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        'wait': channels[idGame].game.twoPlayer()
    }, null, 3));
})

// Route /challenger
//Attribution d'un état au joueur
app.post('/challenger', function (req, res) {

    var uuid = req.body.token; 
    var idGame = checkChannelExist(uuid);
    var player = channels[idGame].game.assignation();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        'wait' : channels[idGame].game.twoPlayer(),
        'player' : player
    }, null, 3));
})

// /quit/:player
//route de quit
app.post('/quit/:player', function (req, res) {

    var uuid = req.body.token; 
    var idGame = checkChannelExist(uuid);

    var player = req.params.player;
    var player = channels[idGame].game.free(player);

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

function checkChannelExist(uuid){
    for (var elm in channels) {
        if(channels[elm].uuid == uuid){
            return elm;
        }
    }
    var data = {uuid: uuid, state:"0", game: new Game()}
    channels.push(data);
    return channels.length-1;
}