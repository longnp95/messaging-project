import React, { useState } from 'react';
import './App.css';
import Cookies from 'universal-cookie';
import Auth from './components/Auth'

const cookie = new Cookies();
const authToken = cookie.get('token');

function App() {

  if(true||!authToken) return <Auth />


/*   return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
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
  ); */
}

export default App;
