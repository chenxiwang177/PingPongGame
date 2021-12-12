import React from "react";
import styled from "styled-components";

const MainMenuWrapper = styled.div`
  background: #d7a6a6;
  padding: 5vh 8vw 7vh 8vw;
  color: #1a1a1a;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 50px;
  max-height: 80%;
  width: 50vw;
  animation: showMenu 150ms ease-out;

  @keyframes showMenu {
    0% {
      opacity: 0.8;
      transform: scale(0.95);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  @media (min-width: 1024px) {
    padding: 4vh 6vw;
    height: max-content;
    width: 45vw;
    max-width: 1000px;
  }
`;

const PlayerWelcome = styled.form`
  width: 100%;
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
`;

const WelcomeMsg = styled.p`
  color: #1a14d7;
  font-size: 0.9rem;
  line-height: 1.8;
  font-weight: 300;
  margin: 0;
  text-align: center;
  white-space: pre-wrap;
  text-transform: uppercase;

  @media (min-width: 1024px) {
    font-size: 1.4rem;
  }
`;

const PlayerNameInput = styled.input`
  width: 100%;
  margin: 5px 0;
  color: #1e1e1e;
  border-radius: 50px;
  text-align: center;
  text-transform: uppercase;
  font-family: "Concert One", cursive;
  font-size: 0.9rem;
  padding: 0;
  line-height: 2rem;

  &::placeholder {
    overflow: visible;
  }

  @media (min-width: 1024px) {
    padding: 10px 0;
    margin: 30px 0;
    font-size: 1.2rem;
  }
`;

const Btn = styled.button`
  margin: 5px 0;
  padding: 0;
  line-height: 2rem;
  background: #38fc27;
  border-radius: 50px;
  text-align: center;
  border: none;
  font-family: "Concert One", cursive;
  font-size: 0.9rem;
  color: #fefefe;

  &:hover {
    cursor: pointer;
  }

  @media (min-width: 1024px) {
    padding: 10px 0;
    font-size: 1.2rem;
  }
`;

const ToLobbyBtn = styled(Btn)`
  width: 100%;

  &:disabled {
    background: #a99494;
    color: #343434;
    &:hover {
      cursor: not-allowed;
    }
  }

  @media (min-width: 1024px) {
    margin: 30px 0 10px 0;
  }
`;

const ControlsMsg = styled.p`
  width: 100%;
  color: #080808;
  font-size: 0.9rem;
  line-height: 1.8;
  font-weight: 300;
  text-align: center;
  text-transform: uppercase;
  margin: 0 0 3px 0;

  @media (min-width: 1024px) {
    font-size: 1.2rem;
    margin: 0 0 10px 0;
  }
`;

const ControlsWrapper = styled.div`
  width: 100%;
  margin: 0 0 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ToggleControlsBtn = styled(Btn)`
  width: 45%;
  margin: 0;
  text-transform: uppercase;
  background-color: ${(props) => (props.isChosen ? "#1f66e5" : "#1e1e1e")};
  border: ${(props) => (props.isChosen ? "none" : "3px solid #1f66e5")};
  transition: background-color 250ms ease-in;
`;

const SinglePlayerMenu = ({
  playerName,
  setPlayerName,
  goToLobby,
  setControls,
  controls,
  getToSingleGame,
}) => {
  const handleNameInput = (e) => {
    setPlayerName(e.target.value.trim());
  };

  const handleToLobby = (e) => {
    e.preventDefault();
    goToLobby();
  };

  return (
    <MainMenuWrapper>
      <PlayerWelcome>
        <WelcomeMsg>Welcome to Single Player Game</WelcomeMsg>
        <WelcomeMsg>Please Enter Your Name</WelcomeMsg>
        <PlayerNameInput
          type="text"
          autoFocus
          onChange={(e) => handleNameInput(e)}
          value={playerName}
          placeholder="YOUR NAME"
        />
        <ControlsMsg>{`Choose controls`}</ControlsMsg>
        <ControlsWrapper>
          <ToggleControlsBtn
            value="arrows"
            type="button"
            isChosen={controls === "arrows"}
            onClick={(e) => setControls(e.target.value)}
          >
            Arrows
          </ToggleControlsBtn>
          <ToggleControlsBtn
            value="knob"
            type="button"
            isChosen={controls === "knob"}
            onClick={(e) => setControls(e.target.value)}
          >
            Knob
          </ToggleControlsBtn>
        </ControlsWrapper>
        <ToLobbyBtn
          disabled={playerName.length < 2 && true}
          type="submit"
          onClick={() => getToSingleGame()}
        >
          PLAY GAME
        </ToLobbyBtn>
      </PlayerWelcome>
    </MainMenuWrapper>
  );
};

export default SinglePlayerMenu;
