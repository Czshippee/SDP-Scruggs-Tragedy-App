import React from "react";
import { Link } from "react-router-dom";
import './gameInterruption.css'
import "semantic-ui-css/semantic.min.css";
import { Button } from "semantic-ui-react";

const GameInterruption = () => {
    const handleButton = (event) => {
        
          
              window.location.href = `/`;
          
      };
    return (
        <div className= "game-interruption">
            <div className = "interruption-transparent-box">
            Game is no longer active; please go back 
            <div className="return-homepage">
                <Button
                    onClick={handleButton}
                    type="submit"
                    size="massive"
                    inverted
                    color="red"
                    
                >
                Return to Homepage
                </Button>
            </div>
            </div>
        </div>
    )
};

export default GameInterruption;