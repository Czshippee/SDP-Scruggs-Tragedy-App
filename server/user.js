const payoffTable = require("./payoffTable").payoffTable

const games = []; 
const archivedGames = []
const clients = [];
const archivedClients = [];
const map = {}

class Client {
  name;
  nickname;
  uuid;
  socketid;
  role;
  experience;
  //clientTimeStamp;
  //score;
  //playHistory;
  constructor(name, nickname, uuid, socketid, role, experience) {
    this.name = name;
    this.nickname = nickname,
    this.uuid = uuid;
    this.socketid = socketid;
    this.role = role;
    this.experience = experience
    //this.clientTimeStamp = Math.floor(Date.now() / 1000);
    //this.score = 0;
    //this.playHistory = {};
  }

  updateSocketId(socketid) {
    this.socketid = socketid; 
  }

  updateRole(role) {
    this.role = role
  }

  getRole(){
    return this.role
  }

  updateExperience(experience) {
    this.experience = experience
  }

  updateNickname(nickname) {
    this.nickname = nickname
  }

  updateName(name) {
    this.name = name
  }

  // resetScore() {
  //   this.score = 0 
  // }

  // addScore(amount) {
  //   this.score = this.score + amount
  // }

  // clearHistory() {
  //   this.playHistory = {}
  // }

  // updatePlay(round, farming, pasturing, reserve) {
  //   this.playHistory[round] = { farming, pasturing, reserve }
  // }

  populateFields(name, nickname, uuid, socketid, role) {
    this.name = name;
    this.nickname = nickname,
    this.uuid = uuid;
    this.socketid = socketid;
    this.role = role;
  };
}

class Game {
  host; // host client object
  players; // list of client objects
  archivedPlayers;
  pendingPlayers;
  submittedPlayers;   // rounds submitted players
  gameid; // generated game pin
  timeRounds;
  forgiveness;
  hasStarted; // boolean that states if game is underway
  hasEnded; // bool if game ended
  //hostLeft;
  //gameTimeStamp; // time that object gets created in seconds 
  currentRound;
  gameHistory; // player history of scores, inputs
  drawHistory;  // history of farming multiplier from draw
  constructor(host, gameName, timeRounds, forgiveness) {
    this.hasStarted = false;
    this.hasEnded = false;
    //this.hostLeft = false;
    this.host = host;
    this.gameid = gameName
    this.timeRounds = timeRounds;
    this.forgiveness = forgiveness;
    this.players = [];
    this.archivedPlayers = [];
    this.pendingPlayers = [];
    this.submittedPlayers = [];
    //this.gameTimeStamp = Math.floor(Date.now() / 1000)
    this.currentRound = 1;
    this.gameHistory = {} 
    this.drawHistory = {}
  }

  addPlayer(player) {
    this.players.push(player);
  }

  addPending(player) {
    this.pendingPlayers.push(player)
  }

  addSubmitted(player) {
    this.submittedPlayers.push(player)
  }

  activatePending() {
    for (var i = this.pendingPlayers.length - 1; i >= 0; i--) {
      const player = this.pendingPlayers.splice(i, 1)[0];
      this.players.push(player)
      this.initPlayerForStart(player)
    }
  }

  removePlayersForEndgame() {
    this.players = []
    this.archivedPlayers = []
    this.pendingPlayers = []
    this.submittedPlayers = []
  }

  removePlayer(player) {
    const index = this.players.findIndex((p) => p === player);
    if (index !== -1) {
      this.players.splice(index, 1);
    }
  }

  removeArchivedPlayer(player) {
    const index = this.archivedPlayers.findIndex((p) => p === player);
    if (index !== -1) {
      this.archivedPlayers.splice(index, 1);
    }
  }

  removePendingPlayer(player) {
    const index = this.pendingPlayers.findIndex((p) => p === player);
    if (index !== -1) {
      this.pendingPlayers.splice(index, 1);
    }
  }

  movePlayerToArchive(player) {
    const index = this.players.findIndex((p) => p === player);
    if (index != -1) {
      const pl = this.players.splice(index, 1)[0];
      this.archivedPlayers.push(pl);
    }
  }

