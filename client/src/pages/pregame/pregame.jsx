import React, {useState, useEffect} from "react";

import "./pregame.css";
import "semantic-ui-css/semantic.min.css";
import { Button, List, Modal } from "semantic-ui-react";
import {Prompt} from "react-router-dom"

const Pregame = (props) => {
  console.log("uuid: ", props.uuid);
  console.log("socket: ", props.socket.id);

  //const [modOpen, setModOpen] = useState(false)
  var players = props.playersList();
  var game_name = props.gameName; 
  
  useEffect(() => {
    window.addEventListener("beforeunload", alertUser);
    return () => {
      window.removeEventListener("beforeunload", alertUser);
    }
  })
  const alertUser = (e) => {
    e.preventDefault();
    e.returnValue = " ";
  }

  return (
    <div className="loading-host">
      <Prompt when={true} message="WARNING: By leaving this page, the game will end. Do you want to leave?" />
      <div className="host-waiting-transparent-box">
      <div className="loading-host-title">
        Please Join Game Using Name: 
        </div>
        <div className = "font-big"> {game_name} </div>
   
      {/* {props.numPlayersErr && 
        <div>
          Cannot Start Game Without Players
        </div>
      } */}
      <div className="loading-host-contents">
      <Button
          size="massive"
          inverted
          color="olive"
          style={{ width: "calc(200px + 1vw)" }}
          onClick={props.startGameBtn}
        >
          Start Game
        </Button>
      
       
        {/* <ul>
          {players.map((player, i) => (
            <li key={i}> {player} </li>
          ))}
        </ul> */}
        
        
        <Modal
        onClose={props.resetNoPlayerErr}
        open={props.numPlayersErr}
        >
          <Modal.Header>Not Enough Players</Modal.Header>
          <Modal.Description>
            <p>The game can start only when at least 1 player joins.</p> 
            <p>Please wait until a player joins the game.</p>
          </Modal.Description>
          <Modal.Actions>
            <Button color="green" content="Ok" size="small" onClick={props.resetNoPlayerErr}/>
          </Modal.Actions>
        </Modal>
      </div>

      <div className="loading-host-contents">
        {props.numPlayers} Players Joined 
      <div>Player List:</div>
      </div>


      <div className="plist">
        
        <List >
          {players.map((player, i)=>(
            <List.Item key={i} >{player}</List.Item>
          ))}
        </List>
      </div>
      </div>
    </div>
  );
};

export default Pregame;
