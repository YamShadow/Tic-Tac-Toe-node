# Tic-Tac-Toe-node
Tic tac toe with Node.JS (API+Client) 

## Installation
Pour installer le projet
- ouvrir un terminal
- $ cd API 
- $ npm install 
- $ npm start
- ouvrir le fichier 'Client/index.html' sur 2 onglets

Vous pouvez jouer !

## Fonctionnalités

* Matchmaking entre les deux premiers joueurs d'un salon
* Possibilité d'être spéctateur d'une game
* Possibilité de jouer et de gagner
* Possibilité de relancer une partie
* Gestion de salons par uuid. Possible d'inviter ses amis à jouer ou observer sa game !

## Routes de l'api en GET
### /
**DESCRIPTION** Liste des routes disponibles

    PARAMETRES D'ENTREE

    PARAMETRE DE SORTE
    JSON {
        'Route': {
            '/': 'Liste des routes disponibles',
            '/state': 'Retourne le plateau de jeu courant',
            '/start': 'Démarre une partie et retourne le plateau de jeu',
            '/play/:player/:row/:col': 'Place un pion du joueur player a la ligne row et a la colonne col. Renvoie le plateau de jeu',
            '/waitChallenger': 'Verifie si on est bien deux joueurs',
            '/challenger': 'Attribu un pion au client',
            '/quit/:player': 'Quitte le salon'
        }
    }

## Routes de l'api en POST
### /state
**DESCRIPTION** Retourne le plateau de jeu courant

    PARAMETRES D'ENTREE

    PARAMETRE DE SORTE
    JSON {
        etat : int,
        game : Game
    }

### /start
**DESCRIPTION** Démarre une partie et retourne le plateau de jeu

    PARAMETRES D'ENTREE

    PARAMETRE DE SORTE
    JSON {
        etat : int
        reset : boolean,
        game : Game
    }

### /play/:player/:row/:col
**DESCRIPTION** Place un pion du joueur player a la ligne row et a la colonne col. Renvoie le plateau de jeu

    PARAMETRES D'ENTREE
    @player      : int
    @row         : int
    @col         : int

    PARAMETRE DE SORTE
    JSON {
        coups : boolean,
        etat : int,
        game : Game       
    }

### /waitChallenger
**DESCRIPTION** Verifie si on est bien deux joueurs

    PARAMETRES D'ENTREE

    PARAMETRE DE SORTE
    JSON {
        wait : boolean    
    }

### /challenger
**DESCRIPTION** Attribu un pion au client

    PARAMETRES D'ENTREE

    PARAMETRE DE SORTE
    JSON {
        wait : boolean,
        player : Player,      
    }

###  /quit/:player
**DESCRIPTION** Quitte le salon

    PARAMETRES D'ENTREE
    @player      : int

    PARAMETRE DE SORTE
    JSON {
        quit : boolean      
    }

## TODO

* Matchmaking 
    * Stopper le jeu si l'un des utilisateurs se deconnecte / met trop de temps a jouer
    * relancer la recherche d'un nouveau joueur si l'un des joueurs en cours quitte 
        * relancer une nouvelle partie
* AI
    * simple (random de case)
    * complexe

* Design plus poussé 
    * Dashboard plus sexy
    * Hover des cases 
    * Personnalisation des noms

* Autres
    * Système de points
    * Historiques
    * Optimisation code 
    * Optimisation des calls Ajax
