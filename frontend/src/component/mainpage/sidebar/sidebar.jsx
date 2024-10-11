import React from 'react';
import './sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <h3>D-Sound</h3>
      <ul>
        <li>Home</li>
        <li>Search</li>
        <li>Your Library</li>
        <li>Playlists</li>
      </ul>
    </div>
  );
}

export default Sidebar;
