import React from 'react';
import SocketContext from '../../components/SocketContext/SocketContext';
import GameSettings from './GameSettings';

const GameSettingsWithSocket = props => (
    <SocketContext.Consumer>
    {pong => <GameSettings {...props} pong={pong} />}
    </SocketContext.Consumer>
    )
    
  export default GameSettingsWithSocket;