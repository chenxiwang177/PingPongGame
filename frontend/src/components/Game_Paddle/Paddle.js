function Paddle(x, y, w, h, ctx) {
  this.x = x;
  this.y = y;
  this.dx = 0;
  this.dy = 4;
  this.width = 16;
  this.height = 50;
  this.ctx = ctx;
  this.canvas = {
    canvWidth: w,
    canvHeight: h
  };
}

Paddle.prototype = {
  draw() {
    this.ctx.beginPath();
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
    this.ctx.fillStyle = '#FEFEFE';
    this.ctx.shadowBlur = 15;
    this.ctx.shadowColor = '#FFFFFF';
    this.ctx.fill();
  },

  sync(y, dx, dy) {
    // linear interpolation for paddle move
    const prevPos = this.y;
    const newPos = y;
    this.y += (newPos - prevPos) * 0.1;
    this.dx = dx;
    this.dy = dy;
    this.draw();
  }
};

export default Paddle;
