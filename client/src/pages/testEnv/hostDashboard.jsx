import React from "react";

const HostDashboard = (props) => {
  return (
    <div>
      <div>
        Player Who Submitted: {props.latestName}
      </div>
      <div>
        <button onClick={props.handleEndRound}> End Round </button>
      </div>
    </div>
  );
};

export default HostDashboard;
