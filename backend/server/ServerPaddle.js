function ServerPaddle(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.dx = 0;
  this.dy = 4;
  this.width = 16;
  this.height = 50;
  this.canvas = {
    width: w,
    height: h
  };
  this.defaultVelocity = 4;
  this.prevMove = '';
  this.score = 0;
}

ServerPaddle.prototype = {
  update(pressedKey) {
    let moveY = Math.abs(this.dy);
    if (pressedKey === this.prevMove) {
      moveY = moveY >= 3 * this.defaultVelocity ? 3 * this.defaultVelocity : moveY * 1.05;
    }
    this.prevMove = pressedKey;
    switch (pressedKey) {
      case 'ArrowDown':
        this.move(0, moveY);
        break;
      case 'ArrowUp':
        this.move(0, -moveY);
        break;
      case 'KnobDown':
        this.move(0, moveY);
        break;
      case 'KnobUp':
        this.move(0, -moveY);
        break;
      default:
        this.dy = this.defaultVelocity;
    }
  },

  updateScore() {
    this.score += 1;
  },

  move(moveX, moveY) {
    this.x += moveX;
    this.y += moveY;
    this.dx = moveX;
    this.dy = moveY;

    if (this.y < 0) {
      this.y = 0;
      this.dy = 0;
    } else if (this.y + this.height > this.canvas.height) {
      this.y = this.canvas.height - this.height;
      this.dy = 0;
    }
  }
};

module.exports = ServerPaddle;
