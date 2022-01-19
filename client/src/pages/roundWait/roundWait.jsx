import React from 'react';
import {Prompt} from "react-router-dom"

import 'semantic-ui-css/semantic.min.css';
import {Loader,Dimmer} from "semantic-ui-react";

const RoundWait = (props) => {
    return (
        // <h1>Loading ...</h1>
        <div className = "loading-page">
         
        <div className = "Loading">
          <Dimmer active>
          <Loader active size = "massive" inverted >
            Waiting for other players...
            </Loader>
          </Dimmer>
          <Prompt when={true} content="By exiting, you will leave the game. Are you sure?"/>
        </div>
        {props.hostLeft && 
        <div> 
          Host Left
        </div>
      }
     
        </div>
    )
};

export default RoundWait;