  moveArchivedPlayerToPlayers(player) {
    const index = this.archivedPlayers.findIndex((p) => p === player);
    if (index != -1) {
      const pl = this.archivedPlayers.splice(index, 1)[0];
      this.players.push(pl)
    }
  }

  initPlayerForStart(player) { 
    // player.resetScore()
    // player.clearHistory() 
  }

  initPlayersForStart() {
    // this.players.forEach((player) => {
    //   player.resetScore()
    //   player.clearHistory()
    // })
    //console.log("hi")
  }

  incrementRound() {
    this.currentRound = this.currentRound + 1
    this.gameHistory[this.currentRound.toString()] = {}
    this.resetSubmittedPlayers()
  }  

  updateHistory(data) {
    this.gameHistory[this.currentRound] = data
  }

  resetSubmittedPlayers() {
    this.submittedPlayers = []
  }

  gameStart() {
    this.hasStarted = true
    this.currentRound = 1
    this.gameHistory["1"] = {}
    this.resetSubmittedPlayers()
  }

  gameEnd() {
    this.removePlayersForEndgame()
    this.hasEnded = true

  }

  getGameSize() {
    return this.players.length
  }

  setHostLeft() {
    this.hostLeft = true;
  }
};

// const ISPExists = (isp) => {
//   const index = isps.findIndex((i) => i === isp)
//   if (index != -1) {
//     return true;
//   } else {
//     return false;
//   }
// }

// const addISP = (isp) => {
//   if (!ISPExists(isp)) {
//     isps.push(isp)
//   }
// }

// const removeISP = (isp) => {
//   const index = isps.findIndex((i) => i === isp)
//   if (index = -1) {
//     isps.splice(index, 1)
//   }
// }

const mapSocketID = (uuid, socketid) => {
  map[uuid] = socketid;
};

const getUUID = (socketid) => {
  return Object.keys(map).find(key => map[key] === socketid);
};

const removeClient = (uuid) => {
  const index = archivedClients.findIndex((client) => client.uuid === uuid)
  if (index != -1) {
    archivedClients.splice(index, 1)
    //delete map[uuid]
  }
};

const removeGame = (uuid) => {
  const index = archivedGames.findIndex((game) => game.host.uuid == uuid)
  if (index != -1) {
    archivedGames.splice(index, 1)
  }
};

const clientExists = (uuid) => {
  const index = clients.findIndex((client) => client.uuid === uuid);
  if (index != -1) {
    return true;
  } else {
    return false;
  }
};

const archivedClientExists = (uuid) => {
  const index = archivedClients.findIndex((client) => client.uuid === uuid);
  if (index != -1) {
    return true;
  } else {
    return false;
  }
}

const getClient = (uuid) => {
  const index = clients.findIndex((client) => client.uuid === uuid);
  if (index != -1) {
    return clients[index];
  }
};

const getArchivedClient = (uuid) => {
  const index = archivedClients.findIndex((client) => client.uuid === uuid);
  if (index != -1) {
    return archivedClients[index];
  }
};

const moveClientToArchive = (uuid) => {
  const index = clients.findIndex((client) => client.uuid === uuid)
    if (index != -1) {
      const client = clients.splice(index, 1)[0]
      archivedClients.push(client);
      delete map[uuid] 
  }
};

const restoreArchivedClient = (client) => {
  const index = archivedClients.findIndex((c) => c === client)
  if (index != -1) {
    const c = archivedClients.splice(index, 1)[0]
    clients.push(c)
  }
}

const updateClient = (client, socketid="", name="", nickname="", role="", experience="") => {
  if (name != "") client.updateName(name)
  if (nickname != "") client.updateNickname(nickname)
  if (role != "")  client.updateRole(role)
  if (socketid != "")  client.updateSocketId(socketid)
  if (experience != "") client.updateExperience(experience)
}

const gameExists = (gameid) => {
  const index = games.findIndex((game) => game.gameid === gameid);
  if (index != -1) {
    return true;
  } else {
    return false;
  }
};

