const ServerBall = require("./ServerBall");
const ServerPaddle = require("./ServerPaddle");

class UsersService {
  constructor() {
    this.rooms = [];
    this.singleRoom = {
      ball: {},
      playerOne: {},
      playerTwo: {},
    };
  }

  getRooms() {
    return this.rooms;
  }
  getSingleRoom() {
    return this.singleRoom;
  }

  getGameElements(id) {
    for (let i = 0; i < this.rooms.length; i++) {
      if (this.rooms[i].id === id) {
        return {
          ball: this.rooms[i].ball,
          playerOnePaddle: this.rooms[i].playerOne.paddle,
          playerTwoPaddle: this.rooms[i].playerTwo.paddle,
        };
      }
    }
  }
  getSingleGameElements() {
    return {
      ball: this.singleRoom.ball,
      playerOnePaddle: this.singleRoom.playerOne.paddle,
      playerTwoPaddle: this.singleRoom.playerTwo.paddle,
    };
  }

  getElementsPos(id) {
    for (let i = 0; i < this.rooms.length; i++) {
      if (this.rooms[i].id === id) {
        return {
          ball: this.rooms[i].ball,
          playerOnePaddle: {
            y: this.rooms[i].playerOne.paddle.y,
            dx: this.rooms[i].playerOne.paddle.dx,
            dy: this.rooms[i].playerOne.paddle.dy,
            score: this.rooms[i].playerOne.paddle.score,
          },
          playerTwoPaddle: {
            y: this.rooms[i].playerTwo.paddle.y,
            dx: this.rooms[i].playerTwo.paddle.dx,
            dy: this.rooms[i].playerTwo.paddle.dy,
            score: this.rooms[i].playerTwo.paddle.score,
          },
        };
      }
    }
  }
  getSingleGameElementsPos() {
    return {
      ball: this.singleRoom.ball,
      playerOnePaddle: {
        y: this.singleRoom.playerOne.paddle.y,
        dx: this.singleRoom.playerOne.paddle.dx,
        dy: this.singleRoom.playerOne.paddle.dy,
        score: this.singleRoom.playerOne.paddle.score,
      },
      playerTwoPaddle: {
        y: this.singleRoom.playerTwo.paddle.y,
        dx: this.singleRoom.playerTwo.paddle.dx,
        dy: this.singleRoom.playerTwo.paddle.dy,
        score: this.singleRoom.playerTwo.paddle.score,
      },
    };
  }

  createRoom(newRoom) {
    this.rooms = [newRoom, ...this.rooms];
  }

  createSingleRoom(name) {
    this.singleRoom.playerOne.name = name;
  }

  joinRoom({ id, playerTwo }) {
    for (let i = 0; i < this.rooms.length; i++) {
      if (this.rooms[i].id === id) {
        this.rooms[i].playerTwo = playerTwo;
      }
    }
  }

  createGameElements(w, h, id) {
    for (let i = 0; i < this.rooms.length; i++) {
      if (this.rooms[i].id === id) {
        this.rooms[i].ball = new ServerBall(w / 2, h / 2, w, h);
        this.rooms[i].playerOne.paddle = new ServerPaddle(30, h / 2, w, h);
        this.rooms[i].playerTwo.paddle = new ServerPaddle(w - 50, h / 2, w, h);
      }
    }
  }
  createSingleGameElements(w, h) {
    this.singleRoom.ball = new ServerBall(w / 2, h / 2, w, h);
    this.singleRoom.playerOne.paddle = new ServerPaddle(30, h / 2, w, h);
    this.singleRoom.playerTwo.paddle = new ServerPaddle(w - 50, h / 2, w, h);
  }

  quitRoom(playerId) {
    for (let i = 0; i < this.rooms.length; i++) {
      if (this.rooms[i].playerOne && this.rooms[i].playerOne.id === playerId) {
        const roomIndex = i;
        this.rooms.splice(roomIndex, 1);
      } else if (
        this.rooms[i].playerTwo &&
        this.rooms[i].playerTwo.id === playerId
      ) {
        this.rooms[i].playerOne.ready = false;
        this.rooms[i].playerTwo = {
          id: null,
          name: null,
          ready: false,
          paddle: null,
        };
        this.rooms[i].ball = null;
      }
    }
  }
}

module.exports = UsersService;
