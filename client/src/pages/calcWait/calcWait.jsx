import React from 'react';
import "../loadingPage/loadingPage.css"
import 'semantic-ui-css/semantic.min.css';
import {Loader, Dimmer} from "semantic-ui-react";

const CalcWait = (props) => {
    return (
        // <h1>Loading ...</h1>
        <div className = "loading-page">
        <div className = "Loading">
          <Dimmer active>
          <Loader active size = "massive" inverted >
            Waiting for Results ... 
            </Loader>
          </Dimmer>
        </div>
        {props.hostLeft && 
        <div> 
          Host Left
        </div>
      }
        </div>
    )
};

export default CalcWait;