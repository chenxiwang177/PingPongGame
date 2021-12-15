import { useEffect, useState } from "react";
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
`;

const MainView = (props) => {
  const [loading, setLoading] = useState(true);
  const [playerName, setPlayerName] = useState("");
  const [controls, setControls] = useState("know");
  const [opponentName, setOpponentName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [inLobby, setInLobby] = useState(false);
  const [gameOn, setGameOn] = useState(false);
  const [isPlayerOne, setIsPlayerOne] = useState(false);
  const [error, setError] = useState(false);
  const { pong } = props;

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
    pong.on("errRooms", ({ msg }) => handleError(msg));
    pong.on("playerLeft", (msg) => onOtherPlayerLeft(msg));
  }, []);

  const handleSettingRoomId = (roomId) => {
    setRoomId(roomId);
  };

  const handleSettingPlayerName = (playerName) => {
    setPlayerName(playerName);
  };

  const handleSettingControls = (controls) => {
    setControls(controls);
  };

  const handlePlayerOne = (isPlayerOne) => {
    setIsPlayerOne(isPlayerOne);
  };

  const handleSettingOpponentName = (opponentName) => {
    setOpponentName(opponentName);
  };

  const handleSettingGame = () => {
    setGameOn(true);
  };

  const handleInAndOutLobby = () => {
    setInLobby(!inLobby);
  };

  const handleError = (error) => {
    setError(error);
  };

  const closeErrorModal = (e) => {
    if (e.target.dataset.element === "modal") return;
    setError(false);
  };

  const handleLeavingRoom = () => {
    handleSettingRoomId("");
    handleSettingOpponentName("");
    if (gameOn) setGameOn(false);
    pong.emit("leaveRoom");
    pong.emit("getAllRooms");
  };

  const onOtherPlayerLeft = (msg) => {
    if (!isPlayerOne) handleSettingRoomId("");
    if (gameOn) setGameOn(false);
    handleSettingOpponentName("");
    handleError(msg);
    pong.emit("getAllRooms");
  };
  return (
    <>
      {loading && <LoadingScreen />}
      {!loading && !inLobby && !gameOn && (
        <Header>
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
          goToLobby={() => handleInAndOutLobby()}
          inLobby={inLobby}
          setRoomId={(id) => handleSettingRoomId(id)}
          setPlayerName={(name) => handleSettingPlayerName(name)}
          setOpponentName={(name) => handleSettingOpponentName(name)}
          setControls={(c) => handleSettingControls(c)}
          setGame={(hasStartedGame) => handleSettingGame(hasStartedGame)}
          setPlayerOne={(val) => handlePlayerOne(val)}
          handleError={(err) => handleError(err)}
          leaveRoom={() => handleLeavingRoom()}
        />
      )}
      {gameOn && (
        <GameAreaWithSocket
          roomId={roomId}
          isPlayerOne={isPlayerOne}
          leaveGame={() => handleLeavingRoom()}
        />
      )}
      {error && <Error msg={error} closeModal={(e) => closeErrorModal(e)} />}
    </>
  );
};

export default MainView;
