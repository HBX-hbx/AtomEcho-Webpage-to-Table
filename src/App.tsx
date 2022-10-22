/*global chrome*/
import React from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import Body from './components/Body';
import Divider from '@mui/material/Divider';

function App() {
    return (
    <div className="App">
        <Header />
        <Divider />
        <Body />
    </div>
    );
}

export default App;
