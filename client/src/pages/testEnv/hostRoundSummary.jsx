import React from "react";

const HostRoundSummary = (props) => {
  var data = props.data()
  data = Object.entries(data);
  console.log(data);
  return (
    <div>
      <div>Round {props.round} Results:</div>
      <div>
        <ul>
          {data.map((player, i) => (
            <li key={i}> {player[0]} : {player[1]}</li>
          ))}
        </ul>
      </div>
      <div>
        <button onClick={props.nextRoundHandler}>Start Next Round</button>
      </div>
    </div>
  );
};

export default HostRoundSummary;
