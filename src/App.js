// src/App.js
import React from 'react';
import SignalGenerator from './SignalGenerator';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Signal Generator</h1>
        <SignalGenerator />
      </header>
    </div>
  );
};

export default App;
