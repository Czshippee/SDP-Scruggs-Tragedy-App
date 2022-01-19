import React from 'react';
import "./loadingPage.css";
import 'semantic-ui-css/semantic.min.css';
import {Dimmer, Loader} from "semantic-ui-react";

const LoadingPage = () => {
    return (
        // <h1>Loading ...</h1>
        <div className = "loading-page">
            
        <div className = "loader-please-work-for-the-love-of-everything">
          <Dimmer active>
          <Loader active size = "massive" inverted >
            Loading...
            </Loader>
            </Dimmer>
        </div>

     
        </div>
    )
};

export default LoadingPage;
