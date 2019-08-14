import React, { Component } from 'react';
import animateProps from 'react-animate-props';
import { Easing } from 'tweenkle';

class AnimateNumber extends Component {
  render() {
    const {
      value,
    } = this.props;

    return (
      <h2>{value.toLocaleString('en-US', { useGrouping: true })}</h2>
    );
  }
}

export default animateProps(AnimateNumber, {
  animatedProps: {
    value: {
      duration: 2000,
      delay: 500,
      ease: Easing.Quad.InOut,
    },
  },
  value: 0,
  onAnimateProgress: (prop, value) => {
    return {
      [prop]: Math.round(value),
    };
  },
});
