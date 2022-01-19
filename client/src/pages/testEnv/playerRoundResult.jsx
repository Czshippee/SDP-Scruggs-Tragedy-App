import React from "react";

const PlayerRoundResult = (props) => {
  return (
    <div>
        <div>
            Results from Round {props.round}:
            You have {props.cows} cows remaining.
        </div>
    </div>
  );
};

export default PlayerRoundResult;