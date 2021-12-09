import React, { useState } from 'react';
import styled from 'styled-components';
import { ReactComponent as Checkmark } from '../../images/checkmark.svg';

const RoomReadyLabel = styled.label`
  position: relative;
  user-select: none;
  font-size: 1.2rem;
  height: 30px;
  padding-right: 40px;
  margin: 10px 0 20px 0;
  cursor: pointer;
  display: block;

  @media (min-width: 1024px) {
    font-size: 1.4rem;
    margin: 5px 0 25px 0;
    padding-right: 50px;
  }
`;

const RoomReadyCustomCheckbox = styled.div`
  position: absolute;
  top: -8px;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 28px;
  width: 28px;
  border: ${props =>
    props.checked ? '3px solid #ed1c24' : '3px solid #ffed90'};
  background-color: ${props => (props.checked ? '#ed1c24' : '#1e1e1e')};
  transition: 1s;

  ${Checkmark} {
    fill: ${props => (props.checked ? '#1e1e1e' : 'none')};
    transition: 0.5s;
    height: 26px;
    width: 26px;
  }

  @media (min-width: 1024px) {
    top: -4px;
  }
`;

const RoomReadyCheckbox = styled.input`
  border: 0;
  clip: rect(0 0 0 0);
  clippath: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

const ReadyCheckbox = ({ getToGame }) => {
  const [checked, setChecked] = useState(false);

  const handlePlayerDecision = () => {
    setChecked(!checked);
    getToGame(!checked);
  }

  return (
    <RoomReadyLabel>
      Tick when you ready
      <RoomReadyCustomCheckbox checked={checked}>
        <Checkmark />
      </RoomReadyCustomCheckbox>
      <RoomReadyCheckbox
        type="checkbox"
        checked={checked}
        onClick={() => handlePlayerDecision()}
      />
    </RoomReadyLabel>
  );
}

export default ReadyCheckbox;
