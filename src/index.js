import React, {Component} from 'react';
import Tween from 'tweenkle';
import { Easing } from 'tweenkle';
import omit from 'lomit';

const animateProps = (AnimatedComponent, defaultProps = {}) => {
  return class extends Component {
    constructor(props) {
      super(props);

      this.state = {};
      this.tweens = {};

      props = Object.assign({}, defaultProps, props);

      if (props.hasOwnProperty('animatedProps') && typeof props.animatedProps === 'object') {
        Object.keys(props.animatedProps).forEach((key) => {
          if (props.hasOwnProperty(key)) {
            this.state[key] = props[key];
          }
        });
      }
    }

    componentWillReceiveProps(nextProps) {
      nextProps = Object.assign({}, defaultProps, nextProps);

      if (!nextProps.hasOwnProperty('animatedProps')) {
        return;
      }

      Object.keys(nextProps.animatedProps).forEach((key) => {
        if (nextProps[key] !== this.state[key]) {
          this.tweenProp({
            prop: key,
            value: this.state[key],
            target: nextProps[key],
            tweenProps: nextProps.animatedProps.hasOwnProperty(key)
              ? nextProps.animatedProps[key]
              : {},
          });
        }
      });
    }

    tweenProp({prop, value, target, tweenProps}) {
      const props = Object.assign({}, defaultProps, this.props);
      const vars = Object.assign({}, {
        duration: 1,
        ease: Easing.Quad.Out,
      }, tweenProps);

      const tween = new Tween({
        ...vars,
        start: value,
        end: target,
      });

      tween.on('tick', ({value}) => {
        if (props.onAnimateProgress) {
          this.setState(props.onAnimateProgress(prop, value));
          return;
        }

        this.setState({
          [prop]: value,
        });
      });

      tween.on('complete', ({value}) => {
        if (props.onAnimateComplete) {
          let tweensActive = false;

          Object.keys(this.tweens).forEach((key) => {
            if (this.tweens[key].active) {
              tweensActive = true;
            }
          });

          props.onAnimateComplete(prop, value, tweensActive);
        }
      });

      tween.start();

      return this.tweens[prop] = tween;
    }

    componentWillUnmount() {
      if (this.tweens && this.tweens.length) {
        Object.keys(this.tweens).forEach((key) => {
          this.tweens[key].stop();
        });
      }
    }

    render() {
      const props = Object.assign({}, defaultProps, this.props);
      const animatedPropsKeys = props.animatedProps
        ? Object.keys(props.animatedProps)
        : [];
      const cleanProps = omit(this.props, animatedPropsKeys);

      return (
        <AnimatedComponent {...cleanProps} {...this.state} />
      );
    }
  }
}

export default animateProps;
