import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './TeamDetails.css';
import defaultImage from '../images/defaultimage.png'; // Import the default image

const TeamDetails = () => {
  const { id } = useParams();
  const [players, setPlayers] = useState([]);
  const [team, setTeam] = useState(null);

  useEffect(() => {
    fetchTeamDetails();
    fetchPlayersByTeam();
  }, [id]);

  const fetchTeamDetails = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/teams/${id}`);
      setTeam(response.data);
    } catch (error) {
      console.error('Error fetching team details:', error);
    }
  };

  const fetchPlayersByTeam = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/players/team/${id}`);
      setPlayers(response.data);
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  if (!team) {
    return <p>Loading team details...</p>;
  }

  return (
    <div className="team-details-container">
      <h2 className="team_name">{team.name}</h2>
      <ul className="player-list">
        {players.map(player => (
          <li key={player.id}>
            <Link to={`/player/${player.id}`}>
              {/* Check if the player has an image, otherwise use the default image */}
              <img
                src={player.image ? `data:image/jpeg;base64,${player.image}` : defaultImage}
                alt={`${player.first_name} ${player.last_name}`}
              />
              <p>{player.first_name} {player.last_name}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamDetails;
