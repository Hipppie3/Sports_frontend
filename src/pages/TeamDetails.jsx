import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './TeamDetails.css';

const TeamDetails = () => {
  const { id } = useParams();
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetchTeamDetails();
  }, [id]);

  const fetchTeamDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/players/team/${id}`);
      setPlayers(response.data);
    } catch (error) {
      console.error('Error fetching team details:', error);
    }
  };

  return (
    <div className="team-details-container">
      <h2>Team Players</h2>
      <ul className="player-list">
        {players.map(player => (
          <li key={player.id}>
            <Link to={`/player/${player.id}`}>
              <p>{player.first_name} {player.last_name}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamDetails;
