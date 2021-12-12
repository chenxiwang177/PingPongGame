function Score(x, y, ctx) {
  this.x = x;
  this.y = y;
  this.score = 0;
  this.ctx = ctx;
}

Score.prototype = {
  draw() {
    this.ctx.font = '95px pong-score';
    this.ctx.fillStyle = '#FEFEFE';
    this.ctx.shadowBlur = 10;
    this.ctx.shadowColor = '#FFFFFF';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(this.score, this.x, this.y);
  },
  sync(score) {
    this.score = score;
    this.draw();
  }
};

export default Score;
