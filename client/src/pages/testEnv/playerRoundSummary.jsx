import React from "react";

const PlayerRoundSummary = (props) => {
  return (
    <div>
        <div>
            Round {props.round} Results:
        </div>
        <div>
            You submitted {props.cows} Cows.
        </div>
    </div>
  );
};

export default PlayerRoundSummary;