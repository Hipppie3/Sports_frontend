import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Games.css'; // Make sure your Games.css is correctly imported
import axios from 'axios';

function Games() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/games`);
        setGames(response.data);
        const sortedGames = response.data.sort((a, b) => new Date(a.game_date) - new Date(b.game_date));

        setGames(sortedGames);
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    fetchGames();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US');
  };

  return (
    <div className="gameContainer">
      <h1>Games</h1>
      <ul className="games-list">
        {games.map((game) => (
          <li key={game.id}>
            <Link to={`/game/${game.id}`}>
              <div>
                <span className="game-date">{formatDate(game.game_date)}</span>
                <span>{game.home_team_name} {game.home_team_points} VS {game.away_team_name} {game.away_team_points}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Games;
