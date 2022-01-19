import React from "react";

const PlayerSetUp = (props) => {

  console.log("uuid: ", props.uuid);
  console.log("socket: ", props.socket.id);

  return (
    <div>
      <div>
        <label htmlFor="playername">Enter Username</label>
        <input
          id="playername"
          type="type"
          onChange={props.nameHandler}
        ></input>
      </div>
      <div>
        <label htmlFor="gamepin">Enter Game Pin</label>
        <input
          id="gamepin"
          type="text"
          placeholder="******"
          onChange={props.pinHandler}
        ></input>
      </div>
      <div>
        <button onClick={props.buttonHandler} type="submit">
          Join Game
        </button>
      </div>
    </div>
  );
};

export default PlayerSetUp;
