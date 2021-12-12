import { useState } from "react";
import styled from "styled-components";
import { ReactComponent as ArrowUp } from "../../images/arrowUp.svg";
import { ReactComponent as ArrowDown } from "../../images/arrowDown.svg";

const ArrowsWrapper = styled.div`
  position: absolute;
  bottom: 6vh;
  right: 4vw;
  display: flex;
  flex-direction: column;

  > svg {
    margin: 0;
    cursor: pointer;
  }

  @media (min-width: 1024px) {
    display: none;
  }
`;

const ControlsArrows = (props) => {
  const [dir, setDir] = useState("");
  var frameId;
  const { handlePlayerMove } = props;
  const onPress = (dir) => {
    setDir(dir);
    requestAnimationFrame(handleTouch);
  };

  const handleTouch = () => {
    handlePlayerMove(dir);
    frameId = window.requestAnimationFrame(handleTouch);
  };

  const onRelease = () => {
    setDir("");
    handlePlayerMove("");
    window.cancelAnimationFrame(frameId);
  };

  return (
    <ArrowsWrapper>
      <ArrowUp
        width="60px"
        height="60px"
        onTouchStart={() => onPress("ArrowUp")}
        onTouchEnd={() => onRelease()}
      />
      <ArrowDown
        width="60px"
        height="60px"
        onTouchStart={() => onPress("ArrowDown")}
        onTouchEnd={() => onRelease()}
      />
    </ArrowsWrapper>
  );
};

export default ControlsArrows;
