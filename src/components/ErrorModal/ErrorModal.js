import React from 'react';
import styled from 'styled-components';
import { ReactComponent as CloseIcon } from '../../images/close.svg';

const ErrorModalBackground = styled.div`
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: fixed;
  z-index: 990;
  background: rgba(30, 30, 30, 0.2);
`;

const ErrorModal = styled.div`
  position: absolute;
  top: 50%;
  height: 30vh;
  width: 40vw;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
  z-index: 999;
  display: flex;
  flex-direction: column;
  background: #1e1e1e;
  color: #fefefe;
  border: 1px solid #fefefe;
`;

const ErrorModalHeader = styled.div`
  height: 20%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #fefefe;
`;

const ErrorHeader = styled.p`
  margin: 0;
`;

const CloseModalBtn = styled.button`
  position: absolute;
  right: 30px;
  background: none;
  border: none;
`;

const ErrorModalBody = styled.div`
  display: flex;
  height: 80%;
  justify-content: center;
  align-items: center;
`;

const Error = ({ msg, closeModal }) => (
  <ErrorModalBackground onClick={e => closeModal(e)}>
    <ErrorModal>
      <ErrorModalHeader data-element="modal">
        <ErrorHeader data-element="modal">Error</ErrorHeader>
        <CloseModalBtn type="button" onClick={e => closeModal(e)}>
          <CloseIcon
            style={{
              fill: '#fefefe',
              width: '15px',
              height: '15px',
              marginTop: '2px',
              padding: '0'
            }}
          />
        </CloseModalBtn>
      </ErrorModalHeader>
      <ErrorModalBody data-element="modal">
        <p data-element="modal">{msg}</p>
      </ErrorModalBody>
    </ErrorModal>
  </ErrorModalBackground>
);

export default Error;
