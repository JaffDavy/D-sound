import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './header.css';

function Header() {
  const [user, setUser] = useState(null); // State to store user data

  // Fetch the logged-in user's data from the server
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/user');
        console.log('User data fetched:', response.data); // Log the user data
        setUser(response.data); // Assuming response data has the user object
      } catch (error) {
        console.error('Error fetching user data', error);
      }
    };

    fetchUserData();
  }, []);

  const [selectedTrack, setSelectedTrack] = useState(null);

  // Handle track selection from results (if needed)
  const handleTrackSelect = (track) => {
    setSelectedTrack(track);
  };

  // Handle audio player ended event
  const handleSongEnd = () => {
    setSelectedTrack(null); // Clear the selected track once the song finishes
  };

  return (
    <div className="header">
      <div className="header__user">
        {/* Display logged-in user's name */}
        {user ? (
          <p>Welcome, {user.name}!</p> // Ensure "name" exists in the user object
        ) : (
          <p>Welcome, Guest!</p>
        )}
      </div>

      {selectedTrack && (
        <div className="selected__track">
          <h3>Selected Song</h3>
          <p>{selectedTrack.name} by {selectedTrack.artists[0].name}</p>
          <img
            src={selectedTrack.album.images[0].url}
            alt={selectedTrack.name}
            style={{ width: '100px' }}
          />
          <audio
            controls
            src={selectedTrack.preview_url}
            onEnded={handleSongEnd}
          >
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
}

export default Header;