const ArchivedGameExists = (gameid) => {
  const index = archivedGames.findIndex((game) => game.gameid === gameid);
  if (index != -1) {
    return true;
  } else {
    return false;
  }
}

// const clientWithISPExists = (isp) => {
//   var index = clients.findIndex((client) => client.isp === isp);
//   if (index != -1) {
//     return true;
//   } else {
//     return false;
//   }
// }

const nicknameExists = (game, nickname)=>{
  const index = game.players.findIndex((client) => client.nickname === nickname)
  if (index != -1) {
    return true
  } else {
    return false
  }
}

const nameExists = (game, name)=>{
  const index = game.players.findIndex((client) => client.name === name)
  if (index != -1) {
    return true
  } else {
    return false
  }
}



const clientInGameExists = (uuid) => {
  var index;
  for (var i = 0; i < games.length; i++) {
    if (games[i].host.uuid === uuid) {
      return true;
    } 
    index = games[i].players.findIndex((client) => client.uuid === uuid)
    if (index != -1) {
      return true;
    }
  }
  return false;
};

const archivedClientinGameExists = (uuid) => {
  var index;
  for (var i = 0; i < games.length; i++) {
    if (games[i].host.uuid === uuid) {
      return true;
    } 
    index = games[i].archivedPlayers.findIndex((client) => client.uuid === uuid)
    if (index != -1) {
      // const player = archivedGames[i].archivedPlayers.splice(index, 1)[0]
      // archivedGames[i].players.push(player);
      //console.log("HERE!!!")
      return true;
    }
  }
  return false;
}

const clientInArchivedGameExists = (uuid) => {
  var index;
  for (var i = 0; i < archivedGames.length; i++) {
    if (archivedGames[i].host.uuid === uuid) {
      return true;
    } 
    index = archivedGames[i].players.findIndex((client) => client.uuid === uuid)
    if (index != -1) {
      return true;
    }
  }
  return false;
};

const archivedClientInArchivedGameExists = (uuid) => {
  var index;
  for (var i = 0; i < archivedGames.length; i++) {
    if (archivedGames[i].host.uuid === uuid) {
      return true;
    } 
    index = archivedGames[i].archivedPlayers.findIndex((client) => client.uuid === uuid)
    if (index != -1) {
      const player = archivedGames[i].archivedPlayers.splice(index, 1)[0]
      archivedGames[i].players.push(player);
      return true;
    }
  }
  return false;
}

// const getGameID = (uuid) => {
//   for (var i = 0; i < games.length; i++) {
//     if (games[i].host.uuid === uuid) {
//       return games[i].gameid;
//     } else {
//       const index = games[i].players.findIndex((client) => client.uuid === uuid)
//       if (index != -1) {
//         return games[i].gameid 
//       }
//     }
//   }
// };

const getGame = (gameid) => {
  const index = games.findIndex((game) => game.gameid === gameid);
  if (index != -1) {
    return games[index];
  }
};

const getArchivedGame = (gameid) => {
  const index = archivedGames.findIndex((game) => game.gameid === gameid);
  if (index != -1) {
    return archivedGames[index];
  }
};

const getGameViaClient = (client) => {
  for (var i = 0; i < games.length; i++) {
    if (games[i].host.uuid === client.uuid) {
      return games[i];
    } else {
      const index = games[i].players.findIndex((c) => c.uuid === client.uuid)
      if (index != -1) {
        return games[i];
      }
    }
  }
};

const getGameViaArchivedClient = (client) => {
  for (var i = 0; i < games.length; i++) {
    const index = games[i].archivedPlayers.findIndex((c) => c.uuid === client.uuid)
    if (index != -1) {
      return games[i];
    }
  }
}

const getArchivedGameViaClient = (client) => {
  for (var i = 0; i < archivedGames.length; i++) {
    if (archivedGames[i].host.uuid === client.uuid) {
      return archivedGames[i];
    } else {
      const index = archivedGames[i].players.findIndex((c) => c.uuid === client.uuid)
      if (index != -1) {
        return archivedGames[i];
      }
    }
  }
};

