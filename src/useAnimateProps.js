import React, { useState, useEffect } from 'react';
import { Easing } from 'tweenkle';

import createTween from './createTween';

const defaultOptions = {
  delay: 0,
  duration: 1000,
  ease: Easing.Quad.Out,
  onAnimateProgress: value => value,
  onAnimateComplete: value => value,
};

const useAnimateProps = (prop, options) => {
  let tween;
  const [propValue, setPropValue] = useState(prop);
  const ops = Object.assign({}, defaultOptions, options);

  const {
    delay,
    duration,
    ease,
  } = ops;

  useEffect(
    () => {
      if (tween) {
        tween.stop();
      }

      if (propValue !== prop) {
        tween = createTween({
          prop: null,
          value: propValue,
          target: prop,
          tweenProps: {
            delay,
            duration,
            ease,
          },
        }, (animateProp, { value }) => {
          setPropValue(ops.onAnimateProgress(value));
        }, (animateProp, { value }) => {
          setPropValue(ops.onAnimateComplete(value));
        });
      }

      return () => {
        if (tween) {
          tween.stop();
        }
      };
    },
    [prop],
  );

  return propValue;
};

export default useAnimateProps;
