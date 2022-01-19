import React, {useEffect} from "react";
import { Link } from 'react-router-dom';

import "semantic-ui-css/semantic.min.css";

import { Button, Input, Modal } from "semantic-ui-react";
import { useMediaQuery } from 'react-responsive'

import "./gameStart.css";

const GameStart = (props) => {
  console.log("uuid: ", props.uuid);
  console.log("socket: ", props.socket.id);

  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-device-width: 1224px)'
  })
  const isBigScreen = useMediaQuery({ query: '(min-device-width: 1224px)' })
  const isTabletOrMobile = useMediaQuery({ query: '(max-device-width: 1224px)' })
  


  return (
    <div className="game-start">
     
      
      <div className="start-contents">
      <div className="start-header">Simple Farmer</div>

        <Button.Group size="massive" vertical={isTabletOrMobile}>
          <Button
            className="HostBtn"
            inverted
            color="olive"
            content="Host"
            as={Link} to='/host'
          />
          <Button.Or />
          <Button
            inverted
            color="teal"
            content="Player"
            as={Link} to='/player'
          />
        </Button.Group>

        
        
      </div>
      

    </div>

  );
};

export default GameStart;
