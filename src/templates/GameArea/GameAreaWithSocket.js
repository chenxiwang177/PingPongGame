import React from "react";
import SocketContext from "../../components/SocketContext/SocketContext";
import GameArea from "./GameArea";
import SingleGameArea from "./SingleGameArea";
import { useLocation } from "react-router";

const GameAreaWithSocket = (props) => {
  const location = useLocation().pathname;
  return (
    <div>
      {location === "/multi" ? (
        <SocketContext.Consumer>
          {(pong) => <GameArea {...props} pong={pong} />}
        </SocketContext.Consumer>
      ) : (
        <SocketContext.Consumer>
          {(pong) => <SingleGameArea {...props} pong={pong} />}
        </SocketContext.Consumer>
      )}
    </div>
  );
};

export default GameAreaWithSocket;
