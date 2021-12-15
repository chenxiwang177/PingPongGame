import styled from "styled-components";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Game from "./Game";
import { NavLink } from "react-router-dom";
import BG_SRC from "./images/background.jpg";
import { useState } from "react";
export const StyledLink = styled(NavLink)`
  text-decoration: none;
  color: yellow;
  font-size: 24px;
  border: 2px solid yellow;
  border-radius: 32px;
  padding: 10px 40px;
  transform: scale(1);
  transition: all 0.6s;
  &:hover {
    color: blue;
    border-color: blue;
    transform: scale(1.05);
  }
  @media (max-width: 600px) {
    font-size: 12px;
  }
`;

const NavBar = styled.main`
  display: flex;
  gap: 50px;
  justify-content: center;
  align-items: center;
  @media (max-width: 630px) {
    flex-direction: column;
  }
`;
const Wrap = styled.div`
  height: 100vh;
  width: 100vw;
  background-image: url(${BG_SRC});
  background-repeat: no repeat;
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  gap: 50px;
  justify-content: center;
`;
const Button = styled.button`
  border: 2px solid yellow;
  border-radius: 32px;
  padding: 10px 40px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  transform: scale(1);
  transition: all 0.6s;
  &:hover {
    color: blue;
    border-color: blue;
    transform: scale(1.05);
  }
  color: yellow;
  background: transparent;
  font-size: 24px;
  font-weight: 600;
  cursor: pointer;
`;

const Title = styled.div`
  font-size: 24px;
  color: blue;
  margin-bottom: 20px;
  text-align: center;
`;
const Text = styled.div`
  font-size: 20px;
  line-height: 40px;
  @media (max-width: 510px) {
    line-height: 30px;
  }
`;
const Close = styled.button`
  position: absolute;
  background: transparent;
  border-radius: 50%;
  border-color: black;
  float: right;
  top: 10px;
  right: 10px;
  cursor: pointer;
  transition: all 0.5s;
  &:hover {
    background: yellow;
  }
`;

const Home = () => {
  const [modalStatus, showModal] = useState("none");
  const toggleShow = () => {
    modalStatus === "none" ? showModal("block") : showModal("none");
  };
  const Modal = styled.div`
    display: ${modalStatus};
    position: fixed;
    background-color: #91ed89;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 20px;
    padding: 50px 30px;
    width: 50%;
    @media (max-width: 800px) {
      width: 80%;
    }
    @media (max-width: 510px) {
      width: 99%;
      padding: 20px 10px;
    }
  `;
  return (
    <Wrap>
      <Button onClick={toggleShow}>How to play?</Button>
      <NavBar>
        <StyledLink to="/multi">MultiPlayer Game</StyledLink>
        <StyledLink to="/single">SinglePlayer Game</StyledLink>
      </NavBar>
      <Modal>
        <Close onClick={toggleShow}>x</Close>
        <Title>Welcome to ping-pong game</Title>
        <Text>
          &nbsp;You can click multiplayergame button to play game online with
          other player and click singleplayergame to play with computer. <br />
          For multiplayergame one of players should enter name and create room.
          When someone created room, other players can see all created rooms.
          And when he connects the room, and both of the players are ready, the
          game start. <br />
          The first player that scores 4 points are winner.
          <br /> 🙂enjoy the game.
        </Text>
      </Modal>
    </Wrap>
  );
};
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/multi" element={<Game />} />
        <Route path="/single" element={<Game />} />
      </Routes>
    </Router>
  );
};

export default App;
