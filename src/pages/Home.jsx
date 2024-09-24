import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    // Fetch teams from the backend
    const fetchTeams = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/teams`);
        setTeams(response.data);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchTeams();
  }, []);

  // Calculate win percentage (Pct)
  const calculatePct = (wins, losses) => {
    const totalGames = wins + losses;
    return totalGames === 0 ? 0 : (wins / totalGames).toFixed(3); // Return Pct as a 3-decimal value
  };

  return (
    <div className="home-container">
      <h1>Basketball Tuesday League</h1>
      <table className="teams-table">
        <thead>
          <tr>
            <th>Team Name</th>
            <th>W</th>
            <th>L</th>
            <th>Pct</th>
          </tr>
        </thead>
        <tbody>
          {teams.slice(0, 6).map((team) => (
            <tr key={team.id}>
              <td>{team.name}</td>
              <td>{team.wins}</td> {/* Assuming wins are provided in the backend response */}
              <td>{team.losses}</td> {/* Assuming losses are provided in the backend response */}
              <td>{calculatePct(team.wins, team.losses)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
