import React from "react";

const HostSetUp = (props) => {
  
  console.log("uuid: ", props.uuid);
  console.log("socket: ", props.socket.id);
  
  return (
    <div>
      <div>
        <label htmlFor="rounds">Number of Rounds</label>
        <input onChange={props.roundsHandler} value={props.rounds} id="rounds" type="number" min="3" max="10"></input>
      </div>
      <div>
        <button onClick={props.buttonHandler}>Create Game</button>
      </div>
    <div>
  );
};

export default HostSetUp;
