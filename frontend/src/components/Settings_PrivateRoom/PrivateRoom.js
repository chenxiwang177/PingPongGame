import React from 'react';
import styled from 'styled-components';
import ReadyCheckbox from './ReadyCheckbox';

const PrivateRoomWrapper = styled.div`
  width: 60%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  @media (min-width: 1024px) {
    width: 100%;
    height: 36%;
  }
`;

const RoomTxt = styled.p`
  color: #fefefe;
  font-size: 1rem;
  text-align: center;
  margin: 0 0 20px 0;

  @media (min-width: 1024px) {
    font-size: 1.2rem;
  }
`;

const Button = styled.button`
  width: 65%;
  border-radius: 50px;
  text-align: center;
  padding: 5px 10px;
  border: none;
  font-family: 'Concert One', cursive;
  font-size: 1rem;
  color: #fefefe;
  text-transform: uppercase;

  &:hover {
    cursor: pointer;
  }

  @media (min-width: 1024px) {
    width: 50%;
    font-size: 1.2rem;
    padding: 10px 5px;
  }
`;

const CreateRoomBtn = styled(Button)`
  background: #ed1c24;
`;

const DestroyRoomBtn = styled(Button)`
  background: brown;
`;

const LeaveRoomBtn = styled(Button)`
  background: brown;
  width: 60%;
  font-size: 1rem;

  @media (min-width: 1024px) {
    width: 30%;
  }
`;

const RoomSpan = styled.span`
  border-bottom: 2px solid #ed1c24;
`;

const PrivateRoom = ({
  opponentName,
  roomId,
  createRoom,
  getToGame,
  leaveRoom,
  isPlayerOne
}) => {
  return (
    <PrivateRoomWrapper>
      {!roomId && (
        <>
          <RoomTxt>or just simply</RoomTxt>
          <CreateRoomBtn type="button" onClick={() => createRoom()}>
            create new room
          </CreateRoomBtn>
        </>
      )}
      {roomId && !opponentName && (
        <>
          <RoomTxt>
            Your room <RoomSpan>{roomId}</RoomSpan> is ready
          </RoomTxt>
          <RoomTxt>Waiting for the opponent...</RoomTxt>
          <DestroyRoomBtn type="button" onClick={() => leaveRoom()}>
            forget this room
          </DestroyRoomBtn>
        </>
      )}
      {roomId && opponentName && (
        <>
          <RoomTxt>
            Your opponent <RoomSpan>{opponentName}</RoomSpan> is conncected.
          </RoomTxt>
          <ReadyCheckbox getToGame={isReady => getToGame(isReady)} />
          <LeaveRoomBtn type="button" onClick={() => leaveRoom()}>
            {isPlayerOne ? 'forget this room' : 'leave this room'}
          </LeaveRoomBtn>
        </>
      )}
    </PrivateRoomWrapper>
  );
};

export default PrivateRoom;
