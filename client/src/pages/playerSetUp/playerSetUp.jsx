import React, { useEffect, useState } from "react";
import "semantic-ui-css/semantic.min.css";
import { Button, Input, Popup, Icon, Label, Grid , Modal, Dropdown} from "semantic-ui-react";

//import Layout from "../../components/Layout";
import "./playerSetUp.css";

const PlayerSetUp = (props) => {
  const [open, setOpen] = React.useState(false)

  const  numberOptions = [
    {
      key: '0',
      text: '0',
      value: '0',
    },
    {
      key: '1-3',
      text: '1-3',
      value: '1-3',
    },
    {
      key: '5+',
      text: '5+',
      value: '5+',
    },

  ]


  function adaptErr(){
    if(props.formError){
      return "Please fill in all fields before attempting to join a game"
    }
    else if(props.joinError){
      return "The room name does not exist. Please enter in a valid room name"
    }
    else if(props.nameError){
      return "The listed name is currently in use. Please enter a different name"
    }
  }
  function resetErr(){
    props.resetFormError();
    props.resetJError();
    props.resetNameErr();
  }
  return (
    
    <div className="player-set-up-page">
      <div className="player-set-up-transparent-box">
      <div className="Player-page-header">Player Information:</div>
      <div className= "Text-container">
      
    
        <Grid  centered > 
          <Grid.Row >
            <Grid.Column verticalAlign = {"middle"}  width = {5} textAlign={"left"}>
              
            Nickname:
             
            </Grid.Column>
            <Grid.Column  width = {6} textAlign={"left"}  >
              <div className="Search">
                <Input
                  id='playername'
                  style={{ height: "45px", width: "210px", paddingRight: "10px" }}
                  type="type"
                  onChange={props.nicknameHandler}
                />
                <Popup
                  trigger={<Icon inverted name='question circle' size='large' />}
                  content='Enter your username, or how you will be identified during the game'
                  size='small'
                  position='right center'
                />
              </div>
            </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column verticalAlign = {"middle"} width = {5} textAlign={"left"}>
           
          <div className = "Column-Label" >Full Name:</div>
          
            </Grid.Column>
            <Grid.Column width = {6} textAlign={"left"}>
            <div className="Search">
              <Input
                id='player-read-name'
                style={{ height: "45px", width: "210px", paddingRight: "10px" }}
                type="type"
                onChange={props.nameHandler}
              />
              <Popup
                trigger={<Icon inverted name='question circle' size='large' />}
                content='Enter your full name to be used for the host'
                size='small'
                position='right center'
              />
            </div>
            </Grid.Column>
            </Grid.Row>
          

          <Grid.Row >
            <Grid.Column verticalAlign = {"middle"} width = {5} textAlign={"left"}>
            <div className = "Column-Label" >
              Game Name:
              </div>
            </Grid.Column>
            <Grid.Column width = {6} textAlign={"left"} verticalAlign={'middle'}>
            <div className="Search">
              <Input error = {props.joinError}
                id='gamepin'
                style={{ height: "45px", width: "210px", paddingRight: "10px" }}
                type="type"
                onChange={props.roomHandler}
              />
              <Popup
                trigger={<Icon inverted name='question circle' size='large' />}
                content='Enter the room code you want to join provided by the host'
                size='small'
                position='right center'
              />
            </div>
            </Grid.Column>
          
          </Grid.Row>
          <Grid.Row >
            <Grid.Column verticalAlign = {"middle"}  width = {5} textAlign={"left"}>
              
            Experience:
             
            </Grid.Column>
            <Grid.Column  width = {6} textAlign={"left"}  >
              <div className = "Search" >
                <div className = "drop" >
                <Dropdown fluid 
                  placeholder = "Number"

                  style = {{fontSize: "14px"}}
                  selection options={numberOptions}
                  onChange={props.experienceHandler}

                />
                </div>
                <Popup
                  trigger={<Icon inverted name='question circle' size='large' />}
                  content='Enter the number of times you have played this game before'
                  size='small'
                  position='right center'
                
              />
              </div>
            </Grid.Column>
        </Grid.Row>



      </Grid>
      </div>
      
      <div className = "modal">
      <Modal centered = "true"
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        trigger={<Button inverted color = "black">How to play</Button>}
      >
        <Modal.Header>Instructions:</Modal.Header>
        <Modal.Content >
          <Modal.Description>
           
            <p>
                As a player, you will attempt to maximize your score regarding how well you choose to allocate resources to farm, to pasture, or to reserve. Each round, you will be given 10 resources to assign to the three respective categories. Your score will depend on how well you can manage your resources in addition to how others in the commons decide to manage theirs. 
            </p>
            <p>
                Reserving is a conversative play: for every resource allocated to the reserve, you will receive 1 point. The risk is slim with a guaranteed score increase, but your score may be lower compared to riskier players in the commons. 
            </p>
            <p>
                Farming is a bet: for every resource allocated to farming, there will be a positive score associated with it. The one caveat is that these scores are random. Unlike reserving, the range of points towards farming can vary at 0.25 points, 1 point, or 1.5 points. There is a 50% chance of any given resource to be worth 1.5 points, a 30% chance of it being worth 1 point, and a 20% chance of it being worth 0.25 points. 
            </p>
            <p>
                Pasturing is high risk, high reward: for every resource allocated to pasturing, there can be a positive or negative score associated with it. The potential gains in score are higher than for reserving or farming, but if too many people are taking advantage of pasturing, there is potential for losing points. The range of pasturing scores can range from -1 points to 3 points per resource, and it is completely dependent on how others decide to pasture, so be wary of overgrazing!

            </p>
           
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
         
          <Button
            
            content = "OK"
            onClick={() => setOpen(false)}
            color = "green"
          />
        </Modal.Actions>
      </Modal>
      </div>

        <div className="join-button">
          <Button
            onClick={props.buttonHandler}
            type="submit"
            size="massive"
            inverted
            color="teal"
            style={{ width: "300px" }}
          >
            Join Game
        </Button>
        </div>
        
          <Modal
            className="joinFail"
            size = "mini"
            onClose={()=>resetErr()}
            open={props.formError || props.nameError || props.joinError}
          >
            <Modal.Header>Form Error</Modal.Header>
            <Modal.Description className = "joinFail"><p>{adaptErr()}</p></Modal.Description>
            <Modal.Actions>
              <Button size="small" color="green" onClick={()=>resetErr()}>Ok</Button>
            </Modal.Actions>
          </Modal>


          <Modal
          size = "mini"
          onClose = {props.reJoinSet}
          open={props.rejoin}
          >
            <Modal.Header>Disconnected from Game</Modal.Header>
            <Modal.Description>
              <p>You have been disconnected from the game.</p>
              <p>If you wish to rejoin, please reinput your information and the correct game code.</p>
            </Modal.Description>
            <Modal.Actions>
              <Button size="small" color ="Black" onClick={props.reJoinSet}>Close</Button>
            </Modal.Actions>
          </Modal>
        

        {/* {props.formError &&
        <div>
          Form Error
        </div>
        } */}
</div>
      </div>
  );
};

export default PlayerSetUp;