import React, { Component } from 'react';
import styled from 'styled-components';
import { ReactComponent as ArrowUp } from '../../images/arrowUp.svg';
import { ReactComponent as ArrowDown } from '../../images/arrowDown.svg';

const ArrowsWrapper = styled.div`
  position: absolute;
  bottom: 6vh;
  right: 4vw;
  display: flex;
  flex-direction: column;

  > svg {
    margin: 0;
    cursor: pointer;
  }

  @media (min-width: 1024px) {
    display: none;
  }
`;

class ControlsArrows extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dir: ''
    };
  }

  onPress = dir => {
    this.setState({ dir });
    requestAnimationFrame(this.handleTouch.bind(this));
  };

  handleTouch = () => {
    const { handlePlayerMove } = this.props;
    const { dir } = this.state;
    handlePlayerMove(dir);
    this.frameId = window.requestAnimationFrame(this.handleTouch.bind(this));
  };

  onRelease = () => {
    const { handlePlayerMove } = this.props;
    this.setState({ dir: '' });
    handlePlayerMove('');
    window.cancelAnimationFrame(this.frameId);
  };

  render() {
    return (
      <ArrowsWrapper>
        <ArrowUp
          width="60px"
          height="60px"
          onTouchStart={() => this.onPress('ArrowUp')}
          onTouchEnd={() => this.onRelease()}
        />
        <ArrowDown
          width="60px"
          height="60px"
          onTouchStart={() => this.onPress('ArrowDown')}
          onTouchEnd={() => this.onRelease()}
        />
      </ArrowsWrapper>
    );
  }
}

export default ControlsArrows;
