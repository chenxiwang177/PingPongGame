import styled from "styled-components";
import io from "socket.io-client";
import RatioError from "./templates/RatioError/RatioError";
import SocketContext from "./components/SocketContext/SocketContext";
import MainViewWithSocket from "./templates/MainView/MainViewWithSocket";

const pong = io();

const AppWrapper = styled.div`
  text-align: center;
  height: 100%;
`;

const Main = styled.main`
  height: 100%;
  width: 100vw;
  background: #333333;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Game = () => {
  return (
    <AppWrapper>
      <SocketContext.Provider value={pong}>
        <Main>
          {window.innerWidth < window.innerHeight ? (
            <RatioError />
          ) : (
            <MainViewWithSocket />
          )}
        </Main>
      </SocketContext.Provider>
    </AppWrapper>
  );
};

export default Game;
