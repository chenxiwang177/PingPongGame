const { io } = require('../../index');
const UsersService = require('./UsersService');

const usersService = new UsersService();

module.exports = function socketsManager(socket) {
  socket.on('createRoom', ({ roomName, clientName }) => {
    usersService.createRoom({
      id: roomName,
      playerOne: {
        id: socket.id,
        name: clientName,
        ready: false
      },
      playerTwo: {
        id: null,
        name: null,
        ready: false
      }
    });
    socket.join(`room-${roomName}`);
    socket.emit('goToGameRoom', {
      roomId: roomName,
      opponentName: false,
      isPlayerOne: true
    });
  });

  socket.on('leaveRoom', () => {
    const rooms = usersService.getRooms();
    // async function leaveGame(roomName, socketId, msg) {
    //   await socket.in(`room-${roomName}`).emit('playerLeft', msg);
    //   await socket.leave(`room-${roomName}`);
    //   await usersService.quitRoom(socketId);
    // }
    function leaveGame(roomName, socketId, msg) {
      socket.in(`room-${roomName}`).emit('playerLeft', msg);
      socket.leave(`room-${roomName}`);
      usersService.quitRoom(socketId);
    }
    let msg = '';
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].playerOne && rooms[i].playerOne.id === socket.id) {
        msg = `Your opponent ${rooms[i].playerOne.name} has closed the room.`;
        leaveGame(rooms[i].id, socket.id, msg);
      } else if (rooms[i].playerTwo && rooms[i].playerTwo.id === socket.id) {
        msg = `Your opponent ${rooms[i].playerTwo.name} has left the room.`;
        leaveGame(rooms[i].id, socket.id, msg);
      }
    }
  });

  socket.on('getAllRooms', () => {
    socket.emit('sendRoomsList', usersService.getRooms());
  });

  socket.on('joinRoom', ({ roomName, clientName }) => {
    const rooms = usersService.getRooms();
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].id === roomName) {
        if (rooms[i].playerTwo.id === null) {
          usersService.joinRoom({
            id: roomName,
            playerTwo: {
              id: socket.id,
              name: clientName,
              ready: false
            }
          });
          const roomCreator = rooms[i].playerOne.name;
          // for client to get into game waiting room
          socket.emit('goToGameRoom', {
            roomId: roomName,
            opponentName: roomCreator,
            isPlayerOne: false
          });
          // so opponent knew that client's in
          socket.to(`room-${roomName}`).emit('opponentInLobby', {
            opponentName: clientName
          });
          return socket.join(`room-${roomName}`);
        }
        return socket.emit('errRooms', {
          msg: `The room ${roomName} is full.`
        });
      }
      return socket.emit('errRooms', {
        msg: `The room ${roomName} does not exist.`
      });
    }
  });

  socket.on('getToGame', ({ roomName, decision }) => {
    const rooms = usersService.getRooms();
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].id === roomName) {
        if (rooms[i].playerOne.id === socket.id)
          rooms[i].playerOne.ready = decision;
        if (rooms[i].playerTwo.id === socket.id)
          rooms[i].playerTwo.ready = decision;
        if (rooms[i].playerOne.ready && rooms[i].playerTwo.ready) {
          io.in(`room-${roomName}`).emit('gameReady');
        }
      }
    }
  });

  socket.on('createGameElements', ({ w, h, roomName }) => {
    usersService.createGameElements(w, h, roomName);
    socket.emit('gameElementsCreated', usersService.getGameElements(roomName));
  });

  socket.on('clientMove', clientMove => {
    const rooms = usersService.getRooms();
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].playerOne.id === socket.id) {
        rooms[i].playerOne.paddle.update(clientMove);
      } else if (rooms[i].playerTwo.id === socket.id) {
        rooms[i].playerTwo.paddle.update(clientMove);
      }
    }
  });

  socket.on('requestSync', roomName => {
    const rooms = usersService.getRooms();
    const updateScore = isPlayerOneWon => {
      for (let i = 0; i < rooms.length; i++) {
        if (rooms[i].id === roomName) {
          if (isPlayerOneWon) {
            rooms[i].playerOne.paddle.updateScore();
          } else {
            rooms[i].playerTwo.paddle.updateScore();
          }
          io.in(`room-${roomName}`).emit('addAudio', 'score');
        }
      }
    };
    const addBorderBounce = () =>
      io.in(`room-${roomName}`).emit('addAudio', 'border');
    const addPaddleBounce = () =>
      io.in(`room-${roomName}`).emit('addAudio', 'paddle');
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].id === roomName && rooms[i].ball !== null) {
        rooms[i].ball.update(
          rooms[i].playerOne.paddle,
          rooms[i].playerTwo.paddle,
          win => updateScore(win),
          () => addBorderBounce(),
          () => addPaddleBounce()
        );
        const elementsPos = usersService.getElementsPos(roomName);
        io.in(`room-${roomName}`).emit('syncMoves', elementsPos);
      };
    };
  });

  socket.on('disconnect', () => {
    const rooms = usersService.getRooms();
    async function leaveGame(roomName, socketId, msg) {
      await socket.in(`room-${roomName}`).emit('playerLeft', msg);
      await socket.leave(`room-${roomName}`);
      await usersService.quitRoom(socketId);
    }
    let msg = '';
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].playerOne && rooms[i].playerOne.id === socket.id) {
        msg = `Your opponent ${rooms[i].playerOne.name} has closed the room.`;
        leaveGame(rooms[i].id, socket.id, msg);
      } else if (rooms[i].playerTwo && rooms[i].playerTwo.id === socket.id) {
        msg = `Your opponent ${rooms[i].playerTwo.name} has left the room.`;
        leaveGame(rooms[i].id, socket.id, msg);
      }
    };
  });
};
