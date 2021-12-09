import React from 'react';
import styled from 'styled-components';
import rotate from '../../images/rotate.gif';

const RatioErrorBox = styled.div`
  height: 50vh;
  width: 50vw;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const RatioErrorMsg = styled.p`
  font-size: 40px;
  font-weight: 600;
`;

const RotateImg = styled.img`
  max-height: 200px;
`;

function RatioError() {
  return (
    <RatioErrorBox>
      <RatioErrorMsg>To play switch to landscape mode.</RatioErrorMsg>
      <RotateImg src={rotate} alt="rotate" />
    </RatioErrorBox>
  );
}

export default RatioError;
