import React from 'react';
import './header.css';

function Header() {
  return (
    <div className="header">
      <h1>D-Sound</h1>
      <input type="text" placeholder="Search" className="header__search" />
      <img src="user_avatar_url" alt="user" className="header__avatar" />
    </div>
  );
}

export default Header;
