import styled from "styled-components";
import CloseIcon from "../../images/close.svg";
import SoundOnIcon from "../../images/soundOn.svg";
import SoundOffIcon from "../../images/soundOff.svg";

const GameInterfaceWrapper = styled.div`
  position: absolute;
  top: -3px;
  right: 17px;
  display: flex;

  @media (min-width: 1024px) {
    top: 1.5vh;
    right: 5vw;
  }
`;

const GameInterfaceBtn = styled.button`
  background: none;
  border: none;
  padding: 15px;

  @media (min-width: 1024px) {
    padding: 20px;
  }

  ${SoundOffIcon} > svg, ${SoundOnIcon} > svg {
    width: 20px;
    height: 20px;

    @media (min-width: 1024px) {
      width: 30px;
      height: 30px;
    }
  }

  ${CloseIcon} > svg {
    width: 18px;
    height: 18px;

    @media (min-width: 1024px) {
      width: 25px;
      height: 25px;
    }
  }
`;

const GameInterface = ({ leaveGame, audioOn, toggleAudio }) => (
  <GameInterfaceWrapper>
    <GameInterfaceBtn>
      {audioOn ? (
        <img
          src={SoundOnIcon}
          onClick={() => toggleAudio(false)}
          alt="soundon"
        />
      ) : (
        <image
          src={SoundOffIcon}
          onClick={() => toggleAudio(true)}
          alt="soundoff"
        />
      )}
    </GameInterfaceBtn>
    <GameInterfaceBtn>
      <img src={CloseIcon} onClick={() => leaveGame()} alt="close" />
    </GameInterfaceBtn>
  </GameInterfaceWrapper>
);

export default GameInterface;
