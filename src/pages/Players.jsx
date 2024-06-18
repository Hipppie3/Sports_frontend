// src/pages/Players.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Players.css';

const Players = () => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/players');
      setPlayers(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  return (
    <div>
      <h1>Players Page</h1>
      <ul className="players-list">
        {players.map((player) => (
          <li key={player.id} className="player-item">
            <p>{player.id} {player.first_name} {player.last_name}</p>
            <p>{player.position}</p>
            <p>{player.sport}</p>
            {player.image && <img src={`data:image/jpeg;base64,${player.image}`} alt="Player" className="player-image" />}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Players;
