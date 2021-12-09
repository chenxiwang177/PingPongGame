import React, { Component } from "react";
import styled from "styled-components";
import GameAreaWithSocket from "../GameArea/GameAreaWithSocket";
import GameSettingsWithSocket from "../GameSettings/GameSettingsWithSocket";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import Error from "../../components/ErrorModal/ErrorModal";
import { ReactComponent as Logo } from "../../images/log.svg";

const Header = styled.header`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  height: 5vh;
  margin-top: 3vh;
`;

const Footer = styled.footer`
  font-size: 0.5rem;
  text-align: right;
  margin-right: 5vw;
  color: #1a1a1a;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  user-select: none;

  > p {
    margin: 0;
  }

  @media (min-width: 1024px) {
    font-size: 0.8rem;
  }
`;

class MainView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      playerName: "",
      controls: "knob",
      opponentName: "",
      roomId: "",
      inLobby: false,
      gameOn: false,
      isPlayerOne: false,
      error: false,
    };
  }

  componentDidMount() {
    const { pong } = this.props;
    setTimeout(() => this.setState({ loading: false }), 1500);
    pong.on("errRooms", ({ msg }) => this.handleError(msg));
    pong.on("playerLeft", (msg) => this.onOtherPlayerLeft(msg));
  }

  handleSettingRoomId = (roomId) => {
    this.setState({ roomId });
  };

  handleSettingPlayerName = (playerName) => {
    this.setState({ playerName });
  };

  handleSettingControls = (controls) => {
    this.setState({ controls });
  };

  handlePlayerOne = (isPlayerOne) => {
    this.setState({ isPlayerOne });
  };

  handleSettingOpponentName = (opponentName) => {
    this.setState({ opponentName });
  };

  handleSettingGame = () => {
    this.setState({ gameOn: true });
  };

  handleInAndOutLobby = () => {
    const { inLobby } = this.state;
    this.setState({ inLobby: !inLobby });
  };

  handleError = (error) => {
    this.setState({ error });
  };

  closeErrorModal = (e) => {
    if (e.target.dataset.element === "modal") return;
    this.setState({ error: false });
  };

  handleLeavingRoom = () => {
    const { pong } = this.props;
    const { gameOn } = this.state;
    this.handleSettingRoomId("");
    this.handleSettingOpponentName("");
    if (gameOn) this.setState({ gameOn: false });
    pong.emit("leaveRoom");
    pong.emit("getAllRooms");
  };

  onOtherPlayerLeft = (msg) => {
    const { pong } = this.props;
    const { isPlayerOne, gameOn } = this.state;
    if (!isPlayerOne) this.handleSettingRoomId("");
    if (gameOn) this.setState({ gameOn: false });
    this.handleSettingOpponentName("");
    this.handleError(msg);
    pong.emit("getAllRooms");
  };

  render() {
    const {
      playerName,
      opponentName,
      roomId,
      gameOn,
      isPlayerOne,
      loading,
      error,
      inLobby,
      controls,
    } = this.state;
    return (
      <>
        {loading && <LoadingScreen />}
        {!loading && (
          <Header>
            {" "}
            <Logo height="150px" />{" "}
          </Header>
        )}
        {!loading && !gameOn && (
          <GameSettingsWithSocket
            playerName={playerName}
            opponentName={opponentName}
            roomId={roomId}
            controls={controls}
            isPlayerOne={isPlayerOne}
            goToLobby={() => this.handleInAndOutLobby()}
            inLobby={inLobby}
            setRoomId={(id) => this.handleSettingRoomId(id)}
            setPlayerName={(name) => this.handleSettingPlayerName(name)}
            setOpponentName={(name) => this.handleSettingOpponentName(name)}
            setControls={(c) => this.handleSettingControls(c)}
            setGame={(hasStartedGame) => this.handleSettingGame(hasStartedGame)}
            setPlayerOne={(val) => this.handlePlayerOne(val)}
            handleError={(err) => this.handleError(err)}
            leaveRoom={() => this.handleLeavingRoom()}
          />
        )}
        {gameOn && (
          <GameAreaWithSocket
            roomId={roomId}
            controls={controls}
            isPlayerOne={isPlayerOne}
            leaveGame={() => this.handleLeavingRoom()}
          />
        )}
        {error && (
          <Error msg={error} closeModal={(e) => this.closeErrorModal(e)} />
        )}
        <Footer>
          <p>
            ©2019 G_O / Pong® is a registered trademark of Atari Interactive
            Inc.{" "}
            <span role="img" aria-labelledby="jsx-a11y/accessible-emoji">
              🖖
            </span>
          </p>
        </Footer>
      </>
    );
  }
}

export default MainView;
