import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './GameDetails.css';

const GameDetails = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [homeTeamStats, setHomeTeamStats] = useState([]);
  const [awayTeamStats, setAwayTeamStats] = useState([]);

  useEffect(() => {
    fetchGameDetails();
  }, [id]);

  const fetchGameDetails = async () => {
    try {
      const gameResponse = await axios.get(`http://localhost:3000/api/games/${id}`);
      setGame(gameResponse.data);

      const statsResponse = await axios.get(`http://localhost:3000/api/stats/game/${id}`);
      const stats = statsResponse.data;

      const homeTeam = stats.filter(stat => stat.team_id === gameResponse.data.home_team_id);
      const awayTeam = stats.filter(stat => stat.team_id === gameResponse.data.away_team_id);

      setHomeTeamStats(homeTeam);
      setAwayTeamStats(awayTeam);
    } catch (error) {
      console.error('Error fetching game details:', error);
    }
  };

  if (!game) {
    return <p>Loading...</p>;
  }

  const renderStatsTable = (stats) => (
    <table className="game-stats-table">
      <thead>
        <tr>
          <th>Player</th>
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
            <td>
              <Link to={`/player/${stat.player_id}`}>{stat.player_name}</Link></td>
            <td>{stat.pts}</td>
            <td>{stat.fgm}</td>
            <td>{stat.fga}</td>
            <td>{stat.fg_percentage.toFixed(1)}</td>
            <td>{stat.two_pm}</td>
            <td>{stat.two_pa}</td>
            <td>{stat.two_p_percentage.toFixed(1)}</td>
            <td>{stat.three_pm}</td>
            <td>{stat.three_pa}</td>
            <td>{stat.three_p_percentage.toFixed(1)}</td>
            <td>{stat.ftm}</td>
            <td>{stat.fta}</td>
            <td>{stat.ft_percentage.toFixed(1)}</td>
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
  );

  const getYoutubeEmbedUrl = (url) => {
    const videoId = url.split('v=')[1];
    return `https://www.youtube.com/embed/${videoId}`;
  };

  return (
    <div className="game-details-container">
      <div className="game-info">
        <h2>Game Details</h2>
        <p>Date: {new Date(game.game_date).toLocaleDateString()}</p>
        <p>Time: {game.game_time}</p>
        <p>Location: {game.location}</p>
        {game.video_url && (
          <div className="video-container">
            <iframe
              width="560"
              height="315"
              src={getYoutubeEmbedUrl(game.video_url)}
              title="Game Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}
      </div>
      <div className="team-details">
        <h3>
          <Link to={`/teams/${game.home_team_id}`}>{game.home_team_name}</Link>
        </h3>
        <p>Score: {game.home_team_points}</p>
        <h4>Player Stats</h4>
        {renderStatsTable(homeTeamStats)}
      </div>
      <div className="team-details">
        <h3>
          <Link to={`/teams/${game.away_team_id}`}>{game.away_team_name}</Link>
        </h3>
        <p>Score: {game.away_team_points}</p>
        <h4>Player Stats</h4>
        {renderStatsTable(awayTeamStats)}
      </div>
    </div>
  );
};

export default GameDetails;
