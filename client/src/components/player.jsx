import React, { useContext, useEffect, useState } from "react";

import { context } from "../context/context";

import PlayerSetUp from "../pages/playerSetUp/playerSetUp.jsx";
import PlayerPlay from "../pages/playerPlay/playerPlay.jsx";
import GameInterruption from "../pages/gameInterruption/gameInterruption.jsx";
//import PlayerGameInput from "../pages/testEnv/playerGameInput.jsx";
import DummyGame from "../pages/playerGame/playerGameDummy.jsx"
import RoundWait from "../pages/roundWait/roundWait.jsx";
import PendingWait from "../pages/pendingWait/pendingWait.jsx";
import PlayerRoundResult from "../pages/playerRoundResult/playerRoundResult.jsx";
import PlayerGameOver from "../pages/gameOver/playerGameOver.jsx"
import NoMatch from "../pages/noMatch.jsx";
import LoadingPage from "../pages/loadingPage/loadingPage.jsx"

let frame;

const Player = ({ uuid, socket }) => {

  const data = useContext(context);
  const [view, setView] = data.playerview;
  const [hostView, setHostView] = data.hostview;
  const [name, setName] = data.playername;
  const [nickname, setNickname] = data.playerNickname;
  const [room, setRoom] = data.playergameid;
  const [timeRounds, setTimeRounds] = data.timeRounds;
  
  const [roundInput, setRoundInput] = data.roundInput;
  const [experience, setExperience] = data.experience;
  const [score, setScore] = data.score;
  const [round, setRound] = data.prevRound;
  const [farmingScore, setFarmingScore] = data.roundFarmScore;
  const [pasturingScore, setPasturingScore] = data.roundPastureScore;
  const [reserveScore, setReserveScore] = data.roundReserveScore;

  const [playerName, setPlayerName] = useState("")
  const [playerRealName, setPlayerRealName] = useState("")
  const [gameRoom , setGameRoom] = useState("")
  const [priorExp, setPriorExp] = useState("")
  const [farming, setFarming] = useState(0);
  const [pasturing, setPasturing] = useState(0);
  const [reserve, setReserve] = useState(10);
  
  const [targetTime, setTargetTime] = useState(0)
  const [remainingSeconds, setRemainingSeconds] = useState()

  const [hostLeft, setHostLeft] = useState(false)
  const [rejoin, setRejoin] = useState(false)   // message for rejoining potentially
  const [joinError, setJoinError] = useState(false);
  const [nameErr, setNameErr] = useState(false);
  const [formIncomplete, setFormIncomplete] = useState(false)

  const [roundResults, setRoundResults] = useState([])
  const [roundScores, setRoundScores] = useState([])
  const [rank, setRank] = useState()

  const countItDown = () => {
    if (view === "playerRound") {
      frame = requestAnimationFrame(() => {
        const diff = Math.floor((targetTime - new Date().getTime()) / 1000);
        setRemainingSeconds(diff);
        if (diff > 0) {
          countItDown();
        }
      });
    }
  }

  useEffect(() => {
    setHostView("hostSetUp");
    socket.emit("updatePlayer", uuid);
  }, []);

  useEffect(() => {
    socket.on("hostLeft", () => {
      setView("gameInterruption");
    });

    socket.on("hostMaybeLeft", () => {
      setHostLeft(true)
    })

    socket.on("hostStartedGame", (round) => {
      setRound(round);
      //setTargetTime((time * 1000) + Date.now()); 
      setView("playerRound");
    });

    socket.on("roundResults", (response) => {
      // setFarmingScore(response.farmingScore);
      // setPasturingScore(response.pasturingScore);
      // setReserveScore(response.reserveScore);
      // setScore(response.score);
      // setPrevRound(response.round);
      setRoundResults(response.playerData)
      setRoundScores(response.playerScores)
      //console.log(response)
      setView("playerRoundResult");
      //cancelAnimationFrame(frame);
    });

    socket.on("hostStartedNewRound", (round) => {
      // setFarmingScore(0)
      // setPasturingScore(0)
      // setReserveScore(0)
      setFarming(0)
      setPasturing(0)
      setReserve(10)
      //setResources(10);
      setRound(round)
      // setTargetTime((time * 1000) + Date.now()); 
      setView("playerRound"); 
      //setStartTimer(true);
      //setCounter(time)
    });

    // socket.on("playerJoinedPending", () => {
    //   setView("pendingWait");
    // });

    socket.on("leftGame", () => {
      console.log("here!!!!!!")
      setRejoin(true)
      setView("playerSetUp")
      console.log(rejoin)
    })

    socket.on("hostEndedGame", (rank) => {
      setView("playerEndGame")
      setRank(rank)
    })
  }, []);

  useEffect(() => {
    if (view === "playerRound") {
      countItDown()
    }
  }, [view])

  // join a game 
  const handleButton = (event) => {
    if (playerName == "" || playerRealName == "" || gameRoom == "" || priorExp == "") {
      event.preventDefault();
      setFormIncomplete(true)
      // modal for this 
    } else {
      setView("loadingPage")
      socket.emit(
        "playerjoinattempt", 
        { 
          uuid, name : playerRealName,
          nickname : playerName,
          room : gameRoom, 
          experience : priorExp
        },
        (response) => 
        {
          console.log(response.nickError)
          if (!response.error && !response.nameError) {
            setName(playerRealName)
            setNickname(playerName)
            setRoom(gameRoom)
            if (response.pending) {
              setView("pendingWait")
            } else {
              setView("playerplay");
            }
          } else if(response.nameError) {
            
            setNameErr(true);
            setView("playerSetUp")
          } else {
            console.log(response.error);
            setJoinError(true); 
            
            // modal here  
            setView("playerSetUp")       
          }
        }
      );
    }
  };

  // const handleRoundSubmit = (farmingAmt, pasturingAmt, reserveAmt) => {
  //   let farmingInput = farmingAmt;
  //   let pastureInput = pasturingAmt;
  //   let reserveInput = reserveAmt;
  //   if (farmingInput === undefined) {
  //     farmingInput = farming
  //   }
  //   if (pastureInput === undefined) {
  //     pastureInput = pasturing
  //   }
  //   if (reserveInput === undefined) {
  //     reserveInput = reserve 
  //   }
  const handleRoundSubmit = (event) => {
    socket.emit(
      "playerSubmission",
      {
        uuid,
        farmingInput : farming,
        pastureInput : pasturing,
        reserveInput : reserve,
      },
      (response) => {
        if (!response.error) {
          setView("roundWait");
          cancelAnimationFrame(frame);
        }
      }
    );
  };

  const handleNameInput = (event) => { 
    setPlayerRealName(event.target.value);
  };

  const handleRoomInput = (event) => {
    setGameRoom(event.target.value);
  }; 

  const handleNickNameInput = (event) => {
    setPlayerName(event.target.value);
  };

  const handleExperience = (event, data) => {
    setPriorExp(data.value)
  }

  const handleFarmingIncrement = (event) => {
    const newFarmVal = farming + 1
    const newResVal = 10 - newFarmVal - pasturing
    if (newFarmVal >= 0 && newFarmVal <= 10 && newResVal >= 0) {
      setFarming(newFarmVal);
      setReserve(newResVal);
    }
  };

  const handleFarmingDecrement = (event) => {
    const newFarmVal = farming - 1
    const newResVal = 10 - newFarmVal - pasturing
    if (newFarmVal >= 0 && newFarmVal <= 10 && newResVal >= 0) {
      setFarming(newFarmVal);
      setReserve(newResVal);
    }
  };

  const handlePasturingIncrement = (event) => {
    const newPasVal = pasturing + 1
    const newResVal = 10 - newPasVal - farming
    if (newPasVal >= 0 && newPasVal <= 10 && newResVal >= 0) {
      setPasturing(newPasVal);
      setReserve(newResVal);
    }
  };
  
  const handlePasturingDecrement = (event) => {
    const newPasVal = pasturing - 1
    const newResVal = 10 - newPasVal - farming
    if (newPasVal >= 0 && newPasVal <= 10 && newResVal >= 0) {
      setPasturing(newPasVal);
      setReserve(newResVal);
    }
  };

  const resetJoinError = (newVal) => {
    setJoinError(false);
  };

  const resetFormError = (newVal)=>{
    setFormIncomplete(false)
  }

  const resetNErr = (newVal)=>{
    setNameErr(false)
  }

  const resetRejoin = (newVal)=>{
    setRejoin(false);
  }
  

  if (view === "playerSetUp") {
    return (
      <PlayerSetUp
        uuid={uuid}
        socket={socket}
        name={name}
        room={room}
        nameHandler={handleNameInput}
        nicknameHandler={handleNickNameInput}
        roomHandler={handleRoomInput}
        experienceHandler={handleExperience}
        buttonHandler={handleButton}
        rejoin={rejoin}
        reJoinSet ={resetRejoin}
        joinError = {joinError}
        resetJError = {resetJoinError}
        formError = {formIncomplete}
        resetFormError = {resetFormError}
        nameError = {nameErr}
        resetNameErr = {resetNErr}
      />
    );
  }
  if (view == "playerplay") {
    return (
      <PlayerPlay
        uuid={uuid}
        socket={socket}
        name={name}
        nickname={nickname}
        room={room}
      />
    );
  }
  if (view === "gameInterruption") {
    return <GameInterruption />;
  }
  if (view === "noMatch") {
    return <NoMatch />;
  }
  if (view === "playerRound") {
    return (
      <DummyGame
        handleRoundSubmit={handleRoundSubmit}
        nname={nickname}
        //handleFarmingInput={handleFarmingInput}
        //handlePasturingInput={handlePasturingInput}
        farming={farming}
        pasturing={pasturing}
        reserve={reserve}
        incrementFarming={handleFarmingIncrement}
        decrementFarming={handleFarmingDecrement}
        incrementPasturing={handlePasturingIncrement}
        decrementPasturing={handlePasturingDecrement}
        counter={remainingSeconds}
        hostLeft={hostLeft}
        round = {round}
        dataPassed = {roundResults}
        score = {roundScores}
      />
    );
  }
  if (view === "roundWait") {
    return <RoundWait hostLeft={hostLeft}/>;
  }
  if (view === "pendingWait") {
    return <PendingWait hostLeft={hostLeft} />;
  }
  if (view === "playerRoundResult") {
    return (
      <PlayerRoundResult
        // score={score}
        // farmScore={farmingScore}
        // PatureScore={pasturingScore}
        // reserveScore={reserveScore}
        //round={prevRound}
        scores={roundScores}
        data={roundResults}
        hostLeft={hostLeft}
      />
    );
  }
  if (view === "playerEndGame") {
    return (
      <PlayerGameOver rank={rank} />
    );
  }
  if (view === "loadingPage"){
    return (
      <LoadingPage/>
    );
  }

  return null;
};

export default Player;
