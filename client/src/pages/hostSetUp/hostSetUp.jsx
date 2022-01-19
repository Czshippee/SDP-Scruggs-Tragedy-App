import React, { useState } from "react";
import { Link, Prompt } from "react-router-dom";

import "semantic-ui-css/semantic.min.css";
import { Slider } from "react-semantic-ui-range";
import { useMediaQuery } from 'react-responsive'


import {
  Button,
  Input,
  Popup,
  Icon,
  Grid,
  Modal
} from "semantic-ui-react";

import "./hostSetUp.css";

const HostSetUp = (props) => {
  
  const isBigScreen = useMediaQuery({ query: '(min-device-width: 1224px)' })
  const isTabletOrMobile = useMediaQuery({ query: '(max-device-width: 1224px)' })
  const isSmallerScreen = useMediaQuery({query: '(max-width: 615px)'})
  const [open, setOpen] = useState(false)

  const tRSettings = {
    start: props.timeRound,
    min: 40,
    max: 600,
    step: 10,
    onChange: (value) => props.timeRoundHandler(value),
  };
  function adjustScrn1(element) {
    if (element === 0){
      if (isBigScreen && !isSmallerScreen) {
        return "right"
      }
      else {
        return "middle"
      }
    }
    else{
      if (isTabletOrMobile || isSmallerScreen){
        return "middle"
      }
      else{
        return "left"
      }
    }
    
  }
  function adjustTime(time){
    const minutes = time / 60;
    const seconds = time % 60;
    var returnValue = ""
    var minSet = false
    if (minutes >= 1){
      returnValue+=parseInt(minutes.toString()) + " Min"
      minSet = true
    }
    if (seconds >0){
      if(minSet === true){
        returnValue+=", "
      }
      returnValue+=parseInt(seconds.toString()) + " Sec"
    }
    
    return returnValue
  }

  function adjustSize(){
    if (isBigScreen && !isSmallerScreen){
      return "massive"
    }
    else{
      return "large"
    }
  }

  function adaptError(){
    if (props.nameErr){
      return "The game name is in use. Enter a new game name."
    }
    else if (props.forgiveErr || props.emptyName){
      return "One or both required fields have not been configured. Make sure all fields have been filled/selected before proceeding."
    }
  }
  return (

   /*  <div className="all-encompassing">

      <div className="Host-header">Create Game:</div>
      
        <div className="Pin-bar">
          <label htmlFor="Pin">Create Game Name:</label>
          <Input
            id="Pin"
            style={{ height: "45px", width: "250px", paddingRight: "10px" }}
            onChange={props.gameNameHandler}
          />
          <Popup
            trigger={<Icon inverted name="question circle" size="large" />}
            content="This will be the keyword for the players to enter the game."
            size="small"
            position="right center"
          />
        </div>

        <div className="Time-Btw-Moves-bar">
          <Grid centered verticalAlign="middle" columns="3" stackable>
            <Grid.Column width={5} textAlign={adjustScrn1(0)}>
              <label>Round Duration:</label>
            </Grid.Column>
            <Grid.Column width={4}>
              <Slider discrete color="purple" settings={tRSettings} style={{ fontSize: "500px" }} />
            </Grid.Column>
            <Grid.Column width={5} textAlign={adjustScrn1(1)}>
              <label>{props.timeRound} Seconds</label>
              <Popup
                trigger={<Icon inverted name="question circle " size="large" />}
                content="The amount of time for each round of the game"
                size="small"
                position="right center"
              />
            </Grid.Column>
          </Grid>
        </div>

        <div className="Buttom-inverted">
          <label style={{ paddingTop: "15px" }}> Forgiveness</label>
          <Button.Group
            size="massive"
            style={{ paddingRight: "10px" }}
            inverted
            color="purple"
            vertical={isTabletOrMobile}
          >
            <Button active={props.low} onClick={props.lowHandler}>
              Low */
    <div className="all-encompassing">
      <div className="host-set-up-transparent-box">
      
        <div className="Host-header" >Create Game:</div>
        <div className="formElem">
        <div className="Pin-bar">
          <div className ="label-text">Create Game Name:</div>
          <Input
          id="Pin"
          style={{ height: "45px", width: "250px", paddingRight: "10px" }}
          onChange={props.gameNameHandler}
          />
          <Popup
          trigger={<Icon inverted name="question circle" size="large" />}
          content="This will be the keyword for the players to enter the game."
          size="small"
          position="right center"
          />
        </div>

        {/* <div className="Time-Btw-Moves-bar">
          <Grid centered verticalAlign="middle" columns="3" stackable={isTabletOrMobile || isSmallerScreen}>
            <Grid.Column width={6} textAlign={adjustScrn1(0)}>
              <div className ="label-text">Round Duration:</div>
            </Grid.Column>
            <Grid.Column width={5}>
              <Slider discrete color="blue" settings={tRSettings} />
            </Grid.Column>
            <Grid.Column textAlign={adjustScrn1(1)}  width={5} >
              <div className ="label-text">{adjustTime(props.timeRound)}</div>
              <Popup
                trigger={<Icon inverted name="question circle " size="large" />}
                content="The amount of time for each round"
                size="small"
                position="right center"
              />
            </Grid.Column>
          </Grid>
        </div>
 */}
        <div className="Buttom-inverted">
          <div className ="label-text" > Forgiveness:</div>
          <Button.Group
            size={adjustSize()}
            style={{ paddingRight: "10px" }}
            inverted
            color="blue"
            vertical = {isTabletOrMobile}
          >
            <Button active={props.low} onClick={props.lowHandler}>
              Low
            </Button>
              <Button active={props.medium} onClick={props.medHandler}>
                Medium
            </Button>
              <Button active={props.high} onClick={props.highHandler}>
                High
            </Button>
            </Button.Group>
            <Popup
              trigger={<Icon inverted name="question circle " size="large" />}
              content="Indicate strictness of the threshold for overgrazing."
              size="small"
              position="right center"
            />
          </div>
          </div>
        <div className="modal">
          <Modal centered="true"
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            trigger={<Button inverted color="black">How to play</Button>}
          >
            <Modal.Header>Instructions:</Modal.Header>
            <Modal.Content >
              <Modal.Description>

              <p>
                As host, you will administer the Tragedy of the Commons. On this setup page, please indicate the name of the game session, the maximum time between rounds, and the forgiveness factor.
              </p>
              <p>
                On Create Game, a pre-game lobby page will appear where you can display the game name for players to join. Once all the players have arrived, you can start the game.
              </p>
              <p>
                During gameplay, the host has the option to end the round in case all players have submitted their allocations before the timer runs out. After the round, several graphs and tables will be at your disposal to perform analysis on how the commons and individual players are doing.
              </p>
              <p>
                There is no round limit, so once you want the game to end, simply press the End Game button after the round ends. Everyone in the session will then be able to see their stats and rankings for final analysis. Also, if wanted, a file of the raw game data is available for download.

              </p>

              </Modal.Description>
            </Modal.Content>
            <Modal.Actions>

              <Button
                content="OK"
                onClick={() => setOpen(false)}
                color="green"
              />
            </Modal.Actions>
          </Modal>
        </div>

        <div className="gen-game">
          <Button
            onClick={props.buttonHandler}
            size="massive"
            inverted
            color="olive"
            style={{ width: "300px" }}
          >
            Generate Game
          </Button>
        </div>

        <div className="back-buttom">
          <Button
            as={Link}
            to="/"
            size="massive"
            inverted
            color="teal"
            style={{ width: "300px" }}
          >
            Back
          </Button>
        </div>
        <Modal
        open={props.emptyName || props.forgiveErr || props.nameError}
        onClose = {props.resetSubError}>
          <Modal.Header>Error Creating Game</Modal.Header>
          <Modal.Description><p>{adaptError()}</p></Modal.Description>
          <Modal.Actions>
            <Button size="small" onClick={props.resetSubError}>Close</Button>
          </Modal.Actions>
        </Modal>
        </div>
      </div>
    
  );
};

export default HostSetUp;
