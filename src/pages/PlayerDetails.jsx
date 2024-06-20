import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import defaultImage from '../images/defaultImage.png';


const PlayerDetails = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    fetchPlayer();
    fetchPlayerStats();
  }, []);

  const fetchPlayer = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/players/${id}`);
      setPlayer(response.data);
    } catch (error) {
      console.error('Error fetching player:', error);
    }
  };

  const fetchPlayerStats = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/stats/${id}`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  if (!player) {
    return <p>Loading...</p>;
  }

  return (
    <div className="player-details">
      <img 
        src={player.image ? `data:image/jpeg;base64,${player.image}` : defaultImage} 
        alt="Player" 
        className="player-image" 
      />
      <h2>{player.first_name} {player.last_name}</h2>
      <p>Position: {player.position}</p>
      <p>Sport: {player.sport}</p>

      <h3>Basketball Stats</h3>
      {stats.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>PTS</th>
              <th>FGM</th>
              <th>FGA</th>
              <th>FG%</th>
              <th>2PM</th>
              <th>2PA</th>
              <th>2P%</th>
              <th>3PM</th>
              <th>3PA</th>
              <th>3P%</th>
              <th>FTM</th>
              <th>FTA</th>
              <th>FT%</th>
              <th>OREB</th>
              <th>DREB</th>
              <th>REB</th>
              <th>AST</th>
              <th>STL</th>
              <th>BLK</th>
              <th>TOV</th>
            </tr>
          </thead>
          <tbody>
            {stats.map(stat => (
              <tr key={stat.id}>
                <td>{new Date(stat.game_date).toLocaleDateString()}</td>
                <td>{stat.pts}</td>
                <td>{stat.fgm}</td>
                <td>{stat.fga}</td>
                <td>{stat.fg_percentage.toFixed(2)}</td>
                <td>{stat.two_pm}</td>
                <td>{stat.two_pa}</td>
                <td>{stat.two_p_percentage.toFixed(2)}</td>
                <td>{stat.three_pm}</td>
                <td>{stat.three_pa}</td>
                <td>{stat.three_p_percentage.toFixed(2)}</td>
                <td>{stat.ftm}</td>
                <td>{stat.fta}</td>
                <td>{stat.ft_percentage.toFixed(2)}</td>
                <td>{stat.oreb}</td>
                <td>{stat.dreb}</td>
                <td>{stat.reb}</td>
                <td>{stat.ast}</td>
                <td>{stat.stl}</td>
                <td>{stat.blk}</td>
                <td>{stat.tov}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No stats available for this player.</p>
      )}
    </div>
  );
};

export default PlayerDetails;
