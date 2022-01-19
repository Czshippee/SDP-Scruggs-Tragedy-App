import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";

const GameStart = (props) => { 

  console.log("uuid: ", props.uuid);
  console.log("socket: ", props.socket.id);
    
  return (
    <div>
      <div>
        <Link to="/host"> 
          <button> Host </button>
        </Link>
        <Link to="/player" >
          <button> Player </button>
        </Link>
      </div>
    </div>
  );
};

export default GameStart;