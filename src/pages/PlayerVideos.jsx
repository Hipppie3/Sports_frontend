import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import defaultImage from '../images/defaultImage.png';
import './PlayerVideos.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const PlayerVideos = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [stats, setStats] = useState([]);
  const [videos, setVideos] = useState([]);
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
    fetchPlayerVideos();
  }, []);

  const fetchPlayer = async () => {
    try {
      const response = await axios.get(`https://basketballbackend-f112659937b5.herokuapp.com/api/players/${id}`);
      setPlayer(response.data);
    } catch (error) {
      console.error('Error fetching player:', error);
    }
  };

  const fetchPlayerStats = async () => {
    try {
      const response = await axios.get(`https://basketballbackend-f112659937b5.herokuapp.com/api/stats/${id}`);
      const sortedStats = response.data.sort((a, b) => new Date(a.game_date) - new Date(b.game_date));
      setStats(sortedStats);

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

  const fetchPlayerVideos = async () => {
    try {
      const response = await axios.get(`https://basketballbackend-f112659937b5.herokuapp.com/video-highlights/player/${id}`);
      setVideos(response.data); // Fetch all videos
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const getYoutubeEmbedUrl = (url) => {
    const videoId = url.split('v=')[1];
    return `https://www.youtube.com/embed/${videoId}`;
  };
const PieChart = ({ value, color }) => {
  const [displayValue, setDisplayValue] = useState(0);

  const [chartData, setChartData] = useState({
    datasets: [
      {
        data: [0, 100], // Start with 0% color, 100% background
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
    // Adjust the data for the pie chart
    const adjustedValue = value === 100 ? 100 : value;
    const remainingValue = 100 - adjustedValue;
    
    setChartData({
      datasets: [
        {
          data: [adjustedValue, remainingValue],
          backgroundColor: [color, '#e6e1e1'], // Color part and background part
          hoverBackgroundColor: [color, '#0e0d0d'],
        },
      ],
    });

    // Incrementally update the displayed value
    let startValue = 0;
    const duration = 2000; // Duration of the animation in ms
    const increment = adjustedValue / (duration / 20); // Increment value for each update

    const timer = setInterval(() => {
      startValue += increment;
      if (startValue >= adjustedValue) {
        clearInterval(timer);
        startValue = adjustedValue;
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
          <li><Link to={`/player/${id}`}>Profile</Link></li>
          <li><Link to={`/stats/${id}`}>Stats</Link></li>
          <li><Link to={`/videos/${id}`} className="active-link">Videos</Link></li>
        </ul>
      </div>
 
      <div className="section-container-video-video">
       <h3 className="all-video-title">ALL VIDEOS</h3>
        <div className="player-videos-grid">
          {videos.length > 0 ? (
            videos.map((video) => (
              <div key={video.id} className="video-item">
                <iframe
                  src={getYoutubeEmbedUrl(video.video_url)}
                  title={video.description}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                <p>{video.description}</p>
              </div>
            ))
          ) : (
            <p>No videos available for this player.</p>
          )}
        </div>
      </div>
    </div>
  );
};


export default PlayerVideos;
