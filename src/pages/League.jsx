import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const League = () => {
  const [leagues, setLeagues] = useState([]);

  useEffect(() => {
    fetchLeagues();
  }, []);

  const fetchLeagues = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/leagues`);
      setLeagues(response.data);
    } catch (error) {
      console.error('Error fetching leagues:', error);
    }
  };

  return (
    <div>
      <h1>Leagues</h1>
      <ul>
        {leagues.map((league) => (
          <li key={league.id}>
            <Link to={`/league/${league.id}`}>
              {league.name} (From: {new Date(league.start_date).toLocaleDateString()} To: {new Date(league.end_date).toLocaleDateString()})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default League;
