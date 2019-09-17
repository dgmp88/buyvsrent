import React from 'react';
import logo from './logo.svg';
import './App.css';
import UserInputs from './components/UserInputs';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Buy vs Rent

        </p>

      </header>

      <main>
        <UserInputs />
      </main>
    </div>
  );
}

export default App;
