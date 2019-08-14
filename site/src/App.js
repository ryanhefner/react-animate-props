import React, { Component } from 'react';

import AnimateNumberHook from './AnimateNumberHook';
import AnimateNumber from './AnimateNumber';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 0,
    };

    this.onAnimateComplete = this.onAnimateComplete.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        value: 3000,
      });
    }, 2000);
  }

  onAnimateComplete(value) {
    // if (value === 0) {
    //   this.setState({
    //     value: 3000,
    //   });
    // }
    // else {
    //   this.setState({
    //     value: 0,
    //   });
    // }
  }

  render() {
    const {
      value,
    } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <h1>react-animate-props</h1>
          <AnimateNumber value={value} />
          <AnimateNumberHook value={value} onAnimateComplete={this.onAnimateComplete} />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
