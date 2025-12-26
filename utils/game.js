function getGame(roomCode){
    return (
        this.games.find(
            (game) => (game.roomCode == roomCode)
        )
    );
}

function randomCode(){
    let code = "";
    const str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for(let i =  0 ;i < 6 ; i++){
        code += str[Math.floor(Math.random()*26)];
    }

    return code;
}

function roomCodeGenerator(){
    let code = randomCode();
    while(this.getGame(code)) code = randomCode();
    return code;
}

function createGame(){
    let game = {
        roomCode : this.roomCodeGenerator() , 
        ballA : 0,
        ballB : 0,
        battingA : true,
        gameInProgress : false,
        scoreA : 0 , 
        scoreB : 0 ,
        wicketsA : 0,
        wicketsB : 0, 
        players : [],
        bPlayed : false,
        aPlayed : false,
        inningsOver : 0,
        overs : 0,
        balls : 0,
        count : 0
    };
    this.games.push(game);
    return game;
}

function joinGame(roomCode , username){
    const game = this.getGame(roomCode)
    if(!game) return
    if(game.gameInProgress) {
        const player = game.players.find((p)=>p.username==username)
        if(player) {
            player.online = true
            game.count++
        }
    } else {
        if (
            game.players.find(
                (p) => (p.username == username)
            )
        ) return
        game.players.push(
            { 
                username : username ,
                online : true
            }
        )
        game.count++
    }
    console.log(game.players)
}

function userCanJoin( username , roomCode ){
    console.log(roomCode)
    const game = this.getGame(roomCode)
    if(!game) return
    console.log(game)
    const player = game.players.find(
        (p) => (p.username == username)
    )
    if(game.gameInProgress){
        if(player && !player.online) return true
        else return false
    } else {
        if(player) return false
        return true
    }
}

function assignTeams(game){
    let {players} = game
    for(let i = 0 ;i < players.length ;i++){
        players[i].team = "AB"[i%2]
    }
}

function gameOver(roomCode){
    const game = this.getGame(roomCode)
    if(!game) return
    if(game.inningsOver == this.totalInnings) {
        if(game.scoreA>game.scoreB) return 'A'
        else if(game.scoreA < game.scoreB) return 'B'
        else return 'D'
    } else if(game.inningsOver == this.totalInnings - 1) {
        if(game.battingA && game.scoreA > game.scoreB) return 'A'
        else if(!game.battingA && game.scoreB > game.scoreA) return 'B'
    }
}

function updateGame(roomCode){
    const game = this.getGame(roomCode)
    if(game.ballA == game.ballB) {
        // it means batsman is out
        if(game.battingA) game.wicketsA++
        else game.wicketsB++
        if( ! this.changeBatsman(game) )
        {
            game.inningsOver ++
            game.battingA = !game.battingA
            game.playerB = game.players.find((p)=>p.team=='B').username
            game.playerA = game.players.find((p)=>p.team=='A').username
        }
    } else {
        if(game.battingA) game.scoreA += game.ballA
        else game.scoreB += game.ballB
    }
}

function nextPlayer(players,username){
    const index = players.map(p=>p.username).indexOf(username)
    if(index == -1) return
    if(index+2 < players.length) return players[index+2].username
}

function changeBowler(game){
    const players = game.players;
    const currentBowler = (game.battingA) ? game.playerB : game.playerA
    const nextBowler = nextPlayer(players,currentBowler)
    if(!nextBowler){
        console.log("no next bowler restarting cycle")
        if(game.battingA){
            game.playerB = players.find((p)=>p.team=='B').username
            console.log(game.playerB)
        } else {
            game.playerA = players.find((p)=>p.team=='A').username
            console.log(game.playerA)
        }
    }else{
        if(game.battingA) game.playerB = nextBowler
        else game.playerA = nextBowler
    }
}

function changeBatsman(game){
    const players = game.players;
    const currentBatsman = (game.battingA) ? game.playerA : game.playerB
    const nextBatsman = nextPlayer(players,currentBatsman)
    if(!nextBatsman) return false
    if(game.battingA) game.playerA = nextBatsman
    else game.playerB = nextBatsman
    return true
}

function resetRoom(game){
    game.ballA = 0;
    game.ballB = 0;
    game.battingA = true;
    game.gameInProgress = false;
    game.scoreA = 0 ; 
    game.scoreB = 0 ;
    game.wicketsA = 0;
    game.wicketsB = 0; 
    game.bPlayed = false;
    game.aPlayed = false;
    game.inningsOver = 0;
    game.overs = 0;
    game.balls = 0
}

function playBall(roomCode,username,value,cb,over){
    const game = this.getGame(roomCode)
    if(!game) return
    const player = game.players.find(
        (p) => p.username==username
    )
    if(!player) return
    console.log(username + " "+ player.team + " played "+value)
    if((player.team == 'A' && game.playerA != player.username)
        ||
        (player.team == 'B' && game.playerB != player.username)) return
    
    if((game.aPlayed && player.team=='A')
        ||(game.bPlayed && player.team == 'B')) return
     
    if(game.bPlayed || game.aPlayed) {
        //call function for playing
        if(player.team == 'A') game.ballA = value
        else game.ballB = value
        this.updateGame(roomCode)
        game.balls++
        if(game.balls == 6){
            game.overs++
            game.balls = 0
            changeBowler(game)
        }
        cb()
        game.bPlayed = false 
        game.aPlayed = false
        const result = this.gameOver(roomCode)
        if(result){
            resetRoom(game)
            over(result)
        }
    }
    else if(player.team == 'A'){
        game.ballA = value
        game.aPlayed = true
    } else {
        game.ballB = value
        game.bPlayed = true
    }
}

function startGame(roomCode){
    const game = this.getGame(roomCode)
    if(!game) return
    if(game.count == 1) return
    this.assignTeams(game)
    if(game.players[0].team == 'A'){
        game.playerA = game.players[0].username
        game.playerB = game.players[1].username
    } else {
        game.playerB = game.players[0].username
        game.playerA = game.players[1].username
    }
    game.gameInProgress = true
    return game
}

function removePlayer(roomCode,username){
    const game = this.getGame(roomCode)
    if(!game) return
    const players = game.players
    const indexOfPlayer = players.map(p=>p.username).indexOf(username)
    if(indexOfPlayer == -1) return
    game.count--
    if(game.gameInProgress) players[indexOfPlayer].online = false
    else players.splice(indexOfPlayer,1)
    if(game.count == 0) {
        setTimeout(
            () => {
                if(game.count == 0) {
                    console.log('deleting '+game.roomCode)
                    const index = this.games.map((g)=>g.roomCode).indexOf(roomCode)
                    this.games.splice(index,1)
                } else console.log('delete abort')
            } , 
            // giving users 60 seconds to rejoin
            1000*60
        )
    }
}

export default {
    games : [],
    createGame,
    joinGame,
    roomCodeGenerator,
    getGame,
    randomCode,
    userCanJoin,
    assignTeams,
    playBall,
    updateGame,
    gameOver,
    startGame,
    changeBatsman,
    changeBowler,
    nextPlayer,
    removePlayer,
    totalInnings : 2
}