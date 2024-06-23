import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import defaultImage from '../images/defaultImage.png';
import './PlayerDetails.css';

ChartJS.register(ArcElement, Tooltip, Legend);

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
    fg_percentage: 0,
    two_p_percentage: 0,
    three_p_percentage: 0,
    ft_percentage: 0,
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
        const totalFgPercentage = sortedStats.reduce((sum, stat) => sum + stat.fg_percentage, 0);
        const totalTwoPPercentage = sortedStats.reduce((sum, stat) => sum + stat.two_p_percentage, 0);
        const totalThreePPercentage = sortedStats.reduce((sum, stat) => sum + stat.three_p_percentage, 0);
        const totalFtPercentage = sortedStats.reduce((sum, stat) => sum + stat.ft_percentage, 0);

        setAverages({
          ppg: (totalPoints / totalGames).toFixed(1),
          rpg: (totalRebounds / totalGames).toFixed(1),
          apg: (totalAssists / totalGames).toFixed(1),
          spg: (totalSteals / totalGames).toFixed(1),
          bpg: (totalBlocks / totalGames).toFixed(1),
          tpg: (totalTurnovers / totalGames).toFixed(1),
          fg_percentage: (totalFgPercentage / totalGames).toFixed(1),
          two_p_percentage: (totalTwoPPercentage / totalGames).toFixed(1),
          three_p_percentage: (totalThreePPercentage / totalGames).toFixed(1),
          ft_percentage: (totalFtPercentage / totalGames).toFixed(1),
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

  const PieChart = ({ value, label, color }) => {
    const [displayValue, setDisplayValue] = useState(0);

    const [chartData, setChartData] = useState({
      datasets: [
        {
          data: [0, 100], // Start with 0% pink, 100% black
          backgroundColor: [color, '#0e0d0d'], // Fully black initially
          hoverBackgroundColor: [color, '#0e0d0d'],
        },
      ],
    });

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      plugins: {
        tooltip: {
          enabled: false,
        },
      },
      animation: {
        animateRotate: false,
        animateScale: false,
      },
    };

    useEffect(() => {
      // Update the chart data with the actual value
      setChartData({
        datasets: [
          {
            data: [value, 100 - value],
            backgroundColor: [color, '#e6e1e1'], // Pink part and black part
            hoverBackgroundColor: [color, '#0e0d0d'],
          },
        ],
      });

      // Incrementally update the displayed value
      let startValue = 0;
      const duration = 2000; // Duration of the animation in ms
      const increment = value / (duration / 20); // Increment value for each update

      const timer = setInterval(() => {
        startValue += increment;
        if (startValue >= value) {
          clearInterval(timer);
          startValue = value;
        }
        setDisplayValue(startValue.toFixed(1));
      }, 20);

      return () => clearInterval(timer);
    }, [value, color]);

    return (
      <div className="pie-chart-wrapper">
        <Pie data={chartData} options={options} />
        <div className="pie-chart-label">{`${displayValue}%`}</div>
      </div>
    );
  };

  if (!player) {
    return <p>Loading...</p>;
  }

  return (
    <div className="player-details-container">
      <div className="player-info-charts-container">
        <div className="player-info-container">
          <img
            src={player.image ? `data:image/jpeg;base64,${player.image}` : defaultImage}
            alt="Player"
            className="player-image"
          />
          <h2>{player.first_name} {player.last_name}</h2>
          <p>Position: {player.position}</p>
          <p>Sport: {player.sport}</p>
        </div>

        <div className="player-stats-container">
          <div className="pie-chart-group">
            <div className="pie-chart-item">
              <p>FG%</p>
              <PieChart value={averages.fg_percentage} color="#05a0e8" />
            </div>
            <div className="pie-chart-item">
              <p>FT%</p>
              <PieChart value={averages.ft_percentage} color="#24f109" />
            </div>
          </div>
          <div className="pie-chart-group">
            <div className="pie-chart-item">
              <p>3P%</p>
              <PieChart value={averages.three_p_percentage} color="#ff0808" />
            </div>
            <div className="pie-chart-item">
              <p>2P%</p>
              <PieChart value={averages.two_p_percentage} color="#FF6384" />
            </div>
          </div>
        </div>
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
