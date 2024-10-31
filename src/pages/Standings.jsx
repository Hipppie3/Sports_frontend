import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Standings = () => {
  const [standings, setStandings] = useState([]);

  useEffect(() => {
    fetchStandings();
  }, []);

  const fetchStandings = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/standings`);
      setStandings(response.data);
    } catch (error) {
      console.error('Error fetching standings:', error);
    }
  };

  return (
    <div>
      <h2>Standings</h2>
      <table>
        <thead>
          <tr>
            <th>Team</th>
            <th>Wins</th>
            <th>Losses</th>
            <th>Points For</th>
            <th>Points Against</th>
            <th>Winning Percentage</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((team) => (
            <tr key={team.team_id}>
              <td>
                <Link to={`/teams/${team.team_id}`}>{team.team_name}</Link> {/* Wrap team name in a Link */}
              </td>
              <td>{team.wins}</td>
              <td>{team.losses}</td>
              <td>{team.points_for}</td>
              <td>{team.points_against}</td>
              <td>{(team.pct * 100).toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Standings;
