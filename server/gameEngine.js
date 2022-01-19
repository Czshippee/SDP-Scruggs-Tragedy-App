const schedule = require("node-schedule");

const {
  games,
  archivedGames,
  clients,
  archivedClients,
  map,
  //isps,
  Client,
  Game,
  // ISPExists,
  // addISP,
  //removeISP,
  getClient,
  clientExists,
  getArchivedClient,
  restoreArchivedClient,
  restoreArchivedGame,
  archivedClientExists,
  updateClient,
  hasGameStarted,
  gameExists,
  getGame,
  getNumPlayersInGame,
  getGameTimeRounds,
  getGameRound,
  getArchivedGame,
  ArchivedGameExists,
  addPlayertoGame,
  addPlayertoPending,
  movePlayerFromGame,
  moveArchivedClientToPlayer,
  activatePendingPlayers,
  removePlayerFromGame,
  removeArchivedPlayerfromGame,
  removePendingPlayerFromGame,
  moveArchivedPlayerToPending,
  getGameID,
  //clientWithISPExists,
  nicknameExists,
  nameExists,
  clientInGameExists,
  clientInArchivedGameExists,
  archivedClientInArchivedGameExists,
  archivedClientinGameExists,
  isGameHost,
  isGamePlayer,
  isGamePlayerPending,
  isHostGone,
  setHostLeft,
  getGameViaClient,
  getGameViaArchivedClient,
  getArchivedGameViaClient,
  mapSocketID,
  getUUID,
  removeClient,
  removeGame,
  moveGameToArchive,
  moveClientToArchive,
  startGame,
  endGame,
  updatePlayerPlay,
  incrementRound,
  getRoundSubInfo,
  addPlayerSubToGameHistory,
  autoFillUnSubmittedPlayerData,
  generateRoundData,
  generateRoundTable,
  generateGameStat,
  generateGameTable,
  generatePlayerData,
  getPlayerRanking,
} = require("./user");

let io;

exports.init = (socketio, socket) => {
  io = socketio;
  gamesocket = socket;

  let {
    updateClientStartScreen,
    updateHost,
    updatePlayer,
    hostCreateGame,
    onPlayerJoinAttempt,
    onHostGameStart,
    onPlayerSubmission,
    onHostEndsRound,
    onNewRound,
    onHostEndGame,
    onDisconnection,
  } = makeFunctions(gamesocket);

  gamesocket.on("updateClientStartScreen", updateClientStartScreen);
  gamesocket.on("updateHost", updateHost);
  gamesocket.on("updatePlayer", updatePlayer);
  gamesocket.on("hostCreateGame", hostCreateGame);
  gamesocket.on("playerjoinattempt", onPlayerJoinAttempt);
  gamesocket.on("hostGameStart", onHostGameStart);
  gamesocket.on("playerSubmission", onPlayerSubmission);
  gamesocket.on("hostEndedRound", onHostEndsRound);
  gamesocket.on("hostNewRound", onNewRound);
  gamesocket.on("hostEndedGame", onHostEndGame);
  gamesocket.on("disconnect", onDisconnection);
};

const clientTimer = (client) => {
  var game;
  console.log(client);
  if (client === undefined) {
    return 
  }
  if (!clientExists(client.uuid)) {
    if (clientInArchivedGameExists(client.uuid)) {
      game = getArchivedGameViaClient(client);
      if (isGameHost(game, client)) {
        //setHostLeft(game)
        removeGame(client.uuid);
        // gamesocket.to(game.gameid).emit("hostLeft");
        io.in(game.gameid).emit("hostLeft");
        console.log("archived games cleanup: ", archivedGames, "\n");
      }
    }
    removeClient(client.uuid);
    //removeISP(gamesocket.handshake.address);
    console.log("archived clients cleanup: ", archivedClients, "\n");
  }
};

// const cleanup = () => {
//   // const currentTime = Math.floor(Date.now() / 1000);
//   // const expirytime = 10;
//   for (var i = archivedGames.length-1; i >= 0; i--) {
//     let game = archivedGames[i];
//     if (isHostGone(game)) {
//       archivedGames.splice(i, 1);
//       console.log("archived games cleanup: ", archivedGames, "\n")
//     }
//   }
// for (var i = archivedClients.length-1; i >= 0; i--) {
//   let client = archivedClients[i];
//   if ((currentTime - client.clientTimeStamp) > expirytime) {
//     archivedClients.splice(i, 1);
//   }
// }
// console.log("archived clients cleanup: ", archivedClients)
// console.log("archived games cleanup: ", archivedGames, "\n")
//};

