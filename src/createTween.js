import Tween, { Easing } from 'tweenkle';

function createTween({
    prop,
    value,
    target,
    tweenProps,
  },
  onProgress = (prop, state) => {},
  onComplete = (prop, state) => {},
) {
  const vars = Object.assign({}, {
    duration: 1000,
    ease: Easing.Quad.Out,
  }, tweenProps);

  const tween = new Tween({
    ...vars,
    start: value,
    end: target,
  });

  tween.on('tick', state => {
    onProgress(prop, state);
  });

  tween.on('complete', state => {
    onComplete(prop, state);
  });

  tween.start();

  return tween;
}

export default createTween;
