function ServerBall(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.dx = 2;
  this.dy = 0;
  this.size = 14;
  this.canvas = {
    width: w,
    height: h
  };
}

ServerBall.prototype = {
  update(
    clientPaddle,
    enemyPaddle,
    updateScore,
    addBorderBounce,
    addPaddleBounce
  ) {
    this.x += this.dx;
    this.y += this.dy;
    const xTop = this.x - this.size;
    const yTop = this.y - this.size;
    const xBottom = this.x + this.size;
    const yBottom = this.y + this.size;
    // bouncing off top and bottom
    if (this.y - this.size < 0) {
      this.y = this.size;
      this.dy = -this.dy;
      addBorderBounce();
    } else if (this.y + this.size > this.canvas.height) {
      this.y = this.canvas.height - this.size;
      this.dy = -this.dy;
      addBorderBounce();
    }

    if (this.x + this.size < 0 || this.x > this.canvas.width) {
      const playerOneWin = !(this.x + this.size < 0);
      updateScore(playerOneWin);
      this.redraw();
    }

    if (xTop < this.canvas.width / 2) {
      if (
        xTop < clientPaddle.x - clientPaddle.width &&
        xBottom > clientPaddle.x &&
        yTop < clientPaddle.y + clientPaddle.height &&
        yBottom > clientPaddle.y
      ) {
        // hit players paddle
        this.dx = 2;
        this.dy = clientPaddle.dy / 2;
        this.x += this.dx;
        addPaddleBounce();
      }
    } else if (
      xTop < enemyPaddle.x - enemyPaddle.width &&
      xBottom > enemyPaddle.x &&
      yTop < enemyPaddle.y + enemyPaddle.height &&
      yBottom > enemyPaddle.y
    ) {
      // hit enemys paddle
      this.dx = -2;
      this.dy = enemyPaddle.dy / 2;
      this.x += this.dx;
      addPaddleBounce();
    }
  },

  redraw() {
    const randomBallPos = Math.random();
    const randomThrowAngle = Math.floor(randomBallPos * (4 - 3 + 1) + 3);
    const canvTop = Math.floor(Math.random() * (200 - 50 + 1)) + 50;
    const canvBottom = Math.floor(Math.random() * (550 - 400 + 1)) + 400;
    this.x = this.canvas.width / 2;
    this.y = Math.random() < 0.5 ? canvTop : canvBottom;
    this.dx = randomBallPos < 0.5 ? 2 : -2;
    if (this.y === canvTop) {
      this.dy = -randomThrowAngle;
    } else {
      this.dy = randomThrowAngle;
    }
  }
};

module.exports = ServerBall;