const makeFunctions = (gamesocket) => {
  // the two buttons for arrow nav is the only way url switching maintains socket

  const onDisconnection = () => {
    console.log("disconnection!");
    var game;
    const uuid = getUUID(gamesocket.id);
    const client = getClient(uuid);

    console.log("disconnected client: ", client)

    if (clientInGameExists(uuid)) {
      // active player in game with host currently present
      game = getGameViaClient(client);
      if (isGameHost(game, client)) {
        gamesocket.to(game.gameid).emit("hostMaybeLeft"); // need to refactor UI
        moveGameToArchive(game);
      }
      if (isGamePlayer(game, client) || isGamePlayerPending(game, client)) {

        console.log("disconnected client is game player or pending player")
        gamesocket.emit("leftGame");
        removePlayerFromGame(game, client);
        var name = client.nickname
        var gameStarted = hasGameStarted(game)
        console.log(name)
        
        gamesocket.to(game.host.socketid).emit("playerLeft", { players: game.players, subPlayers: game.submittedPlayers, numPlayers: game.players.length, numSubs: game.submittedPlayers.length, nickLeft: name, gameStarted: gameStarted })
      }
      gamesocket.leave(game.gameid);
    }
    if (clientInArchivedGameExists(uuid)) {
      // active player in game with host not present
      game = getArchivedGameViaClient(client);
      if (isGamePlayer(game, client) || isGamePlayerPending(game, client)) {
        gamesocket.emit("leftGame");
        removePlayerFromGame(game, client);
        var name = client.nickname
        var gameStarted = hasGameStarted(game)
        gamesocket.to(game.host.socketid).emit("playerLeft", { players: game.players, subPlayers: game.submittedPlayers, numPlayers: game.players.length, numSubs: game.submittedPlayers.length, nickLeft: name, gameStarted: gameStarted })
        
      }
      gamesocket.leave(game.gameid);
    }
    moveClientToArchive(uuid);

    setTimeout(() => {
      clientTimer(client);
    }, 1000 * 10); // change to 30 seconds for prod

    console.log("clients: ", clients);
    console.log("games: ", games);
    console.log("archived clients: ", archivedClients);
    console.log("archived games: ", archivedGames);
    console.log("map: ", map);
    console.log("rooms: ", io.sockets.adapter.rooms, "\n");
  };

  const updateClientStartScreen = (uuid) => {
    var client;
    var game;

    if (archivedClientExists(uuid)) {
      client = getArchivedClient(uuid);
      restoreArchivedClient(client);
    } else if (clientExists(uuid)) {
      client = getClient(uuid);
    } else {
      client = new Client("NA", "NA", uuid, gamesocket.id, "NA", "NA");
      clients.push(client);
    }
    updateClient(client, gamesocket.id, "NA", "NA", "NA", "NA");
    mapSocketID(uuid, gamesocket.id);

    if (clientInGameExists(uuid)) {
      game = getGameViaClient(client);
      if (isGameHost(game, client)) {
        // host presses back button in game (need to implement alerts)
        gamesocket.to(game.gameid).emit("hostLeft");
        moveGameToArchive(game);
        removeGame(uuid);
      }
      if (isGamePlayer(game, client)) {
        removePlayerFromGame(game, client);
        var name = client.nickname
        var gameStarted = hasGameStarted(game)
        gamesocket.to(game.host.socketid).emit("playerLeft", { players: game.players, subPlayers: game.submittedPlayers, numPlayers: game.players.length, numSubs: game.submittedPlayers.length, nickLeft: name, gameStarted: gameStarted })
        
      }
      if (isGamePlayerPending(game, client)) {
        removePendingPlayerFromGame(game, client);
      }
      gamesocket.leave(game.gameid);
    }
    if (clientInArchivedGameExists(uuid)) {
      game = getArchivedGameViaClient(client);
      if (isGameHost(game, client)) {
        // direct url from host, and players leave from disconnection
        removeGame(uuid);
      }
      if (isGamePlayer(game, client)) {
        // direct url from player
        removePlayerFromGame(game, client);
        var name = client.nickname
        var gameStarted = hasGameStarted(game)
        gamesocket.to(game.host.socketid).emit("playerLeft", { players: game.players, subPlayers: game.submittedPlayers, numPlayers: game.players.length, numSubs: game.submittedPlayers.length, nickLeft: name, gameStarted: gameStarted })
        
      }
      if (isGamePlayerPending(game, client)) {
        removePendingPlayerFromGame(game, client);
      }
      gamesocket.leave(game.gameid);
    }

    console.log("clients: ", clients);
    console.log("games: ", games);
    console.log("archived clients: ", archivedClients);
    console.log("archived games: ", archivedGames);
    console.log("map: ", map);
    console.log("rooms: ", io.sockets.adapter.rooms, "\n");
  };

  const updateHost = (uuid) => {
    var client;
    var game;

    if (clientExists(uuid)) {
      client = getClient(uuid);
    } else if (archivedClientExists(uuid)) {
      client = getArchivedClient(uuid);
      restoreArchivedClient(client);
    } else {
      client = new Client("NA", "NA", uuid, gamesocket.id, "NA", "NA");
      clients.push(client);
    }
    updateClient(client, gamesocket.id);
    mapSocketID(uuid, gamesocket.id);

    if (clientInGameExists(uuid)) {
      game = getGameViaClient(client);
      if (isGamePlayer(game, client)) {
        removePlayerFromGame(game, client);
        var name = client.nickname
        var gameStarted = hasGameStarted(game)
        gamesocket.to(game.host.socketid).emit("playerLeft", { players: game.players, subPlayers: game.submittedPlayers, numPlayers: game.players.length, numSubs: game.submittedPlayers.length, nickLeft: name, gameStarted: gameStarted })
        
      }
      if (isGamePlayerPending(game, client)) {
        removePendingPlayerFromGame(game, client);
      }
    }
    if (clientInArchivedGameExists(uuid)) {
      game = getArchivedGameViaClient(client);
      if (isGameHost(game, client)) {
        restoreArchivedGame(game);
        gamesocket.join(game.gameid);
      }
      if (isGamePlayer(game, client)) {
        removePlayerFromGame(game, client);
        var name = client.nickname
        var gameStarted = hasGameStarted(game)
        gamesocket.to(game.host.socketid).emit("playerLeft", { players: game.players, subPlayers: game.submittedPlayers, numPlayers: game.players.length, numSubs: game.submittedPlayers.length, nickLeft: name, gameStarted: gameStarted })
        
      }
      if (isGamePlayerPending(game, client)) {
        removePendingPlayerFromGame(game, client);
      }
    }

    console.log("clients: ", clients);
    console.log("games: ", games);
    console.log("archived clients: ", archivedClients);
    console.log("archived games: ", archivedGames);
    console.log("map: ", map);
    console.log("rooms: ", io.sockets.adapter.rooms, "\n");
  };

  const updatePlayer = (uuid) => {
    var client;
    var game;

    if (clientExists(uuid)) {
      client = getClient(uuid);
    } else if (archivedClientExists(uuid)) {
      client = getArchivedClient(uuid);
      restoreArchivedClient(client);
    } else {
      client = new Client("NA", "NA", uuid, gamesocket.id, "NA", "NA");
      clients.push(client);
    }
    updateClient(client, gamesocket.id);
    mapSocketID(uuid, gamesocket.id);

    if (clientInGameExists(uuid)) {
      game = getGameViaClient(client);
      if (isGameHost(game, client)) {
        gamesocket.to(game.gameid).emit("hostLeft");
        moveGameToArchive(game);
        removeGame(uuid);
      }
    } else {
      if (client.getRole() == "player"){
        gamesocket.emit("leftGame") // idea is to send players back to start screen
      } 
    }

    console.log("clients: ", clients);
    console.log("games: ", games);
    console.log("archived clients: ", archivedClients);
    console.log("archived games: ", archivedGames);
    console.log("map: ", map);
    console.log("rooms: ", io.sockets.adapter.rooms, "\n");
  };

  const hostCreateGame = (
    { uuid, gameName, timeRounds, forgive },
    callback
  ) => {
    // const int = Math.floor(Math.random() * 90000) + 10000;
    // const gameID = int.toString();
    var client = getClient(uuid);
    var gameNameError = false;

    updateClient(client, gamesocket.id, "host", "host", "host");
    if (gameExists(gameName)) {
      gameNameError = true;
    } else {
      var game = new Game(client, gameName, timeRounds, forgive);
      var subPlayer = game.submittedPlayers;
      games.push(game);
      gamesocket.join(gameName);
      mapSocketID(uuid, gamesocket.id);

      console.log("clients: ", clients);
      console.log("games: ", games);
      console.log("archived clients: ", archivedClients);
      console.log("archived games: ", archivedGames);
      console.log("map: ", map);
      console.log("rooms: ", io.sockets.adapter.rooms, "\n");
    }
    callback({ gameName, timeRounds, forgive, gameNameError, subPlayer });
  };

  const onPlayerJoinAttempt = ({ uuid, name, nickname, room, experience }, callback) => {
    var error = false;
    var pending = false;
    var nickError = false;
    var nameError = false;
    var client = getClient(uuid);
    var game;

    if (gameExists(room)) {
      game = getGame(room);
      
      if (!nameExists(game, name)) {
        updateClient(client, gamesocket.id, name, nickname, "player", experience);
        if (hasGameStarted(game)) {
          
          addPlayertoPending(client, game);
          gamesocket.join(room);
          var name = client.nickname
          console.log(game.host.socketid)
          gamesocket.to(game.host.socketid).emit("playerJoinedPending", {pendingName : name} );

          pending = true
        } else {
          addPlayertoGame(client, game);
        
          gamesocket.join(room);
          gamesocket
            .to(game.host.socketid)
            .emit("playerJoined", {
              players: game.players,
              numPlayers: game.players.length,
            });
        }
      } else {
        nameError = true;
        console.log("NICKERROR")
      }

    } else {
      error = true;
    }
    //mapSocketID(uuid, gamesocket.id);
    console.log("clients: ", clients);
    console.log("games: ", games);
    console.log("archived clients: ", archivedClients);
    console.log("archived games: ", archivedGames);
    console.log("map: ", map);
    console.log("rooms: ", io.sockets.adapter.rooms, "\n");
    callback({ pending, error, nameError });
  };

  const onHostGameStart = ({ gameName }, callback) => {
    //var error = false;
    game = getGame(gameName);
    if (getNumPlayersInGame(game) !== 0) {
      startGame(game);
      const time = getGameTimeRounds(game);
      //const timeStamp =  (Date.now() / 1000) + time
      gamesocket.to(gameName).emit("hostStartedGame", game.currentRound);
    }
    callback({ numPlayers: game.players.length });
  };

  const onPlayerSubmission = (
    { uuid, farmingInput, pastureInput, reserveInput },
    callback
  ) => {
    const client = getClient(uuid);
    const game = getGameViaClient(client) || getArchivedGameViaClient(client);
    if (game != undefined) {
      const round = getGameRound(game);
      addPlayerSubToGameHistory(game, client, round, farmingInput, pastureInput, reserveInput)
      const [subCount, subPlayers] = getRoundSubInfo(game)
      gamesocket.to(game.host.socketid).emit("playerSubmitted", { subCount, subPlayers });
      callback({ error: false });
    } else {
      callback({ error: true });
    }
  };

  const onHostEndsRound = ({ uuid }, callback) => {
    const client = getClient(uuid);
    const game = getGameViaClient(client);
    const round = game.currentRound.toString()

    autoFillUnSubmittedPlayerData(game)
    generateRoundData(game);

    const roundTable = generateRoundTable(game)
    const gameStatSummary = generateGameStat(game)
    game.players.forEach((client) => {
      [playerData, playerScores] = generatePlayerData(game, client)
      //console.log("response: ", response);
      gamesocket.to(client.socketid).emit("roundResults", { playerData, playerScores });
    })
    console.log(game.gameHistory[round])
    callback({ leaderboardTable: roundTable, roundData: game.gameHistory[round], gameStatSum: gameStatSummary, round: round, error: false });
  };

  const onNewRound = ({ uuid, gameName }, callback) => {
    var error = false;
    const client = getClient(uuid);
    const game = getGameViaClient(client);
    if (getNumPlayersInGame(game) !== 0 || game.pendingPlayers != 0) {
      const timeRounds = getGameTimeRounds(game);
      incrementRound(game);
      activatePendingPlayers(game);
      gamesocket.to(gameName).emit("hostStartedNewRound", game.currentRound);
    } else {
      error = true;
    }
    callback({ numPlayers: game.players.length, error: error });
  };

  const onHostEndGame = ({ uuid, gameName }, callback) => {
    const game = getGame(gameName);
    const roundTable = generateRoundTable(game) 
    const gameTable = generateGameTable(game)

    game.players.forEach((client) => {
      const rank = getPlayerRanking(client, roundTable)
      gamesocket.to(client.socketid).emit("hostEndedGame", rank);
      gamesocket.to(client.socketid).leave(gameName)
    })
    gamesocket.leave(gameName)
    endGame(game)
    moveGameToArchive(game)
    removeGame(uuid)
    callback({ data: game.gameHistory, table: gameTable })
  }

  return {
    updateClientStartScreen,
    updateHost,
    updatePlayer,
    hostCreateGame,
    onPlayerJoinAttempt,
    onHostGameStart,
    onPlayerSubmission,
    onHostEndsRound,
    onNewRound,
    onHostEndGame,
    onDisconnection,
  };
};
