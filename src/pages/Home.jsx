import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    // Fetch teams from the backend
    const fetchTeams = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/teams`); // Update with your backend URL
        setTeams(response.data);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchTeams();
  }, []);

  return (
    <div className="home-container">
      <h1>Basketball Tuesday League</h1>
      <table className="teams-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Sport</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {teams.slice(0, 6).map((team) => (
            <tr key={team.id}>
              <td>{team.name}</td>
              <td>{team.sport}</td>
              <td>
                {team.image ? (
                  <img
                    src={`data:image/png;base64,${team.image}`}
                    alt={team.name}
                    className="team-image"
                  />
                ) : (
                  'No image'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
