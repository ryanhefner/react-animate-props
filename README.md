# react-animate-props

React HOC (higher order component) method for transforming your favorite components
to animate prop values on change.

## Install

Via [npm](https://npmjs.com/package/react-animate-props)

```sh
npm install --save react-animate-props
```

Via [Yarn](https://yarn.fyi/react-animate-props)

```sh
yarn add react-animate-props
```

## How to use

`animateProps` is a [higher order component](https://facebook.github.io/react/docs/higher-order-components.html)
that allows you to easily create components who’s props animate when changed.

Whether you’re writing a new component, or would like to make an animated version
of an existing component, just export your component and pass it through, `animateProps`.

### Parameters

* `component:Class` - Class to apply `animateProps` logic to.

* `defaultProps:Object` - Default props declared for the component being animated. (Default: `{}`)

### Properties

* `animatedProps:Object` - Object defining which props to animate, and the tween
settings for each. `animateProps` uses the [Tweenkle](https://github.com/ryanhefner/tweenkle)
tweening library, specifically a `Tween` instance, and you can pass whatever props that
library supports via the tween settings. You can find out more by reading the
[Tweenkle README](https://github.com/ryanhefner/tweenkle).

* `onAnimateProgress:Function` - Callback available to manipulate the `prop` before
it is applied to the state. (Example: `(prop, value) => { return { [prop]: value }; }`)

* `onAnimateComplete:Function` - Callback fired when the animation for a `prop` completes.
(Example: `(prop, value, tweensActive) => {}`)

### Example

```js
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import animateProps from 'react-animate-props';
import {Easing} from 'tweenkle';

class AnimatedNumberLabel extends Component {
  render() {
    const {
      number,
    } = this.props;

    return (
      <span>
        {number}
      </span>
    );
  }
}

AnimatedNumberLabel.propTypes = {
  animatedProps: PropTypes.object,
  number: PropTypes.number,
  onAnimateProgress: PropTypes.func,
};

AnimatedNumberLabel.defaultProps = {
  animatedProps: {
    number: {
      ease: Easing.Quad.In,
      delay: 500,
      duration: 1500,
    },
  },
  number: 0,
  onAnimateProgress: (prop, value) => {
    return {
      [prop]: Math.round(value),
    };
  },
  onAnimateComplete: (prop, value, tweensActive) => {

  },
};

export default animateProps(AnimatedNumberLabel, AnimatedNumberLabel.defaultProps);
```

## License

[MIT](LICENSE) © [Ryan Hefner](https://www.ryanhefner.com)
