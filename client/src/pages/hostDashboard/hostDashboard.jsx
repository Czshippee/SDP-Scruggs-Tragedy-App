import React, { useState, useEffect } from 'react';
import "semantic-ui-css/semantic.min.css";
import { Button, Grid, List } from "semantic-ui-react";
import "./hostDashboard.css"
import { Prompt } from "react-router-dom";


const HostDashboard = (props) => {
    var submittedData = props.submittedPlayers()
    const [timer, setTimer] = useState(props.timeRound)
    const [reminder, setReminder] = useState(false)
    var game_name = props.gameName; 
    // useEffect(() => {
    //     let t
    //     if (timer > 0) {
    //         t = setTimeout(() => setTimer(timer - 1), 1000)
    //     } else if (timer == 0) {
    //         setReminder(true)
    //     }
    // }, [timer])

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

        <div className="whole-dashboard"> 
        <div className="host-dashboard-transparent-box">
           

  
            <Prompt when={true} message="WARNING: By leaving this page, the game will end. Do you want to leave?" />
            <div className="title1">
            <div className="title1">
            Game Code: &nbsp;
            </div>
            <div className="title2" style={{color:"rgb(204, 230, 113)"}}>
             {game_name}
            </div>
            </div>
            <div className="text1">

                {/* <div className="timer">
                    Time Remaining: {props.timer}
                </div> */}
                
                    
                
                <div className="playerCount">
                    {props.numSubmissions} Submitted / {props.numPlayers} Total Players
                </div>

            </div>
            <div className="playerSubmit">
                Submitted Players:
                <div className="plist-dashboard">
                    <List >
                        {submittedData.map((player, i) => (
                            <List.Item key={i} >{player}</List.Item>
                        ))}
                    </List>
                </div>
            </div>

            <div className="ERButton">
                <Button
                    onClick={props.handleEndRound}
                    type="submit"
                    size="massive"
                    inverted
                    color="olive"
                    style={{ width: "50%" }}
                >
                    End Round
                </Button>
            </div>
            

        </div>
        </div>
    );
};


export default HostDashboard;