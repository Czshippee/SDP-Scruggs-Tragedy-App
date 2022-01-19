import React, { createContext, useState, useEffect } from "react";

const useLocalStorageState = (key, defaultValue) => {
  const [state, setState] = useState(() => {
    let value;
    try {
      value = sessionStorage.getItem(key) || String(defaultValue);
    } catch {
      value = defaultValue;
    }
    return value;
  });

  useEffect(() => {
    sessionStorage.setItem(key, state);
  }, [state]);
  
  return [state, setState];
};

export const context = createContext();

export const AppData = (props) => {

  // shared data
  const [counter, setCounter] = useLocalStorageState("counter", 40)
  const [timeRounds, setTimeRounds] = useLocalStorageState("timeRounds", 40);
  const [startTimer, setStartTimer] = useLocalStorageState("startTimer", false)

  //host data
  const [hostView, setHostView] = useLocalStorageState("hostView", "hostSetUp");
  const [gameID, setGameID] = useLocalStorageState("gameID", 0);
  const [gameName, setGameName] = useLocalStorageState("gameName", "");
  const [forgiveness, setForgiveness] = useLocalStorageState("forgiveness", "");
  const [resources, setResources] = useLocalStorageState("resources", 20);
  const [numRounds, setNumRounds] = useLocalStorageState("numRound", 3);
  const [players, setPlayers] = useLocalStorageState("gamePlayers", "");
  const [numPlayers, setNumPlayers] = useLocalStorageState("numPlayers", 0)
  const [numRoundEntries, setNumRoundEntries] = useLocalStorageState("numRoundEntries", 0)
  const [latestSubmit, setLatestSubmit] = useLocalStorageState("latestName", "");
  const [roundPlayers, setRoundPlayers] = useLocalStorageState("roundPlayers", "");
  const [roundFarming, setRoundFarming] = useLocalStorageState("roundFarming", "")    // comma separated string that aligns withroundPlayers for farming amount
  const [roundPasturing, setroundPasturing] = useLocalStorageState("roundPasturing", "")
  const [roundReserve, setRoundReserve] = useLocalStorageState("roundReserve", "")
  const [roundFarmingScore, setRoundFarmingScore] = useLocalStorageState("roundFarmingScore", "")   // comma separated string that aligns with roundPlayers for farming score
  const [roundPasturingScore, setRoundPasturingScore] = useLocalStorageState("roundPasturingScore", "")
  const [roundReserveScore, setRoundReseerve] = useLocalStorageState("roundReserveScore", "")
  const [roundScore, setRoundScore] = useLocalStorageState("roundScore", ""); // round scores
  const [scores, setScores] = useLocalStorageState("scores", "") // game scores
  
  //player data
  const [playerView, setPlayerView] = useLocalStorageState("playerView", "playerSetUp");
  const [playerGameID, setPlayerGameID] = useLocalStorageState("playerGameID", "");
  const [playerName, setPlayerName] = useLocalStorageState("playerName", "");
  const [playerNickName, setPlayerNickName] = useLocalStorageState("playerNickName", "")
  const [experience, setExperience] = useLocalStorageState("experience", "")
  const [playerRoundInput, setPlayerRound] = useLocalStorageState("playerRoundInput", 0);
  const [prevRound, setPrevRound] = useLocalStorageState("prevRound", 0);
  const [score, setScore] = useLocalStorageState("score", 10);
  const [farmingScore, setFarmingScore] = useLocalStorageState("farmScore", 0)
  const [pasturingScore, setPasturingScore] = useLocalStorageState("pasturScore", 0)
  const [reserveScore, setReserveScore] = useLocalStorageState("reserveScore", 0)

  return (
    <context.Provider
      value={{
        hostview: [hostView, setHostView], 
        gameid: [gameID, setGameID],
        gameName : [gameName, setGameName],
        timeRounds : [timeRounds, setTimeRounds],
        numrounds: [numRounds, setNumRounds],
        forgiveness : [forgiveness, setForgiveness],
        resources : [resources, setResources],
        playerview : [playerView, setPlayerView],
        playergameid : [playerGameID, setPlayerGameID],
        playername : [playerName, setPlayerName],
        playerNickname  : [playerNickName, setPlayerNickName],
        experience : [experience, setExperience],
        gameplayers : [players, setPlayers], 
        numGamePlayers : [numPlayers, setNumPlayers],
        numRoundEntries : [numRoundEntries, setNumRoundEntries],
        roundInput : [playerRoundInput, setPlayerRound],
        SubmittedNames : [latestSubmit, setLatestSubmit],
        score : [score, setScore],
        prevRound : [prevRound, setPrevRound],
        roundPlayers : [roundPlayers, setRoundPlayers],
        counter : [counter, setCounter],
        startTimer : [startTimer, setStartTimer],
        roundFarmScore : [farmingScore, setFarmingScore],
        roundPastureScore : [pasturingScore, setPasturingScore],
        roundReserveScore : [reserveScore, setReserveScore],
        hostFarmingAmount : [roundFarming, setRoundFarming],
        hostPaturingAmount : [roundPasturing, setroundPasturing],
        hostReserveAmount : [roundReserve, setRoundReserve],
        hostFarmingScore : [roundFarmingScore, setRoundFarmingScore],
        hostPasturingScore : [roundPasturingScore, setRoundPasturingScore],
        hostReserveScore : [roundReserveScore, setRoundReseerve],
        hostRoundScore : [roundScore, setRoundScore],
        gameScores : [scores, setScores]
      }}
    >
      {props.children}
    </context.Provider>
  );
};
