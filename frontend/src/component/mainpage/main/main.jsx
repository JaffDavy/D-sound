import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import './main.css';

function Main() {
  const [songs, setSongs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const audioRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const navigate = useNavigate(); // For navigation

  // Function to check if user is logged in (check token, session, etc.)
  const checkUserLoggedIn = () => {
    const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  };

  // Function to get the Spotify token
  const getSpotifyToken = async () => {
    const client_id = '3c4bc76ff1a747adadf7de5de42ee6b8';
    const client_secret = 'f0671401a036488681b53991d0917adc';

    const authParams = new URLSearchParams();
    authParams.append('grant_type', 'client_credentials');

    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          Authorization: 'Basic ' + btoa(`${client_id}:${client_secret}`),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: authParams.toString(),
      });
      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Error fetching Spotify token:', error);
      setError('Failed to fetch Spotify token');
    }
  };

  // Function to fetch the default playlist
  const fetchSongs = async () => {
    const token = await getSpotifyToken();
    if (!token) return;

    try {
      const response = await fetch(
        'https://api.spotify.com/v1/playlists/37i9dQZF1DXcBWIGoYBM5M/tracks',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (data && data.items) {
        setSongs(data.items);
      } else {
        setError('No songs found');
      }
    } catch (error) {
      console.error('Error fetching songs:', error);
      setError('Failed to fetch songs');
    }
  };

  // Function to search for songs
  const searchSongs = async (query) => {
    const token = await getSpotifyToken();
    if (!token || query.trim() === '') return;

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${query}&type=track&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (data && data.tracks && data.tracks.items) {
        setSearchResults(data.tracks.items);
      } else {
        setError('No songs found');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      setError('Failed to fetch search results');
      setSearchResults([]);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchTerm(query);
    if (query.trim().length > 0) {
      searchSongs(query);
    } else {
      setSearchResults([]);
    }
  };

  // Function to play a song
  const playSong = (track, index) => {
    if (!isLoggedIn) {
      // Redirect to login page if not logged in
      navigate('/authen');
      return;
    }
    setCurrentTrack(track);
    setCurrentSongIndex(index);
    setIsPlaying(true);
    setSearchResults([]); // Clear search results after selecting a song
  };

  // Function to stop the song
  const stopSong = () => {
    setIsPlaying(false);
  };

  // Play the next song
  const playNext = () => {
    if (currentSongIndex < songs.length - 1) {
      playSong(songs[currentSongIndex + 1].track, currentSongIndex + 1);
    }
  };

  // Play the previous song
  const playPrevious = () => {
    if (currentSongIndex > 0) {
      playSong(songs[currentSongIndex - 1].track, currentSongIndex - 1);
    }
  };

  // Auto-play the next song when the current one ends
  const handleTrackEnd = () => {
    playNext();
  };

  // Control play/pause on audio element when `isPlaying` or `currentTrack` changes
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  // Fetch the default playlist on component mount
  useEffect(() => {
    fetchSongs();
    checkUserLoggedIn(); // Check if user is logged in on mount
  }, []);

  return (
    <div className="main">
      <h2>Discover Weekly</h2>

      {/* Search Field */}
      <input
        type="text"
        placeholder="Search for songs or artists"
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-input"
      />

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="search-results">
          {searchResults.map((track, index) => (
            <div
              key={track.id}
              className="search-result-item"
              onClick={() => playSong(track, index)}
            >
              <img
                src={track.album.images[0].url}
                alt={track.name}
                className="search-result-cover"
              />
              <div className="search-result-details">
                <p className="search-result-name">{track.name}</p>
                <p className="search-result-artist">{track.artists[0].name}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Songs (Discover Weekly) */}
      <div className="songs-container">
        {songs.length > 0 ? (
          songs.map((song, index) => (
            <div
              key={index}
              className="song-item"
              onClick={() => playSong(song.track, index)}
            >
              <img
                src={song.track.album.images[0].url}
                alt={song.track.name}
                className="album-cover"
              />
              <p>{song.track.name} by {song.track.artists[0].name}</p>
            </div>
          ))
        ) : (
          <p>Loading songs...</p>
        )}
      </div>

      {/* Bottom Player */}
      {currentTrack && (
        <div className="bottom-player">
          <div className="track-info">
            <img
              src={currentTrack.album.images[0].url}
              alt={currentTrack.name}
              className="track-cover"
            />
            <div>
              <p className="track-name">{currentTrack.name}</p>
              <p className="track-artist">{currentTrack.artists[0].name}</p>
            </div>
          </div>

          <div className="player-controls">
            <button className="player-btn" onClick={playPrevious}>
              &#9664; {/* Previous button */}
            </button>
            {isPlaying ? (
              <button className="player-btn" onClick={stopSong}>
                Pause
              </button>
            ) : (
              <button className="player-btn" onClick={() => playSong(currentTrack, currentSongIndex)}>
                Play
              </button>
            )}
            <button className="player-btn" onClick={playNext}>
              &#9654; {/* Next button */}
            </button>
          </div>

          {/* Audio Player */}
          <div className="audio-player">
            {currentTrack.preview_url ? (
              <audio
                ref={audioRef}
                src={currentTrack.preview_url}
                onEnded={handleTrackEnd}
                controls
                autoPlay
              />
            ) : (
              <p>No preview available for this track</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Main;
