import { useState } from "react";
import styled from "styled-components";
import { Knob } from "react-rotary-knob";
import knobSkin from "./KnobSkin";

const KnobWrapper = styled.div`
  position: fixed;
  z-index: 99;
  bottom: -1vh;
  right: 0;

  @media (min-width: 1024px) {
    bottom: -2vh;
    right: 2vw;
  } ;
`;

const KnobController = styled(Knob)`
  width: 40vh !important;
  height: 40vh !important;
  padding: 5vh;
  display: inline-block;

  > input {
    opacity: 0;
  }

  @media (min-width: 1024px) {
    width: 25vh !important;
    height: 25vh !important;
  } ;
`;

const ControlsKnob = ({ handlePlayerMove }) => {
  const [val, setVal] = useState(100);

  const handleChange = (value) => {
    const newVal = Math.floor(value);
    if (val > newVal) handlePlayerMove("KnobDown");
    if (val < newVal) handlePlayerMove("KnobUp");
    if (val === newVal) handlePlayerMove("");
    setVal(newVal);
  };

  return (
    <KnobWrapper>
      <KnobController
        min={0}
        max={300}
        value={val}
        unlockDistance={0}
        preciseMode={false}
        skin={knobSkin}
        onChange={(e) => handleChange(e)}
      />
    </KnobWrapper>
  );
};

export default ControlsKnob;
