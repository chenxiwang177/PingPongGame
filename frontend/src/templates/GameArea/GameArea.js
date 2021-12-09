import React, { Component } from 'react';
import styled from 'styled-components';
import kd from 'keydrown';
import Ball from '../../components/Game_Ball/Ball';
import Paddle from '../../components/Game_Paddle/Paddle';
import Score from '../../components/Game_Score/Score';
import GameInterface from '../../components/Game_Interface/GameInterface';
import ControlsArrows from '../../components/Controls_Arrows/ControlsArrows';
import ControlsKnob from '../../components/Controls_Knob/ControlsKnob';
import { ReactComponent as Frame } from '../../images/pong-frame.svg';
import ScoreAudio from '../../audio/score.mp3';
import BorderAudio from '../../audio/border.mp3';
import PaddleAudio from '../../audio/paddle.mp3';

const GameContainer = styled.div`
  position: relative;
  z-index: 5;
  max-width: 80vw;
  height: 63%;
  perspective: 1200px;

  animation: showContainer 150ms ease-out;

  @keyframes showContainer {
    0% {
      opacity: 0.8;
      transform: scale(0.95);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  > canvas {
    height: 100%;
    transform: rotateX(15deg);
  }
`;

const GameFrame = styled(Frame)`
  height: 136%;
  z-index: -1;
  position: absolute;
  top: -11%;
  left: 50%;
  transform: translateX(-50%);
`;