const restoreArchivedGame = (game) => {
  const index = archivedGames.findIndex((g) => g === game);
  if (index != -1) {
    const g = archivedGames.splice(index, 1)[0];
    games.push(g);
  }
}

const moveGameToArchive = (game) => {
  const index = games.findIndex((g) => g === game)
    if (index != -1) {
      const g = games.splice(index, 1)[0]
      archivedGames.push(g); 
  }
};

const startGame = (game) => {
  game.initPlayersForStart()
  game.gameStart() 
}

const endGame = (game) => {
  game.gameEnd()
}

const isGameHost = (game, client) => {
  if (game.host.uuid === client.uuid) {
    return true;
  } else {
    return false;
  }
};

const isGamePlayer = (game, client) => {
  const index = game.players.findIndex((c) => c.uuid === client.uuid)
  if (index != -1) {
    return true;
  } else {
    return false;
  }
};

const isGamePlayerPending = (game, client) => {
  const index = game.pendingPlayers.findIndex((c) => c.uuid === client.uuid)
  if (index != -1) {
    return true;
  } else {
    return false;
  }
} 

const getNumPlayersInGame = (game) => {
  return game.players.length
}

const getGameTimeRounds = (game) => {
  return game.timeRounds
}

const getGameForgiveness = (game) => {
  return game.forgiveness
} 

const getGameRound = (game) => {
  return game.currentRound
}

const addPlayertoGame = (client, game) => {
  game.addPlayer(client);
};
 
const addPlayertoPending = (client, game) => {
  game.addPending(client) 
};

const activatePendingPlayers = (game) => {
  game.activatePending()
}

const movePlayerFromGame = (client, game) => {
  game.movePlayerToArchive(client);
};

const moveArchivedClientToPlayer = (client, game) => {
  game.moveArchivedPlayerToPlayers(client)   
}

const hasGameStarted = (game) => {
  return game.hasStarted
} 

const removePlayerFromGame = (game, client) => {
  game.removePlayer(client)
}

const removeArchivedPlayerfromGame = (game, client) => {
  game.removeArchivedPlayer(client);
}

const removePendingPlayerFromGame = (game, client) => {
  game.removePendingPlayer(client)
}

const moveArchivedPlayerToPending = (game, client) => {
  game.addPending(client);
  game.removeArchivedPlayer(client);
}

const updatePlayerPlay = (client, round, farmingInput, pastureInput, reserveInput) => {
  client.updatePlay(round, farmingInput, pastureInput, reserveInput);
}

const incrementRound = (game) => {
  game.incrementRound()
}

const isHostGone = (game) => {
  return game.hostLeft
}

const setHostLeft = (game) => {
  game.setHostLeft()
}

const randint = (lower, upper) => {
  return lower + Math.floor( Math.random() * ( upper + 1 - lower ));
}

const getRoundSubInfo = (game) => {
  var playerList = []
  const num = game.submittedPlayers.length
  game.submittedPlayers.forEach((client) => {
    playerList.push(client.nickname)
  })
  return [num, playerList]
}

const addPlayerSubToGameHistory = (game, client, round, farmingInput, pastureInput, reserveInput) => {
  const currRound = round.toString()
  const clientName = client.name
  game.gameHistory[currRound][clientName] = {
    "farmingAmount" : farmingInput,
    "pastureAmount" : pastureInput,
    "reserveAmount" : reserveInput 
  }
  game.addSubmitted(client)
  //console.log("pasturing: ", game.gameHistory[currRound][clientName])
}

const autoFillUnSubmittedPlayerData = (game) => {
  var unsubPlayers = []
  game.players.forEach((client) => {
    const index = game.submittedPlayers.findIndex((c) => c === client)
    if (index == -1) {
      unsubPlayers.push(client)
    }
  })
  unsubPlayers.forEach((client) => {
    addPlayerSubToGameHistory(game, client, game.currentRound, 0, 0, 10)
  })

  console.log("1. Game History Submitted Players: ", game.gameHistory, "\n")
}

