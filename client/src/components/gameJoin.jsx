import React, { useContext, useEffect } from "react";

import { context } from "../context/context";
import GameStart from "../pages/gameStart/gameStart.jsx";

const GameJoin = ({ uuid, socket }) => {
  const data = useContext(context);
  const [hostView, setHostView] = data.hostview;
  const [playerView, setPlayerView] = data.playerview;
  //const [numRounds, setNumRounds] = data.numrounds;
  const [players, setPlayers] = data.gameplayers;
  //const [startTimer, setStartTimer] = data.startTimer
  const [numRoundEntries, setNumRoundEntries] = data.numRoundEntries;
  const [numPlayers, setNumPlayers] = data.numGamePlayers;


  useEffect(() => {
    setHostView("hostSetUp");
    setPlayerView("playerSetUp");
    //setNumRounds(3);
    setPlayers("");
    setNumRoundEntries(0)
    setNumPlayers(0)

    socket.emit("updateClientStartScreen", uuid);
  }, []);

  return <GameStart uuid={uuid} socket={socket} />;
};

export default GameJoin;
