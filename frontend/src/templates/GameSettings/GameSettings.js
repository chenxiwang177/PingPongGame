import React, { Component } from "react";
import styled from "styled-components";
import randomWords from "random-words";
import MainMenu from "../../components/Settings_MainMenu/MainMenu";
import SinglePlayerMenu from "../../components/Settings_MainMenu/SinglePlayerMenu";
import MultiPlayerMenu from "../../components/Settings_MainMenu/MultiPlayerMenu";
import Rooms from "../../components/Settings_Rooms/Rooms";
import PrivateRoom from "../../components/Settings_PrivateRoom/PrivateRoom";
import { ReactComponent as BackIcon } from "../../images/back.svg";

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

class GameSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: [],
    };
  }

  componentWillMount() {
    const { pong } = this.props;
    pong.emit("getAllRooms");
    pong.on("sendRoomsList", (data) => this.setState({ rooms: data }));
    pong.on("goToGameRoom", (data) => this.handleGoToGameRoom(data));
    pong.on("opponentInLobby", (data) => this.handleOpponentInLobby(data));
    pong.on("gameReady", () => this.handleGameStart());
  }

  getAllRooms(rooms) {
    this.setState({ rooms });
  }

  handleCreateRoom = () => {
    const { pong, playerName } = this.props;
    const roomId = randomWords();
    pong.emit("createRoom", {
      roomName: roomId,
      clientName: playerName,
    });
  };

  handleJoinRoom = (e) => {
    const { pong, playerName, roomId, handleError } = this.props;
    if (roomId) return handleError("Firstly shut down your own room.");
    pong.emit("joinRoom", {
      roomName: e.target.dataset.name,
      clientName: playerName,
    });
  };

  handleOpponentInLobby = ({ opponentName }) => {
    const { setOpponentName } = this.props;
    setOpponentName(opponentName);
  };

  handleGoToGameRoom = ({ roomId, opponentName, isPlayerOne }) => {
    const { setOpponentName, setRoomId, setPlayerOne, pong } = this.props;
    setRoomId(roomId);
    setOpponentName(opponentName);
    setPlayerOne(isPlayerOne);
    pong.emit("getAllRooms");
  };

  handleGetToGame = (isReady) => {
    const { pong, roomId } = this.props;
    pong.emit("getToGame", {
      roomName: roomId,
      decision: isReady,
    });
  };

  handleGameStart = () => {
    const { setGame } = this.props;
    setGame();
  };

  render() {
    const {
      playerName,
      opponentName,
      roomId,
      setPlayerName,
      pong,
      leaveRoom,
      isPlayerOne,
      inLobby,
      goToLobby,
      setControls,
      controls,
    } = this.props;
    const { rooms } = this.state;
    return (
      <>
        {!inLobby && (
          <MainMenu
            playerName={playerName}
            setPlayerName={setPlayerName}
            goToLobby={() => goToLobby()}
            setControls={(c) => setControls(c)}
            controls={controls}
          />
        )}
        {inLobby && (
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
                  joinRoom={(e) => this.handleJoinRoom(e)}
                />
                <PrivateRoom
                  roomId={roomId}
                  opponentName={opponentName}
                  createRoom={() => this.handleCreateRoom()}
                  leaveRoom={() => leaveRoom()}
                  getToGame={(e) => this.handleGetToGame(e)}
                  isPlayerOne={isPlayerOne}
                />
              </LobbySettings>
            </LobbyWrapper>
          </>
        )}
      </>
    );
  }
}

export default GameSettings;