const generatePointsFromRandomDraw = () => {
  var draw = [0,1,2,3,4,5,6,7,8,9]
  var points = []
  for (var i = draw.length-1; i > 0; i--) {
    var j = randint(0, i)
    var temp = draw[i]
    draw[i] = draw[j]
    draw[j] = temp
  }
  for (d in draw) {
    if (draw[d] < 5) {
      points.push(1.5)
    } else if (draw[d] >= 5 && draw[d] < 8) { 
      points.push(1.0)
    } else {
      points.push(.25) 
    }
  }
  return points
}

const getFarmingScore = (game) => {
  //farmingResults = {}
  const round = game.currentRound.toString()
  const obj = game.gameHistory[round]
  const pointsDraw = generatePointsFromRandomDraw()
  obj["roundData"] = {
    "pointsDraw" : pointsDraw
  }
  // game.players.forEach((client) => {
  //   const playerRoundData = client.playHistory[round]
  //   if (playerRoundData != undefined) {
  //     const farmingAmount = playerRoundData["farming"]
  //     var score = 0
  //     for (var i = 0; i < farmingAmount; i ++) {
  //       score = score + pointsDraw[i]
  //     }
  //     farmingResults[client.name] = score
  //   }
  // })
  for (var client in obj) {
    if (client === "roundData") {
      continue
    } else {
      var playerRoundData = obj[client]
      const farmingAmt = playerRoundData["farmingAmount"]
      var score = 0
      for (var i = 0; i < farmingAmt; i ++) {
          score = score + pointsDraw[i]
      }
      playerRoundData["farmingScore"] = score
    }
  }
  console.log("2. Game History Farming Score: ", game.gameHistory, "\n")
  //return farmingResults 
}

const getPasturePayoffValue = (proportion, forgiveness) => {
  var col;
  var row; 
  if (forgiveness == "low") {
    col = 2
  } else if (forgiveness == "medium") { 
    col = 1
  } else {
    col = 0 
  } 
  if (proportion < .30) {
    row = 0
  } else if (proportion > .80) {
    row = payoffTable.length - 1
  } else {
    row = parseFloat(((proportion - .30) * 100).toFixed(0))
  }
  // console.log("row: ", row)
  // console.log("col: ", col)
  return payoffTable[row][col] 
}

const getPasturingScore = (game) => {
  //pasturingResults = {} 
  const round = game.currentRound.toString()
  const forgiveness = getGameForgiveness(game)
  const pasturingTotalPossible = game.getGameSize() * 10
  const obj = game.gameHistory[round] 
  var pasturingTotalAmount = 0

  for (var client in obj) {
    if (client === "roundData") {
      continue
    } else {
      var playerRoundData = obj[client]
      const pasturingAmt = playerRoundData["pastureAmount"]
      pasturingTotalAmount = pasturingTotalAmount + pasturingAmt
    }
  }
  // game.players.forEach((client) => {
  //   const playerRoundData = client.playHistory[round]
  //   // do the if check
  //   if (playerRoundData != undefined) {
  //     const pasturingAmount = playerRoundData["pasturing"]
  //     pasturingTotalAmount = pasturingTotalAmount + pasturingAmount
  //   }
  // })
  if (pasturingTotalAmount == 0) pasturingTotalAmount = 1
  const proportion = parseFloat((pasturingTotalAmount / pasturingTotalPossible).toFixed(2))
  //console.log("proportion: ", proportion)
  const multiplier = getPasturePayoffValue(proportion, forgiveness)
  //console.log("multiplier: ", multiplier)
  // game.players.forEach((client) => {
  //   const playerRoundData = client.playHistory[round]
  //   if (playerRoundData != undefined) {
  //     const pasturingAmount = playerRoundData["pasturing"]
  //     const score = parseFloat((multiplier * pasturingAmount).toFixed(2))
  //     pasturingResults[client.name] = score
  //   }
  // })

  obj["roundData"]["pastureProportion"] = proportion
  obj["roundData"]["pastureMultiplier"] = multiplier

  for (var client in obj) {
    if (client === "roundData") {
      continue
    } else {
      var playerRoundData = obj[client]
      const pasturingAmt = playerRoundData["pastureAmount"]
      const score = parseFloat((multiplier * pasturingAmt).toFixed(2))
      playerRoundData["pasturingScore"] = score
    }
  }
  console.log("3. Game History Pasturing Score: ", game.gameHistory, "\n")
  //return pasturingResults
}

