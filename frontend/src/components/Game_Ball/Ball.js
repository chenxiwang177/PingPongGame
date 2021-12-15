function Ball(x, y, dx, dy, size, isPlayerOne, canvas, ctx) {
  this.x = x;
  this.y = y;
  this.dx = isPlayerOne ? dx : -dx;
  this.dy = dy;
  this.size = size;
  this.canvas = canvas;
  this.ctx = ctx;
  this.isPlayerOne = isPlayerOne;
}

Ball.prototype = {
  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.size / 2, 0, 2 * Math.PI);
    this.ctx.fillStyle = "#ffffff";
    this.ctx.fill();
  },

  sync(x, y, dx, dy) {
    this.y = y;
    this.x = this.isPlayerOne ? x : this.canvas.width - (x + 30);
    this.dx = this.isPlayerOne ? dx : -dx;
    this.dy = dy;
    this.draw();
  },
};

export default Ball;
