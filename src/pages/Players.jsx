import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Players.css';
import searchImage from '../images/search.png';
import defaultImage from '../images/defaultImage.png';

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredPlayers, setFilteredPlayers] = useState([]);

  useEffect(() => {
    fetchPlayers();
  }, []);

  useEffect(() => {
    if (search) {
      const results = players.filter(player =>
        player.first_name.toLowerCase().startsWith(search.toLowerCase()) ||
        player.last_name.toLowerCase().startsWith(search.toLowerCase())
      );
      setFilteredPlayers(results);
    } else {
      setFilteredPlayers([]);
    }
  }, [search, players]);

  const fetchPlayers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/players');
      const sortedPlayers = response.data.sort((a, b) => a.first_name.localeCompare(b.first_name));
      setPlayers(sortedPlayers);
      console.log(sortedPlayers);
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  return (
    <div className="players-page">
      <h1>PLAYERS</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by first or last name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-bar"
        />
        <img src={searchImage} alt="Search Icon" className="search-icon" />
      </div>
      <ul className="players-list">
        {filteredPlayers.length > 0 ? (
          filteredPlayers.map((player) => (
            <li key={player.id} className="player-item">
              <Link to={`/player/${player.id}`} className="player-link">
                <img 
                  src={player.image ? `data:image/jpeg;base64,${player.image}` : defaultImage} 
                  alt="Player" 
                  className="player-image" 
                />
                <p className="player-name">{player.first_name} {player.last_name}</p>
                <p className="player-sport">{player.sport}</p>
              </Link>
            </li>
          ))
        ) : (
          players.map((player) => (
            <li key={player.id} className="player-item">
              <Link to={`/player/${player.id}`} className="player-link">
                <img 
                  src={player.image ? `data:image/jpeg;base64,${player.image}` : defaultImage} 
                  alt="Player" 
                  className="player-image" 
                />
                <p className="player-name">{player.first_name} {player.last_name}</p>
                <p className="player-sport">{player.sport}</p>
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Players;
