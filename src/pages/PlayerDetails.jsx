import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import defaultImage from '../images/defaultImage.png';
import './PlayerDetails.css';

const PlayerDetails = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [stats, setStats] = useState([]);
  const [averages, setAverages] = useState({
    ppg: 0,
    rpg: 0,
    apg: 0,
    spg: 0,
    bpg: 0,
    tpg: 0,
  });

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
    const sortedStats = response.data.sort((a, b) => new Date(a.game_date) - new Date(b.game_date));
    const latestFiveStats = sortedStats.slice(-5);
    setStats(latestFiveStats);

    const totalGames = sortedStats.length;
    if (totalGames > 0) {
      const totalPoints = sortedStats.reduce((sum, stat) => sum + stat.pts, 0);
      const totalRebounds = sortedStats.reduce((sum, stat) => sum + stat.reb, 0);
      const totalAssists = sortedStats.reduce((sum, stat) => sum + stat.ast, 0);
      const totalSteals = sortedStats.reduce((sum, stat) => sum + stat.stl, 0);
      const totalBlocks = sortedStats.reduce((sum, stat) => sum + stat.blk, 0);
      const totalTurnovers = sortedStats.reduce((sum, stat) => sum + stat.tov, 0);

      setAverages({
        ppg: (totalPoints / totalGames).toFixed(1),
        rpg: (totalRebounds / totalGames).toFixed(1),
        apg: (totalAssists / totalGames).toFixed(1),
        spg: (totalSteals / totalGames).toFixed(1),
        bpg: (totalBlocks / totalGames).toFixed(1),
        tpg: (totalTurnovers / totalGames).toFixed(1),
      });
    }
  } catch (error) {
    console.error('Error fetching stats:', error);
  }
};



  const handleMouseDown = (e) => {
    const tableContainer = e.target.closest('.player-stats-table-container');
    tableContainer.dataset.isDragging = true;
    tableContainer.dataset.startX = e.pageX - tableContainer.scrollLeft;
  };

  const handleMouseMove = (e) => {
    const tableContainer = document.querySelector('.player-stats-table-container');
    if (tableContainer.dataset.isDragging === 'true') {
      const x = e.pageX - tableContainer.dataset.startX;
      tableContainer.scrollLeft = -x;
    }
  };

  const handleMouseUp = () => {
    const tableContainer = document.querySelector('.player-stats-table-container');
    tableContainer.dataset.isDragging = false;
  };

  if (!player) {
    return <p></p>;
  }

  return (
    <div className="player-details-container">

      <img 
        src={player.image ? `data:image/jpeg;base64,${player.image}` : defaultImage} 
        alt="Player" 
        className="player-image" 
      />
      <h2>{player.first_name} {player.last_name}</h2>
      <p>Position: {player.position}</p>
      <p>Sport: {player.sport}</p>

<div className="boxes-container">
  <div className="box"></div>
  <div className="box">
    PPG
    <span>
      <span className="integer">{Math.floor(averages.ppg)}</span>.
      <span className="decimal">{(averages.ppg % 1).toFixed(1).substring(2)}</span>
    </span>
  </div>
  <div className="box">
    RPG
    <span>
      <span className="integer">{Math.floor(averages.rpg)}</span>.
      <span className="decimal">{(averages.rpg % 1).toFixed(1).substring(2)}</span>
    </span>
  </div>
  <div className="box">
    APG
    <span>
      <span className="integer">{Math.floor(averages.apg)}</span>.
      <span className="decimal">{(averages.apg % 1).toFixed(1).substring(2)}</span>
    </span>
  </div>
  <div className="box">
    SPG
    <span>
      <span className="integer">{Math.floor(averages.spg)}</span>.
      <span className="decimal">{(averages.spg % 1).toFixed(1).substring(2)}</span>
    </span>
  </div>
  <div className="box">
    BPG
    <span>
      <span className="integer">{Math.floor(averages.bpg)}</span>.
      <span className="decimal">{(averages.bpg % 1).toFixed(1).substring(2)}</span>
    </span>
  </div>
  <div className="box">
    TPG
    <span>
      <span className="integer">{Math.floor(averages.tpg)}</span>.
      <span className="decimal">{(averages.tpg % 1).toFixed(1).substring(2)}</span>
    </span>
  </div>
  <div className="box"></div>
</div>


      
      <div className="player-links-container">
        <ul>
          <li><Link to={`/player/${id}`} className="active-link">Profile</Link></li>
          <li><Link to={`/stats/${id}`}>Stats</Link></li>
          <li><Link to={`/videos/${id}`}>Videos</Link></li>
        </ul>
      </div>

      <div className="section-container">
        <div 
          className="player-stats-table-container" 
          onMouseDown={handleMouseDown} 
          onMouseMove={handleMouseMove} 
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <h3 className="last-5">LAST 5 GAMES</h3>
          {stats.length > 0 ? (
            <table className="player-stats-table">
              <thead>
                <tr>
                  <th className="player-stats-th">Date</th>
                  <th className="player-stats-th">PTS</th>
                  <th className="player-stats-th">FGM</th>
                  <th className="player-stats-th">FGA</th>
                  <th className="player-stats-th">FG%</th>
                  <th className="player-stats-th">2PM</th>
                  <th className="player-stats-th">2PA</th>
                  <th className="player-stats-th">2P%</th>
                  <th className="player-stats-th">3PM</th>
                  <th className="player-stats-th">3PA</th>
                  <th className="player-stats-th">3P%</th>
                  <th className="player-stats-th">FTM</th>
                  <th className="player-stats-th">FTA</th>
                  <th className="player-stats-th">FT%</th>
                  <th className="player-stats-th">OREB</th>
                  <th className="player-stats-th">DREB</th>
                  <th className="player-stats-th">REB</th>
                  <th className="player-stats-th">AST</th>
                  <th className="player-stats-th">STL</th>
                  <th className="player-stats-th">BLK</th>
                  <th className="player-stats-th">TOV</th>
                </tr>
              </thead>
              <tbody>
                {stats.map(stat => (
                  <tr key={stat.id}>
                    <td className="player-stats-td">{new Date(stat.game_date).toLocaleDateString()}</td>
                    <td className="player-stats-td">{stat.pts}</td>
                    <td className="player-stats-td">{stat.fgm}</td>
                    <td className="player-stats-td">{stat.fga}</td>
                    <td className="player-stats-td">{stat.fg_percentage.toFixed(1)}</td>
                    <td className="player-stats-td">{stat.two_pm}</td>
                    <td className="player-stats-td">{stat.two_pa}</td>
                    <td className="player-stats-td">{stat.two_p_percentage.toFixed(1)}</td>
                    <td className="player-stats-td">{stat.three_pm}</td>
                    <td className="player-stats-td">{stat.three_pa}</td>
                    <td className="player-stats-td">{stat.three_p_percentage.toFixed(1)}</td>
                    <td className="player-stats-td">{stat.ftm}</td>
                    <td className="player-stats-td">{stat.fta}</td>
                    <td className="player-stats-td">{stat.ft_percentage.toFixed(1)}</td>
                    <td className="player-stats-td">{stat.oreb}</td>
                    <td className="player-stats-td">{stat.dreb}</td>
                    <td className="player-stats-td">{stat.reb}</td>
                    <td className="player-stats-td">{stat.ast}</td>
                    <td className="player-stats-td">{stat.stl}</td>
                    <td className="player-stats-td">{stat.blk}</td>
                    <td className="player-stats-td">{stat.tov}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No stats available for this player.</p>
          )}
        </div>
      </div>

      <div className="section-container">
        <div className="player-videos-container">
          <h3>LATEST VIDEOS</h3>

            <p>No videos available for this player.</p>

        </div>
      </div>
    </div>
  );
};

export default PlayerDetails;
