import React from 'react';
import "../loadingPage/loadingPage.css"
import 'semantic-ui-css/semantic.min.css';
import {Loader, Dimmer} from "semantic-ui-react";

const PendingWait = (props) => {
    return (
        // <h1>Loading ...</h1>
        <div className = "loading-page">
        <div className = "Loading">
          <Dimmer active>
          <Loader active size = "massive" inverted >
            Please Wait Until Host Starts New Round ... 
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

export default PendingWait;