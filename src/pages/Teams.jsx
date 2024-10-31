import React, { useEffect, useState } from 'react';
import './Teams.css'; // Make sure your Teams.css is correctly imported
import axios from 'axios';
import { Link } from 'react-router-dom';

const Teams = () => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/teams`);
        setTeams(response.data); // Set teams data from the response
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchTeams(); // Fetch teams on component mount
  }, []);

  return (
    <div className="team-container">
      <h1>Teams</h1>
      <ul className="team-list">
        {teams.map((team) => (
          <li key={team.id} className="team-item">
            <Link to={`/teams/${team.id}`}>
              {team.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Teams;
