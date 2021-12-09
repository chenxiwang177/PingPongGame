import React from "react";
import styled from "styled-components";
import io from "socket.io-client";
import RatioError from "./templates/RatioError/RatioError";
import SocketContext from "./components/SocketContext/SocketContext";
import MainViewWithSocket from "./templates/MainView/MainViewWithSocket";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MultiPlayer from "./MultiPlayer";
import SinglePlayer from "./SinglePlayer";
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<MultiPlayer />} />
        <Route path="/single" element={<SinglePlayer />} />
      </Routes>
    </Router>
  );
}

export default App;