const getReserveScore = (game) => {
  //reserveResults = {}
  const round = game.currentRound.toString()
  const obj = game.gameHistory[round] 
  for (var client in obj) {
    if (client === "roundData") {
      continue
    } else {
      var playerRoundData = obj[client]
      const reserveAmt = playerRoundData["reserveAmount"]
      playerRoundData["reserveScore"] = reserveAmt
    }
  }
  
  // game.players.forEach((client) => {
  //   const playerRoundData = client.playHistory[round]
  //   // another if check
  //   if (playerRoundData != undefined) {
  //     const reserveAmount = playerRoundData["reserve"]
  //     reserveResults[client.name] = reserveAmount
  //   }
  // })

  console.log("4. Game History Reserve Score: ", game.gameHistory, "\n")
  // return reserveResults
}

const getRoundScores = (game) => {
  let prevRound;
  const round = game.currentRound
  const currRound = round.toString()
  const obj = game.gameHistory[currRound]

  //console.log("game history: ", game.gameHistory)

  for (var client in obj) {
    if (client === "roundData") {
      continue
    } else {
      var pd = obj[client]
      console.log("pd: ", pd)
      prev = round - 1
      while (prev >= 0) {
        if (prev === 0) {
          prevRound = '0'
          break
        } else {
          prevRound = prev.toString()
          if (game.gameHistory[prevRound][client] !== undefined) {
            break
          } else {
            prev = prev - 1
          }
        }
      }
      pd["roundScore"] = pd["farmingScore"] + pd["pasturingScore"] + pd["reserveScore"]
      if (prevRound === '0') {
        pd["gameScore"] = pd["roundScore"]
      } else {
        pd["gameScore"] = pd["roundScore"] + game.gameHistory[prevRound][client]["gameScore"]
      }
    }
  }
  console.log("5. Game History Scoring Scores: ", game.gameHistory, "\n")

}

const getRoundStats = (game) => {
  var tempMax = Number.NEGATIVE_INFINITY;
  var tempMin = Number.POSITIVE_INFINITY;
  var MaxRoundScore;
  var MinRoundScore;
  var avgRoundScore;
  var optimalRoundScore;
  const forgiveness = getGameForgiveness(game)
  const n = getNumPlayersInGame(game)
  var sum = 0
  
  if (forgiveness === "low" || forgiveness === "medium") {
    optimalRoundScore = (0.7 * 10 * n) + (n*.3*30)
  } else {
    optimalRoundScore = (0.6 * 10 * n) + (n*.4*30)
  }
  const round = game.currentRound.toString()
  const obj = game.gameHistory[round]
  
  for (var client in obj) {
    if (client === 'roundData') {
      continue
    } else {
      var playerRoundScore = obj[client]["roundScore"]
      sum = sum + playerRoundScore
      if (playerRoundScore < tempMin) {
        tempMin = playerRoundScore
      }
      if (playerRoundScore > tempMax) {
        tempMax = playerRoundScore
      }
    }
  }
  MaxRoundScore = tempMax
  MinRoundScore = tempMin
  avgRoundScore = sum / n
  obj["roundData"]["groupRoundScore"] = sum
  obj["roundData"]["optimalRoundScore"] = optimalRoundScore
  obj["roundData"]["maxRoundScore"] = MaxRoundScore
  obj["roundData"]["minRoundScore"] = MinRoundScore
  obj["roundData"]["avgRoundScore"] = avgRoundScore  

  console.log("6. Game History Stats: ", game.gameHistory, "\n")

}