class GameArea extends Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    this.borderSound = React.createRef();
    this.paddleSound = React.createRef();
    this.scoreSound = React.createRef();
    this.state = {
      soundOn: true
    };
  };

  componentDidMount() {
    const { pong } = this.props;
    const canvas = this.canvas.current;
    const ctx = canvas.getContext('2d');
    this.ctx = ctx;
    this.drawBoard(ctx);
    this.createGameElements();
    kd.run(() => kd.tick());
    kd.UP.down(e => this.handlePlayerMoveByKeyboard(e));
    kd.UP.up(() => this.handlePlayerMoveByKeyboard(''));
    kd.DOWN.down(e => this.handlePlayerMoveByKeyboard(e));
    kd.DOWN.up(() => this.handlePlayerMoveByKeyboard(''));
    pong.on('syncMoves', data => this.syncGameElements(data));
    pong.on('addAudio', type => this.addAudioEffect(type));
  };

  componentWillUnmount() {
    kd.UP.unbindDown();
    kd.UP.unbindUp();
    kd.DOWN.unbindDown();
    kd.DOWN.unbindUp();
    kd.stop();
  }

  toggleAudio = isOn => {
    this.setState({ soundOn: isOn });
  };

  addAudioEffect = type => {
    if (
      this.paddleSound.current === null ||
      this.paddleSound.current === null ||
      this.paddleSound.current === null
    )
      return;
    switch (type) {
      case 'border':
        this.borderSound.current.play();
        break;
      case 'score':
        this.scoreSound.current.play();
        break;
      case 'paddle':
        this.paddleSound.current.play();
        break;
      default: // do nothing
    }
  };

  createGameElements = () => {
    const { pong, roomId } = this.props;
    const { width, height } = this.canvas.current;
    pong.emit('createGameElements', { w: width, h: height, roomName: roomId });
    pong.on('gameElementsCreated', data => this.getGameElements(data));
    this.loop();
  };

  getGameElements = ({ ball }) => {
    const { x, y, dx, dy, size, canvas } = ball;
    const { width, height } = canvas;
    const { isPlayerOne } = this.props;
    this.clientScore = new Score(width / 6, height / 5, this.ctx);
    this.enemyScore = new Score(width - width / 6, height / 5, this.ctx);
    this.ball = new Ball(x, y, dx, dy, size, isPlayerOne, canvas, this.ctx);
    this.clientPaddle = new Paddle(30, height / 2, width, height, this.ctx);
    this.enemyPaddle = new Paddle(
      width - 50,
      height / 2,
      width,
      height,
      this.ctx
    );
  };

  drawBoard = () => {
    const { ctx, canvas } = this;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.current.width, canvas.current.height);
    // line in the middle (net)
    ctx.beginPath();
    ctx.moveTo(canvas.current.width / 2, 0);
    ctx.lineTo(canvas.current.width / 2, canvas.current.height);
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 5]);
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#FFFFFF';
    ctx.strokeStyle = '#FEFEFE';
    ctx.stroke();
  };

  loop = () => {
    const { roomId, pong } = this.props;
    if (this.canvas.current === null) return;
    if (this.ball !== undefined &&
      this.clientPaddle !== undefined &&
      this.enemyPaddle !== undefined) {
        this.drawBoard();
        this.clientScore.draw();
        this.enemyScore.draw();
        this.ball.draw();
        this.clientPaddle.draw();
        this.enemyPaddle.draw();
        pong.emit('requestSync', roomId);
    };
    requestAnimationFrame(this.loop.bind(this));
  };

  leaveGame = () => {
    const { leaveGame } = this.props;
    cancelAnimationFrame(this.loop.bind(this));
    leaveGame();
  };

  syncGameElements = elements => {
    if (elements === null) return;
    const { ball, playerOnePaddle, playerTwoPaddle } = elements;
    const { isPlayerOne } = this.props;
    if (isPlayerOne) {
      this.clientPaddle.sync(
        playerOnePaddle.y,
        playerOnePaddle.dx,
        playerOnePaddle.dy
      );
      this.enemyPaddle.sync(
        playerTwoPaddle.y,
        playerTwoPaddle.dx,
        playerTwoPaddle.dy
      );
      this.clientScore.sync(playerOnePaddle.score);
      this.enemyScore.sync(playerTwoPaddle.score);
    } else {
      this.clientPaddle.sync(
        playerTwoPaddle.y,
        playerTwoPaddle.dx,
        playerTwoPaddle.dy
      );
      this.enemyPaddle.sync(
        playerOnePaddle.y,
        playerOnePaddle.dx,
        playerOnePaddle.dy
      );
      this.clientScore.sync(playerTwoPaddle.score);
      this.enemyScore.sync(playerOnePaddle.score);
    }
    this.ball.sync(ball.x, ball.y, ball.dx, ball.dy);
  };

  handlePlayerMoveByKeyboard = e => {
    const { pong } = this.props;
    const key = e === '' ? '' : e.key;
    pong.emit('clientMove', key);
  };

  handlePlayerMoveByTouch = move => {
    const { pong } = this.props;
    pong.emit('clientMove', move);
  };

  render() {
    const { soundOn } = this.state;
    const { controls } = this.props;
    return (
      <>
        <GameContainer id="gameContainer">
          <canvas ref={this.canvas} width={800} height={600} />
          <GameFrame />
        </GameContainer>
        <GameInterface
          leaveGame={() => this.leaveGame()}
          audioOn={soundOn}
          toggleAudio={isOn => this.toggleAudio(isOn)}
        />
        <audio
          src={ScoreAudio}
          muted={!soundOn}
          type="audio/mpeg"
          ref={this.scoreSound}
        />
        <audio
          src={BorderAudio}
          muted={!soundOn}
          type="audio/mpeg"
          ref={this.borderSound}
        />
        <audio
          src={PaddleAudio}
          muted={!soundOn}
          type="audio/mpeg"
          ref={this.paddleSound}
        />
        {controls === 'arrows' ? (
          <ControlsArrows
            handlePlayerMove={move => this.handlePlayerMoveByTouch(move)}
          />
        ) : (
          <ControlsKnob 
            handlePlayerMove={move => this.handlePlayerMoveByTouch(move)}
          />
        )}
      </>
    );
  }
}

export default GameArea;
