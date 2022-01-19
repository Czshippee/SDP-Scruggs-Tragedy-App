import React, { useState, useEffect} from "react";

import "semantic-ui-css/semantic.min.css";
import "./playerGameDummy.css";
import { Button, Grid, Modal, Popup, Icon} from "semantic-ui-react";
import {useHistory, Prompt} from "react-router-dom"
import { Slider } from "react-semantic-ui-range";
import { useMediaQuery } from 'react-responsive'

const DummyGame = (props) => {
  console.log(props.round)
  const isBigScreen = useMediaQuery({ query: '(min-device-width: 1224px)' })
  const isTabletOrMobile = useMediaQuery({ query: '(max-device-width: 1224px)' })
  
  
  const [confirmOpen, setConfirmOpen] = useState(false);
  const blockCond = useState(true);
  const history = useHistory();
  const [open, setOpen] = React.useState(false)
  
  

  useEffect(()=>{
    window.addEventListener("beforeunload", alertUser);
    return ()=>{
      window.removeEventListener("beforeunload", alertUser);
    }
  })

  const alertUser = (e)=>
  {
    e.preventDefault();
    e.returnValue = " ";
  }

  function detRange(input){
    var upperRange = 1.5 * input;
    return  "0 - " + upperRange.toString();
  }

  function detPastureRange(input){
    var lowerRange = -1 * input;
    var upperRange = 3 * input
    return lowerRange.toString() + " - " + upperRange.toString();
  }

  function scaleRound(val){
    return (parseInt(val) + 1).toString();
  }

  function scaleButton(){
    if (isBigScreen){
      return "massive"
    }
    else{
      return "large"
    }
  }

  return (
    
    <div className="layout">
      <div className="playergame-transparent-box">
      
      <div className="grid-header">
        <Grid centered padded inverted>
          <Grid.Row >
            
            <Grid.Column width = {16} textAlign={"middle"} className="grid-header">  Round {props.round}</Grid.Column>
          </Grid.Row>
         
          <Grid.Row className="nickname">
          Nickname: {props.nname}
          </Grid.Row>
          
        </Grid>
      </div>

      
      <div className="info">
      
        <Grid className="softMod">
          <Grid.Row>Resources Remaining: {props.reserve}</Grid.Row>        
          <Grid.Row verticalAlign= {'middle'} textAlign={'left'}>
           Resources in Farm:    
          </Grid.Row>
          <Grid.Row centered>
           {/*  <Grid.Column verticalAlign={'middle'} textAlign={"left"} width = {7}>
              Set Resources to Farm:
              </Grid.Column> */}
            <div className="markers">
              <Button
                inverted
                color="red"
                content="-"
                onClick={props.decrementFarming}
                size="massive"
              />
              {props.farming}
              <Button
                inverted
                color="green"
                content="+"
                onClick={props.incrementFarming}
                size="massive"
              />
              </div>
              Potential Score: &nbsp;{detRange(props.farming)}
            <Grid.Column verticalAlign={'bottom'} width = {16}  textAlign={"middle"} >
              
             
              {/* &nbsp; Potential Score: &nbsp;{detRange(props.farming)} */}
            </Grid.Column>
          </Grid.Row>
          
          <Grid.Row>
            Resources in Pasture:
          </Grid.Row>
          <Grid.Row centered>
            {/* <Grid.Column verticalAlign={'middle'} textAlign={"left"} width = {7}>
              Set Resources to Pasture:
              </Grid.Column> */}
            <div className="markers">
            <Button
                inverted
                color="red"
                content="-"
                onClick={props.decrementPasturing}
                size="massive"
              />
              {props.pasturing}
              <Button
                inverted
                color="green"
                content="+"
                onClick={props.incrementPasturing}
                size="massive"
              />
            </div>
            Potential Score: &nbsp;{detPastureRange(props.pasturing)}
            <Grid.Column verticalAlign={'middle'} width = {16}  textAlign={"middle"} >
              
               {/* &nbsp; Potential Score: &nbsp;{detPastureRange(props.pasturing)} */}
            </Grid.Column>
          </Grid.Row>
        </Grid>
       
      </div>
      <div className = "submit">
      <Modal
                    onClose={() => setOpen(false)}
                    onOpen={() => setOpen(true)}
                    open={open}
                    trigger={<Button
                        inverted
                        size="large"
                        color="blue"
                        style={{ width: "200px" }}
                    >View Past Results </Button>}
                >
                    <Modal.Content image>
                    <div class="table__wrapper">
                    <table className="table" >
                        <thead>
                            <th colspan="5">Results</th>
                            <tr>
                                <th scope="col">Round</th>
                                <th scope="col">Farming</th>
                                <th scope="col">Pasturing</th>
                                <th scope="col">Reserve</th>
                                <th scope="col">Round Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.dataPassed.map((row, index) => {
                                return (
                                    <tr>
                                        <td key={"round"} scope="row">{row["round"]}</td>
                                        <td key={"farming"} data-header="Farming">{row["farming"]}</td>
                                        <td key={"pasturing"} data-header="Pasturing">{row["pasturing"]}</td>
                                        <td key={"reserve"} data-header="Reserve">{row["reserve"]}</td>
                                        <td key={props.score} data-header="Round Score">{props.score[index]}</td>
                                    </tr>)
                            })}
                        </tbody>
                    </table>
                </div>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button
                            content="OK"
                            labelPosition='right'
                            icon='checkmark'
                            onClick={() => setOpen(false)}
                            positive
                        />
                    </Modal.Actions>
                </Modal>
      
      {/* <Button inverted color = "blue" content = "View Past Results" size = "medium"></Button> */}
      </div>

     {/*  <div className="reset">
        <Button inverted size="large" color="teal" style={{ width: "200px" }}>
          Reset
        </Button>
      </div>
 */}
      <div className="submit">
         <Modal
          onClose = {() => setConfirmOpen(false)}
          onOpen = {() => setConfirmOpen(true)}
          open = {confirmOpen}
          trigger = {<Button inverted size = "massive" color = "teal" style = {{width: "200px", size: "35px"}}>Submit</Button>}
        >
          
          <Modal.Header>Review Choices</Modal.Header>
          <Modal.Description>
            <p>Your resources will be placed in the following:</p>
            <p>Farming: {props.farming}</p>
            <p>Pasturing: {props.pasturing}</p>
            <p>Reserve: {props.reserve}</p>
            
          </Modal.Description>
          <Modal.Actions>
            <Button color = 'red' onClick = {() => setConfirmOpen(false)}>Go Back</Button>
            <Button color = "green" onClick = {()=>props.handleRoundSubmit()}>Submit</Button>
          </Modal.Actions>
        </Modal> 
        
      

      </div>
      {/* {props.hostLeft && 
        <div> 
          Host Left
        </div>
      } */}
      </div>
    </div>
  );
};

export default DummyGame;
