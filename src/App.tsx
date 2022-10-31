/*global chrome*/
import React from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import Body from './components/Body';
import Divider from '@mui/material/Divider';
import Footer from "./components/Footer";

function App() {
    return (
    <div className="App">
        <Header />
        <Body />
        <Footer />
    </div>
    );
}

export default App;
