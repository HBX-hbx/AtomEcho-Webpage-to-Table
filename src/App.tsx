/*global chrome*/
import React, {useState} from 'react';
import Header from './components/Header';
import Body from './components/Body';
import Footer from "./components/Footer";
import "./App.css";
import logo from './AtomEcho.png';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

function App() {
  //
  const [collapse, setCollapse] = useState(true); // 初始关闭

  const toggleDrawer = () => {
    const mainPage: any = document.getElementById('extension_main_page');
    if (collapse) { // 若当前是关闭的，则要打开
      mainPage.classList.remove('extension_main_page_close');
      mainPage.classList.add('extension_main_page_open');
    } else {
      mainPage.classList.remove('extension_main_page_open');
      mainPage.classList.add('extension_main_page_close');
    }
    setCollapse(!collapse);
  }

  return (
    <div className="extension_app">
      <div>
        <IconButton aria-label="icon" color="primary" onClick={toggleDrawer}>
          {collapse ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </div>
      <div id="extension_main_page" className="extension_main_page_close">
        <Header />
        <Body />
        <Footer />
      </div>
    </div>
  );
}

export default App;
