import React, {Component} from 'react';
import TweenMax from 'gsap';
import omit from 'lodash.omit';

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
        ease: Quad.easeOut,
      }, tweenProps);

      const tweenProp = {[prop]: value};
      const tween = TweenLite.to(tweenProp, vars.duration, {
        [prop]: target,
        ...omit(vars, ['duration']),
        onUpdate: () => {
          if (props.onAnimateProgress) {
            this.setState(props.onAnimateProgress(prop, tweenProp[prop]));
            return;
          }

          this.setState({
            [prop]: tweenProp[prop],
          });
        },
        onComplete: () => {
          if (props.onAnimateComplete) {
            let tweensActive = false;

            Object.keys(this.tweens).forEach((key) => {
              if (this.tweens[key].isActive()) {
                tweensActive = true;
              }
            });

            props.onAnimateComplete(prop, tweenProp[prop], tweensActive);
          }
        },
      });

      return this.tweens[prop] = tween;
    }

    componentWillUnmount() {
      if (this.tweens && this.tweens.length) {
        Object.keys(this.tweens).forEach((key) => {
          this.tweens[key].kill();
        });
      }
    }

    render() {
      const {
        children,
      } = this.props;

      const props = Object.assign({}, defaultProps, this.props);
      const animatedProps = props.animatedProps
        ? Object.keys(props.animatedProps)
        : [];
      const cleanProps = omit(this.props, animatedProps);

      return (
        <AnimatedComponent {...cleanProps} {...this.state} />
      );
    }
  }
}

export default animateProps;
