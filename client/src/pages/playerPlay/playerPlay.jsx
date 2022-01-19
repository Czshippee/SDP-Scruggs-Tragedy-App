import React, {useEffect} from "react";

import queryString from "query-string";
import  "./playerPlay.css";
import "../loadingPage/loadingPage.css"
import 'semantic-ui-css/semantic.min.css';
import {Dimmer, Loader} from "semantic-ui-react";

import { Prompt } from "react-router-dom";

const PlayerPlay = (props) => {

  console.log("uuid: ", props.uuid);
  console.log("socket: ", props.socket.id);

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

      <div className="loading-player">
         <Prompt when={true} content="By exiting, you will leave the game. Are you sure?"/>
        <div className = "playerplay-transparent-box">

        <div className="contents">
          Welcome {props.nickname}!
        </div>
        <div className="loading-page">
       <div className="Loading">
          <Loader active size = "massive" inverted inline style = {{height: "50vh"}}>
            Waiting for host to start game...
            </Loader>
        </div>
        </div>
        </div>
      </div>

  );
};

export default PlayerPlay;
