import React, { Component } from 'react';
import getDisplayName from 'react-display-name';
import omit from 'lomit';

import createTween from './createTween';

const animateProps = (AnimatedComponent, defaultProps = {}) => {
  class AnimateProps extends Component {
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

      this.onTweenProgress = this.onTweenProgress.bind(this);
      this.onTweenComplete = this.onTweenComplete.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
      const props = Object.assign({}, defaultProps, this.props);

      if (!props.hasOwnProperty('animatedProps')) {
        return;
      }

      Object.keys(props.animatedProps).forEach(key => {
        if (this.props[key] !== prevProps[key] && this.props[key] !== this.state[key]) {
          this.tweenProp({
            prop: key,
            value: this.state[key],
            target: this.props[key],
            tweenProps: props.animatedProps.hasOwnProperty(key)
              ? props.animatedProps[key]
              : {},
          });
        }
      });
    }

    componentWillUnmount() {
      if (this.tweens && this.tweens.length) {
        Object.keys(this.tweens).forEach((key) => {
          this.tweens[key].stop();
        });
      }
    }

    onTweenProgress(prop, { value }) {
      const props = Object.assign({}, defaultProps, this.props);

      const {
        onAnimateProgress,
      } = props;

      if (onAnimateProgress) {
        this.setState(onAnimateProgress(prop, value));
        return;
      }

      this.setState({
        [prop]: value,
      });
    }

    onTweenComplete(prop, { value }) {
      const props = Object.assign({}, defaultProps, this.props);

      const {
        onAnimateComplete,
      } = props;

      let tweensActive = false;

      Object.keys(this.tweens).forEach((key) => {
        if (this.tweens[key].active) {
          tweensActive = true;
        }
      });

      if (onAnimateComplete) {
        onAnimateComplete(prop, value, tweensActive);
      }
    }

    tweenProp({prop, value, target, tweenProps}) {
      const tween = createTween(
        { prop, value, target, tweenProps },
        this.onTweenProgress,
        this.onTweenComplete
      );

      return this.tweens[prop] = tween;
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

  AnimateProps.displayName = `AnimateProps(${getDisplayName(AnimatedComponent)})`;

  return AnimateProps;
}

export default animateProps;
