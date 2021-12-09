import React from 'react';
import SocketContext from '../../components/SocketContext/SocketContext';
import MainView from './MainView';

const MainViewWithSocket = props => (
  <SocketContext.Consumer>
    {pong => <MainView {...props} pong={pong} />}
  </SocketContext.Consumer>
);

export default MainViewWithSocket;
