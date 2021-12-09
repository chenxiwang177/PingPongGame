import React from 'react';
import styled from 'styled-components';
import { ReactComponent as RefreshIcon } from '../../images/refresh.svg';

const RoomsWrapper = styled.div`
  background: #fefefe;
  color: #1a1a1a;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 0 0 0 30px;

  @media (min-width: 1024px) {
    height: 64%;
    border-radius: 0;
  }
`;

const RoomsHeader = styled.h4`
  margin: 5px 0;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 1.4rem;
  font-weight: 400;

  @media (min-width: 1024px) {
    margin: 15px 0;
  }
`;

const RoomsList = styled.div`
  height: 90%;
  width: 100%;
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
  align-content: baseline;
`;

const RoomsListHeader = styled.div`
  display: flex;
  background: #f3f3f3;
  width: 100%;
  min-height: 25px;

  @media (min-width: 1024px) {
    height: 40px;
  }
`;

const Room = styled.div`
  border-bottom: 1px solid #f3f3f3;
  display: flex;
  width: 100%;
  height: 45px;

  @media (min-width: 1024px) {
    height: 60px;
  }
`;

const RoomName = styled.div`
  width: 33.33%;
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RoomPlayers = styled.div`
  width: 33.33%;
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const RoomJoin = styled.div`
  width: 33.33%;
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RoomPlayer = styled.div`
  height: 50%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${props => (props.free ? '#ffed90' : '#fefefe')};
`;

const JoinBtn = styled.button`
  text-transform: uppercase;
  font-family: 'Concert One', cursive;
  font-size: 0.9rem;
  width: 60%;
  background: #ed1c24;
  color: #fefefe;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  padding: 0;
  line-height: 1.8rem;

  &:hover {
    cursor: pointer;
  }

  @media (min-width: 1024px) {
    padding: 8px;
    border-radius: 50px;
  }
`;

const RefreshBtn = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  font-size: 1rem;
  text-transform: uppercase;
  font-family: 'Concert One', cursive;
  padding: 10px 20px;

  &:hover {
    cursor: pointer;
  }

  &:focus {
    outline: none;
  }

  @media (min-width: 1024px) {
    font-size: 1.2rem;
  }
`;

const RefreshBtnTxt = styled.p`
  margin: 0 10px 0 0;

  ${RefreshBtn}:focus && {
    margin: 0 10px -2px 0;
    border-bottom: 2px solid #ed1c24;
  }
`;

const NoRoomsErr = styled.p`
  text-align: center;
  width: 100%;
  margin: 7vh 0 0 0;
  color: #333333;
`;

const Refresh = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  > svg {
    width: 24px;
    height: 24px;
  }

  ${RefreshBtn}:focus && {
    transition: 1s;
    transform: rotate(360deg);
  }

  @media (min-width: 1024px) {
    > svg {
      width: 36px;
      height: 36px;
    }
  }
`;

const Rooms = ({ rooms, refreshRoomsList, joinRoom }) => (
  <RoomsWrapper>
    <RoomsHeader>Lobby</RoomsHeader>
    <RoomsList>
      <RoomsListHeader>
        <RoomName>Room name</RoomName>
        <RoomPlayers>Players</RoomPlayers>
        <RoomJoin />
      </RoomsListHeader>
      {rooms.length === 0 && <NoRoomsErr>no active rooms</NoRoomsErr>}
      {rooms.map(room => (
        <Room key={room.id}>
          <RoomName>{room.id}</RoomName>
          <RoomPlayers>
            <RoomPlayer>{room.playerOne.name}</RoomPlayer>
            <RoomPlayer free={room.playerTwo.name === null && true}>
              {room.playerTwo.name !== null ? room.playerTwo.name : 'Free'}
            </RoomPlayer>
          </RoomPlayers>
          <RoomJoin>
            <JoinBtn
              type="button"
              data-name={room.id}
              onClick={e => joinRoom(e)}
            >
              Join room
            </JoinBtn>
          </RoomJoin>
        </Room>
      ))}
    </RoomsList>
    <RefreshBtn type="button" onClick={refreshRoomsList}>
      <RefreshBtnTxt>Refresh</RefreshBtnTxt>
      <Refresh>
        <RefreshIcon />
      </Refresh>
    </RefreshBtn>
  </RoomsWrapper>
);

export default Rooms;
