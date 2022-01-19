import React, { useContext, useState, useEffect } from "react";

import { context } from "../context/context";
import HostSetUp from "../pages/hostSetUp/hostSetUp.jsx";
import Pregame from "../pages/pregame/pregame.jsx";
import NoMatch from "../pages/noMatch.jsx";
import CalcWait from "../pages/calcWait/calcWait.jsx";
import HostDashboard from "../pages/hostDashboard/hostDashboard.jsx";
import HostRoundSummary from "../pages/hostRoundSummary/hostRoundSummary.jsx"
import GameOver from "../pages/gameOver/gameOver.jsx";

let frame;

const Host = ({ uuid, socket }) => {
  const data = useContext(context);
  const [view, setView] = data.hostview;
  const [playerView, setPlayerView] = data.playerview;
  const [gameName, setGameName] = data.gameName;
  const [forgiveness, setForgiveness] = data.forgiveness;
  const [timeRounds, setTimeRounds] = data.timeRounds;
  const [players, setPlayers] = data.gameplayers;
  const [numPlayers, setNumPlayers] = data.numGamePlayers;
  const [numRoundEntries, setNumRoundEntries] = data.numRoundEntries;
  const [submittedPlayers, setSubmittedPlayers] = data.SubmittedNames;
  
  //const [gameID, setGameID] = data.gameid;
  //const [resources, setResources] = data.resources;
  //const [numRounds, setNumRounds] = data.numrounds;
  //const [clientCows, setClientCows] = data.clientCows;
  //const [roundPlayers, setRoundPlayers] = data.roundPlayers;
  //const [counter, setCounter] = data.counter;
  //const [startTimer, setStartTimer] = data.startTimer
  // const [roundFarmAmount, setRoundFarmAmount] = data.hostFarmingAmount;
  // const [roundPastureAmount, setRoundPastureAmount] = data.hostPaturingAmount;
  // const [roundReserveAmount, setRoundReserveAmount] = data.hostReserveAmount;
  // const [roundFarmScore, setRoundFarmScore] = data.hostFarmingScore;
  // const [roundPastureScore, setRoundPastureScore] = data.hostPasturingScore;
  // const [roundReserveScore, setRoundReserveScore] = data.hostReserveScore;
  // const [roundScore, setRoundScore] = data.hostRoundScore;
  // const [gameScores, setGameScores] = data.gameScores;

  const [gname, setGName] = useState("");
  const [tr, setTr] = useState(40);
  const [low, setLow] = useState(false);
  const [med, setMed] = useState(false);
  const [high, setHigh] = useState(false);

  const [numPlayersError, setNumPlayersError] = useState(false);
  const [gameNameError, setGameNameError] = useState(false)

  const [targetTime, setTargetTime] = useState(0)
  const [remainingSeconds, setRemainingSeconds] = useState(0)

  const [roundData, setRoundData] = useState({})
  const [gameData, setGameData] = useState({})
  const [leaderFinal, setLeaderFinal] = useState([])
  const [leaderBoard, setLeaderBoard] = useState([])
  const [gameStats, setGameStat] = useState({})
  const [emptyObj, setEmptyObj] = useState(true)

  const [emptyName, setEmptyName] = useState(false)
  const [unlistForgive, setUnlistForgive] = useState(false)

  const [random, setRandom] = useState(false)

  const countItDown = () => {
    if (view === "hostDashboard") {
      frame = requestAnimationFrame(() => {
        const diff = Math.floor((targetTime - new Date().getTime()) / 1000);
        console.log(diff)
        setRemainingSeconds(diff);
        if (diff > 0) {
          countItDown();
        }
      });
    }
  }

  useEffect(() => {
    setPlayerView("playerSetUp");
    socket.emit("updateHost", uuid);
    // if (view === "hostRoundSummary") {
    //   socket.emit("hostEndedRound", { uuid }, (response) => {
    //     if (!response.error) {
    //       setRoundData(response.roundData);
    //       setLeaderBoard(response.leaderboardTable);
    //     }
    //   })
    // }
  }, []);

  useEffect(() => {
    socket.on("playerJoined", (response) => {
      setPlayers(() => {
        var names = response.players.map((player) => player.nickname);
        var strPlayer = names.join();
        return strPlayer;
      });
      setNumPlayers(response.numPlayers)
    });

    socket.on("playerJoinedPending", (response)=>{
        console.log("pending added ")
       
    });

    socket.on("playerLeft", (response) => {
      console.log(response)
      setPlayers(() => {
        var names = response.players.map((player) => player.nickname);
        var strPlayer = names.join();
        setPlayers(strPlayer);
      });
      setNumPlayers(response.numPlayers)
      setNumRoundEntries(response.numSubs)
      setSubmittedPlayers(response.subPlayers.join())
      console.log("player left")
      if (response.gameStarted){
        setRandom(true)
        
      }

    });

    socket.on("playerSubmitted", (response) => {
      console.log(response)
      var subPlayerStr = response.subPlayers.join()
      setNumRoundEntries(response.subCount);
      setSubmittedPlayers(subPlayerStr);
    });
  });

  useEffect(() => {
    if (view === "hostDashboard") {
      countItDown()
    }
  }, [view])


  // host creates game 
  const handleClick = (e) => {
    if (gname !== "" && (low || med || high)) {
      var forgive;
      if (low) forgive = "low";
      if (med) forgive = "medium";
      if (high) forgive = "high";

      socket.emit(
        "hostCreateGame",
        {
          uuid: uuid,
          gameName: gname,
          timeRounds: tr,
          forgive: forgive,
        },
        (response) => {
          if (!response.gameNameError) {
            setGameName(response.gameName);
            setTimeRounds(response.timeRounds);
            setForgiveness(response.forgive);
            setSubmittedPlayers(response.subPlayer.join())
            setView("pregame");
          } else {
            setGameNameError(true);
          }
        }
      );
    } else {
      console.log("Must input game name and forgiveness level");
      // add model here instead
      setEmptyName(true)
      setUnlistForgive(true)
    }
  };

  const startGameHandler = (e) => {
    socket.emit("hostGameStart", { gameName }, (response) => {
      if (response.numPlayers !== 0) {
        setNumPlayers(response.numPlayers)
        setTargetTime((timeRounds * 1000) + Date.now()); 
        setView("hostDashboard");
      } else {
        setNumPlayersError(true);
      }
    });
  };

  const endRound = () => {
    setView("calcWait");
    socket.emit("hostEndedRound", { uuid }, (response) => {
      if (!response.error) {
        setRoundData(response.roundData);
        setLeaderBoard(response.leaderboardTable);
        setGameStat(response.gameStatSum);
        setView("hostRoundSummary");
        setEmptyObj(false)
        cancelAnimationFrame(frame)
        console.log(response.roundData)
        console.log(response.leaderboardTable)
      }
    })
  };

  const handleNextRound = (e) => {
    //possibly remove
      socket.emit("hostNewRound", { uuid, gameName }, (response) => {
        if (!response.error) {
          setNumPlayers(response.numPlayers)
          setNumRoundEntries(0)
          // setRoundPlayers("");
          // setLatestPlayer("");
          setSubmittedPlayers("");
          setTargetTime((timeRounds * 1000) + Date.now()); 
          setView("hostDashboard");
        } else {
          setNumPlayersError(true);
        }
      });
    
  };

  const handleEndGame = (e) => {
    socket.emit("hostEndedGame", {uuid, gameName}, (response) => {
      setGameData(response.data)
      console.log(response.data)
      console.log(response.table)
      setLeaderFinal(response.table)
      setView("hostEndGame")
      cancelAnimationFrame(frame)
    })
  }

  const handleGameName = (e) => {
    setGName(e.target.value);
  };

  const handleTimeRounds = (val) => {
    setTr(val);
  };

  const handleLowForgiveness = (e) => {
    setLow(!low);
    if (med) {
      setMed(!med);
    }
    if (high) {
      setHigh(!high);
    }
  };

  const handleMedForgiveness = (e) => {
    setMed(!med);
    if (low) {
      setLow(!low);
    }
    if (high) {
      setHigh(!high);
    }
  };

  const handleHighForgiveness = (e) => {
    setHigh(!high);
    if (low) {
      setLow(!low);
    }
    if (med) {
      setMed(!med);
    }
  };

  const resetNPError= (e)=>{
    setNumPlayersError(false);
  };
  const getPlayersList = (e) => {
    var playerList = players.split(",");
    return playerList;
  };

  const getSubmittedList= (e)=>{
    var subList = submittedPlayers.split(",");
    return subList
  };

  const resetGFError = (e)=>{
    setGameNameError(false);
    setEmptyName(false);
    setUnlistForgive(false);
  };

  

  // const emptyObject = (obj) => {
  //   return JSON.stringify(obj) === '{}'; 
  // }

  // const emptyObjectHandler = (e) => {
  //   if (emptyObject(roundData) || emptyObject(gameStats)) {
  //     setEmptyObj(true)
  //   }
  // }

  if (view === "hostSetUp")
    return (
      <HostSetUp
        uuid={uuid}
        socket={socket}
        timeRound={tr}
        low={low}
        medium={med}
        high={high}
        lowHandler={handleLowForgiveness}
        medHandler={handleMedForgiveness}
        highHandler={handleHighForgiveness}
        gameNameHandler={handleGameName}
        timeRoundHandler={handleTimeRounds}
        buttonHandler={handleClick}
        nameError = {gameNameError}
        emptyName = {emptyName}
        forgiveErr = {unlistForgive}
        resetSubError = {resetGFError}
      />
    );
  if (view === "pregame")
    return (
      <Pregame
        uuid={uuid}
        socket={socket}
        gameName={gameName}
        numPlayers = {numPlayers}
        numPlayersErr={numPlayersError}
        resetNoPlayerErr = {resetNPError}
        playersList={getPlayersList}
        startGameBtn={startGameHandler}
      />
    );
  if (view === "noMatch") {
    return <NoMatch />;
  }
  if (view === "hostDashboard") {
    return (
      <HostDashboard
        numPlayers={numPlayers}
        numSubmissions={numRoundEntries}
        handleEndRound={endRound}
        submittedPlayers = {getSubmittedList}
        timer={remainingSeconds}
        gameName={gameName}
        random = {random}
      />
    );
  }
  if (view === "hostRoundSummary") {
    return (
      <HostRoundSummary
        nextRoundHandler={handleNextRound}
        endGameHandler={handleEndGame}
        // playerNames={roundPlayers}
        // farmingAmounts={roundFarmAmount}
        // farmingScores={roundFarmScore}
        // pasturingAmounts={roundPastureAmount}
        // pasturingScores={roundPastureScore}
        // reserveAmounts={roundReserveAmount}
        // reserveScores={roundReserveScore}
        // roundScores={roundScore}
        // gameScores={gameScores}
        // emptyObjHandler = {emptyObjectHandler}
        emptyObject = {emptyObj}
        data={roundData}
        table={leaderBoard}
        gameStat={gameStats}
        numPlayers={numPlayers}
      />
    );
  }
  
  if (view === "calcWait") {
    return (
      <CalcWait />
    )
  }
  if (view === "hostEndGame") {
    return (
      <GameOver data = {gameData} table = {leaderFinal}/>
    )
  }
  return null;
};

export default Host;