const generateRoundData = (game) => {
  //roundData = {}
  // scoreResults = {}
  getFarmingScore(game)
  getPasturingScore(game)
  getReserveScore(game)
  getRoundScores(game)
  getRoundStats(game)
}
  


  // game.players.forEach((client) => {
  //   const roundScore = farmingScores[client.name] + pasturingScores[client.name] + reserveScores[client.name]
  //   client.addScore(roundScore)
  //   scoreResults[client.name] = {roundScore : roundScore, score : client.score}
  // })


  // game.players.forEach((client) => {
  //   const playerRoundData = client.playHistory[round]
  //   roundData[client.name] = {
  //     farming: playerRoundData["farming"], 
  //     pasturing : playerRoundData["pasturing"], 
  //     reserve : playerRoundData["reserve"], 
  //     farmingScore : farmingScores[client.name],
  //     pasturingScore : pasturingScores[client.name],
  //     reserveScore : reserveScores[client.name],
  //     roundScore : scoreResults[client.name]["roundScore"],
  //     score : scoreResults[client.name]["score"],
  //     socketid: client.socketid,
  //     name : client.name
  //   }; 
  // })
  //game.updateHistory(roundData);
  //return roundData;

const generateRoundTable = (game) => {
  const round = game.currentRound.toString()
  const obj = game.gameHistory[round]
  var table = []

  for (client in obj) {
    if (client === "roundData") {
      continue
    } else {
      pList = []
      const pd = obj[client]
      console.log(pd)
      pList.push(client)
      pList.push(pd["gameScore"])
      pList.push(pd["roundScore"])
      pList.push(pd["farmingAmount"])
      pList.push(pd["pastureAmount"])
      pList.push(pd["reserveAmount"])
      pList.push(pd["farmingScore"])
      pList.push(pd["pasturingScore"])
      pList.push(pd["reserveScore"])
      table.push(pList)
    }
  }

  console.log(table)
  const leaderboard = table.sort((a, b) => {
    return b[1] - a[1]
  })
  return leaderboard
}

const generateGameStat = (game)=>{
  const numRounds = game.currentRound
  var roundArray = []
  var minArray = []
  var avgArray = []
  var maxArray = []
  var optArray = []
  for (var round in game.gameHistory){
    const obj = game.gameHistory[round]["roundData"]
    const roundStr = "Round "+ round
    roundArray.push(roundStr)
    minArray.push(obj["minRoundScore"])
    avgArray.push(obj["avgRoundScore"])
    maxArray.push(obj["maxRoundScore"])
    optArray.push(obj["optimalRoundScore"])
  }
  return{
    roundArray, minArray, avgArray, maxArray, optArray
  }
}

const generateGameTable = (game)=>{
  const roundTable = generateRoundTable(game)
  var gameTable = []
  for(var i = 0; i < roundTable.length; ++i){
    var row = roundTable[i]
    var player = []
    player.push(i+1)
    player.push(row[0])
    player.push(row[1])
    gameTable.push(player)
  } 
  return gameTable
}

const generatePlayerData = (game, client) => {
  var playerData = []
  var playerScore = []

  console.log("7. Game History Before Error: ", game.gameHistory, "\n")


  for (var round in game.gameHistory) {
    var rd = {}
    const pd = game.gameHistory[round][client.name]
    if (pd !== undefined) {
      rd["round"] = "Round " + round
      rd["farming"] = pd["farmingAmount"]
      rd["pasturing"] = pd["pastureAmount"]
      rd["reserve"] = pd["reserveAmount"]
      playerData.push(rd)
      playerScore.push(pd["roundScore"])
    }
  }
  return [playerData, playerScore]
}

const getPlayerRanking = (client, table) => {
  const name = client.name
  for (var i = 0; i < table.length; i++) {
    const row = table[i]
    const playerName = row[0]
    if (playerName === name) {
      return i + 1;
    }
  }
  return 0;
}


module.exports = {
  games,
  archivedGames,
  clients,
  archivedClients,
  map,
  //isps,
  Client,
  Game,
  //ISPExists,
  //addISP,
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
  //getGameID,
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
};
