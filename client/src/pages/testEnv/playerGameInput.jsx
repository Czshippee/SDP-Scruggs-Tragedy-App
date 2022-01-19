import React from "react";

const PlayerGameInput = (props) => {
  return (
    <div>
      <div>
        <label htmlFor="input">Number of Cows</label>
        <input onChange={props.handleInput} id="input" type="number" min="3" max="10"></input>
      </div>
      <div>
          <button onClick={props.handleRoundSubmit}> Submit</button>
      </div>
    </div>
  );
};

export default PlayerGameInput;