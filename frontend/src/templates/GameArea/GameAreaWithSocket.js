import React from 'react';
import SocketContext from '../../components/SocketContext/SocketContext';
import GameArea from './GameArea';

const GameAreaWithSocket = props => (
    <SocketContext.Consumer>
    {pong => <GameArea {...props} pong={pong} />}
    </SocketContext.Consumer>
    )
    
  export default GameAreaWithSocket;