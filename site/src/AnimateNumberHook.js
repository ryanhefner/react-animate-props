import React from 'react';
import { useAnimateProps } from 'react-animate-props';
import { Easing } from 'tweenkle';

const AnimateNumberHook = ({ value, onAnimateComplete }) => {
  const animatedValue = useAnimateProps(value, {
    delay: 500,
    duration: 2000,
    ease: Easing.Quad.InOut,
    onAnimateProgress: value => {
      return Math.round(value);
    },
    onAnimateComplete: value => {
      const newValue = Math.round(value);
      return newValue;
    },
  });
  const altAnimatedValue = useAnimateProps(value, {
    delay: 0,
    duration: 5000,
    ease: Easing.Quad.In,
    onAnimateProgress: value => {
      return Math.round(value);
    },
    onAnimateComplete: value => {
      const newValue = Math.round(value);

      onAnimateComplete(newValue);

      return Math.round(newValue);
    },
  })

  return (
    <React.Fragment>
      <h2>{animatedValue.toLocaleString('en-US', { useGrouping: true })}</h2>
      <h2>{altAnimatedValue.toLocaleString('en-US', { useGrouping: true })}</h2>
    </React.Fragment>
  );
};

export default AnimateNumberHook;
