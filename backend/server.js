const express = require("express");
const app = express();
const socket = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
const UsersService = require("./server/UsersService");
const gameResultModel = require("./server/GameResult");
const usersService = new UsersService();

app.use(express());
const port = 8000;
app.use(cors());
const mongoDatabase = "mongodb://localhost:27017/pingpong";
mongoose.Promise = global.Promise;
mongoose.connect(mongoDatabase, { useNewUrlParser: true }).then(
  () => {
    console.log("Database is connected");
  },
  (err) => {
    console.log("There is problem while connecting database " + err);
  }
);

var server = app.listen(
  port,
  console.log(`Server is running on the port ${port} `)
);

const io = socket(server);
io.on("connection", (socket) => {
  socket.on("createRoom", ({ roomName, clientName }) => {
    usersService.createRoom({
      id: roomName,
      playerOne: {
        id: socket.id,
        name: clientName,
        ready: false,
      },
      playerTwo: {
        id: null,
        name: null,
        ready: false,
      },
    });
    socket.join(`room-${roomName}`);
    socket.emit("goToGameRoom", {
      roomId: roomName,
      opponentName: false,
      isPlayerOne: true,
    });
  });

  socket.on("leaveRoom", () => {
    const rooms = usersService.getRooms();
    function leaveGame(roomName, socketId, msg) {
      socket.in(`room-${roomName}`).emit("playerLeft", msg);
      socket.leave(`room-${roomName}`);
      usersService.quitRoom(socketId);
    }
    let msg = "";
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

  socket.on("getAllRooms", () => {
    socket.emit("sendRoomsList", usersService.getRooms());
  });

  socket.on("joinRoom", ({ roomName, clientName }) => {
    const rooms = usersService.getRooms();
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].id === roomName) {
        if (rooms[i].playerTwo.id === null) {
          usersService.joinRoom({
            id: roomName,
            playerTwo: {
              id: socket.id,
              name: clientName,
              ready: false,
            },
          });
          const roomCreator = rooms[i].playerOne.name;
          // for client to get into game waiting room
          socket.emit("goToGameRoom", {
            roomId: roomName,
            opponentName: roomCreator,
            isPlayerOne: false,
          });
          // so opponent knew that client's in
          socket.to(`room-${roomName}`).emit("opponentInLobby", {
            opponentName: clientName,
          });
          return socket.join(`room-${roomName}`);
        }
        return socket.emit("errRooms", {
          msg: `The room ${roomName} is full.`,
        });
      }
      return socket.emit("errRooms", {
        msg: `The room ${roomName} does not exist.`,
      });
    }
  });

  socket.on("getToGame", ({ roomName, decision }) => {
    const rooms = usersService.getRooms();
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].id === roomName) {
        if (rooms[i].playerOne.id === socket.id)
          rooms[i].playerOne.ready = decision;
        if (rooms[i].playerTwo.id === socket.id)
          rooms[i].playerTwo.ready = decision;
        if (rooms[i].playerOne.ready && rooms[i].playerTwo.ready) {
          io.in(`room-${roomName}`).emit("gameReady");
        }
      }
    }
  });

  socket.on("createGameElements", ({ w, h, roomName }) => {
    usersService.createGameElements(w, h, roomName);
    socket.emit("gameElementsCreated", usersService.getGameElements(roomName));
  });

  socket.on("createSingleGameElements", ({ w, h }) => {
    usersService.createSingleGameElements(w, h);
    socket.emit(
      "singleGameElementsCreated",
      usersService.getSingleGameElements()
    );
  });

  socket.on("clientMove", (clientMove) => {
    const rooms = usersService.getRooms();
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].playerOne.id === socket.id) {
        rooms[i].playerOne.paddle.update(clientMove);
      } else if (rooms[i].playerTwo.id === socket.id) {
        rooms[i].playerTwo.paddle.update(clientMove);
      }
    }
  });

  socket.on("singleGameClientMove", (clientMove) => {
    const singleRoom = usersService.getSingleRoom();
    singleRoom.playerTwo.paddle.update(clientMove);
  });

  socket.on("aiMove", () => {
    const singleRoom = usersService.getSingleRoom();
    const ballY = singleRoom.ball.y;
    const ballDx = singleRoom.ball.dx;
    if (ballDx === -2) singleRoom.playerOne.paddle.aiMove(ballY);
  });

  socket.on("requestSync", (roomName) => {
    const rooms = usersService.getRooms();
    const updateScore = (isPlayerOneWon) => {
      for (let i = 0; i < rooms.length; i++) {
        if (rooms[i].id === roomName) {
          if (isPlayerOneWon) {
            rooms[i].playerOne.paddle.updateScore();
            if (rooms[i].playerOne.paddle.score >= 4) {
              new gameResultModel({
                roomName: roomName,
                playerOne: rooms[i].playerOne.name,
                playerTwo: rooms[i].playerTwo.name,
                playerOneScore: 4,
                playerTwoScore: rooms[i].playerTwo.paddle.score,
              })
                .save()
                .then(() =>
                  console.log("game finished and save result successfully")
                );
            }
          } else {
            rooms[i].playerTwo.paddle.updateScore();
            if (rooms[i].playerTwo.paddle.score >= 4) {
              new gameResultModel({
                roomName: roomName,
                playerOne: rooms[i].playerOne.name,
                playerTwo: rooms[i].playerTwo.name,
                playerOneScore: rooms[i].playerOne.paddle.score,
                playerTwoScore: 4,
              })
                .save()
                .then(() =>
                  console.log("game finished and save result successfully")
                );
            }
          }
          io.in(`room-${roomName}`).emit("addAudio", "score");
        }
      }
    };
    const addBorderBounce = () =>
      io.in(`room-${roomName}`).emit("addAudio", "border");
    const addPaddleBounce = () =>
      io.in(`room-${roomName}`).emit("addAudio", "paddle");
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].id === roomName && rooms[i].ball !== null) {
        rooms[i].ball.update(
          rooms[i].playerOne.paddle,
          rooms[i].playerTwo.paddle,
          (win) => updateScore(win),
          () => addBorderBounce(),
          () => addPaddleBounce()
        );
        const elementsPos = usersService.getElementsPos(roomName);
        io.in(`room-${roomName}`).emit("syncMoves", elementsPos);
      }
    }
  });

  socket.on("singleGameRequestSync", () => {
    const singleRoom = usersService.getSingleRoom();
    const updateScore = (isPlayerOneWon) => {
      if (isPlayerOneWon) {
        singleRoom.playerOne.paddle.updateScore();
      } else {
        singleRoom.playerTwo.paddle.updateScore();
      }
      socket.emit("addAudio", "score");
    };

    const addBorderBounce = () => socket.emit("addAudio", "border");
    const addPaddleBounce = () => socket.emit("addAudio", "paddle");

    if (singleRoom.ball !== null) {
      singleRoom.ball.update(
        singleRoom.playerOne.paddle,
        singleRoom.playerTwo.paddle,
        (win) => updateScore(win),
        () => addBorderBounce(),
        () => addPaddleBounce()
      );
      const elementsPos = usersService.getSingleGameElementsPos();
      socket.emit("syncMoves", elementsPos);
    }
  });
});
