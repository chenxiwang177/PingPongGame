import { useEffect, useState } from "react";
import styled from "styled-components";
import randomWords from "random-words";
import SinglePlayerMenu from "../../components/Settings_MainMenu/SinglePlayerMenu";
import MultiPlayerMenu from "../../components/Settings_MainMenu/MultiPlayerMenu";
import Rooms from "../../components/Settings_Rooms/Rooms";
import PrivateRoom from "../../components/Settings_PrivateRoom/PrivateRoom";
import { ReactComponent as BackIcon } from "../../images/back.svg";
import { useLocation } from "react-router-dom";

const LobbyWrapper = styled.div`
  background: #1e1e1e;
  position: relative;
  padding: 0;
  color: #fefefe;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  border-radius: 30px;
  height: 80%;
  width: 80vw;
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
    height: 75vh;
    max-height: 700px;
    width: 65vw;
    max-width: 900px;
    border-radius: 50px;
  }
`;

const LobbyHeader = styled.div`
  width: 100%;
  height: 12%;
  position: relative;
  padding-right: 5vw;
  font-size: 0.9rem;
  text-transform: uppercase;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  > p {
    margin: 0;
  }

  @media (min-width: 1024px) {
    height: 10%;
    padding-right: 3vw;
  }
`;

const LobbySettings = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;

  @media (min-width: 1024px) {
    flex-direction: column;
  }
`;

const BackBtn = styled.button`
  position: absolute;
  left: 5vw;
  height: 100%;
  padding: 0 10px;
  background: none;
  border: none;

  &:hover {
    cursor: pointer;
  }

  > svg {
    fill: #fefefe;
    height: 15px;
    width: 15px;
  }

  @media (min-width: 1024px) {
    left: 3vw;

    > svg {
      height: 20px;
      width: 20px;
    }
  }
`;

const GameSettings = (props) => {
  const [rooms, setRooms] = useState([]);
  const {
    pong,
    playerName,
    roomId,
    handleError,
    setOpponentName,
    setRoomId,
    setPlayerOne,
    setGame,
    opponentName,
    setPlayerName,
    leaveRoom,
    isPlayerOne,
    inLobby,
    goToLobby,
    setControls,
    controls,
  } = props;
  useEffect(() => {
    pong.emit("getAllRooms");
    pong.on("sendRoomsList", (data) => setRooms(data));
    pong.on("goToGameRoom", (data) => handleGoToGameRoom(data));
    pong.on("opponentInLobby", (data) => handleOpponentInLobby(data));
    pong.on("gameReady", () => handleGameStart());
  }, []);

  const handleCreateRoom = () => {
    const roomId = randomWords();
    pong.emit("createRoom", {
      roomName: roomId,
      clientName: playerName,
    });
  };

  const handleJoinRoom = (e) => {
    if (roomId) return handleError("Firstly shut down your own room.");
    pong.emit("joinRoom", {
      roomName: e.target.dataset.name,
      clientName: playerName,
    });
  };

  const handleOpponentInLobby = ({ opponentName }) => {
    setOpponentName(opponentName);
  };

  const handleGoToGameRoom = ({ roomId, opponentName, isPlayerOne }) => {
    setRoomId(roomId);
    setOpponentName(opponentName);
    setPlayerOne(isPlayerOne);
    pong.emit("getAllRooms");
  };

  const handleGetToGame = (isReady) => {
    console.log(isReady);
    pong.emit("getToGame", {
      roomName: roomId,
      decision: isReady,
    });
  };
  const handleSingleGameGetToGame = () => {
    setGame();
  };

  const handleGameStart = () => {
    setGame();
  };
  const location = useLocation().pathname;
  return (
    <>
      {!inLobby && location === "/single" && (
        <SinglePlayerMenu
          playerName={playerName}
          setPlayerName={setPlayerName}
          goToLobby={() => goToLobby()}
          setControls={(c) => setControls(c)}
          controls={controls}
          getToSingleGame={handleSingleGameGetToGame}
        />
      )}
      {!inLobby && location === "/multi" && (
        <MultiPlayerMenu
          playerName={playerName}
          setPlayerName={setPlayerName}
          goToLobby={() => goToLobby()}
          setControls={(c) => setControls(c)}
          controls={controls}
        />
      )}
      {inLobby && location === "/multi" && (
        <>
          <LobbyWrapper>
            <LobbyHeader>
              <BackBtn onClick={() => goToLobby()}>
                <BackIcon />
              </BackBtn>
              <p>Welcome, {playerName}</p>
            </LobbyHeader>
            <LobbySettings>
              <Rooms
                rooms={rooms}
                refreshRoomsList={() => pong.emit("getAllRooms")}
                joinRoom={(e) => handleJoinRoom(e)}
              />
              <PrivateRoom
                roomId={roomId}
                opponentName={opponentName}
                createRoom={() => handleCreateRoom()}
                leaveRoom={() => leaveRoom()}
                getToGame={(e) => handleGetToGame(e)}
                isPlayerOne={isPlayerOne}
              />
            </LobbySettings>
          </LobbyWrapper>
        </>
      )}
    </>
  );
};

export default GameSettings;
