import React from "react";
import Card from "./Card";

function Deck({ match, history }) {
  return (
    <div>
      <div>{match.params.title}</div>
      <Card match={match} history={history} />
    </div>
  );
}
export default Deck;
