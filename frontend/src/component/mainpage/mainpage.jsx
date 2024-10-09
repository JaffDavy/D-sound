import React from 'react';
import Sidebar from './sidebar/sidebar';
import Header from './header/header';
import Main from './main/main';
import Footer from './footer/footer';
import './mainpage.css';

function Mainpage() {
  return (
    <div className="app">
      <Header />
      <div className="app__body">
        <Sidebar />
        <Main />
      </div>
      <Footer />
    </div>
  );
}

export default Mainpage;
