import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './StatForm.css';

const StatForm = ({ initialStatData }) => {
  const [players, setPlayers] = useState([]);
  const [stats, setStats] = useState([]);
  const [playerId, setPlayerId] = useState(initialStatData?.player_id || '');
  const [gameDate, setGameDate] = useState(initialStatData?.game_date || '');
  const [twoPm, setTwoPm] = useState(initialStatData?.two_pm || '');
  const [twoPa, setTwoPa] = useState(initialStatData?.two_pa || '');
  const [threePm, setThreePm] = useState(initialStatData?.three_pm || '');
  const [threePa, setThreePa] = useState(initialStatData?.three_pa || '');
  const [ftm, setFtm] = useState(initialStatData?.ftm || '');
  const [fta, setFta] = useState(initialStatData?.fta || '');
  const [oreb, setOreb] = useState(initialStatData?.oreb || '');
  const [dreb, setDreb] = useState(initialStatData?.dreb || '');
  const [ast, setAst] = useState(initialStatData?.ast || '');
  const [stl, setStl] = useState(initialStatData?.stl || '');
  const [blk, setBlk] = useState(initialStatData?.blk || '');
  const [tov, setTov] = useState(initialStatData?.tov || '');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedGameDate, setSelectedGameDate] = useState(null);
  const [statId, setStatId] = useState(null); // Add statId state

  useEffect(() => {
    fetchPlayers();
  }, []);

  useEffect(() => {
    if (playerId) {
      fetchPlayerStats();
    }
  }, [playerId]);

  const fetchPlayers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/players');
      setPlayers(response.data);
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

const fetchPlayerStats = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/api/stats/${playerId}`);
    const sortedStats = response.data.sort((a, b) => new Date(a.game_date) - new Date(b.game_date));
    setStats(sortedStats);
  } catch (error) {
    console.error('Error fetching stats:', error);
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      player_id: playerId,
      game_date: gameDate,
      two_pm: parseInt(twoPm || '0', 10),
      two_pa: parseInt(twoPa || '0', 10),
      three_pm: parseInt(threePm || '0', 10),
      three_pa: parseInt(threePa || '0', 10),
      ftm: parseInt(ftm || '0', 10),
      fta: parseInt(fta || '0', 10),
      oreb: parseInt(oreb || '0', 10),
      dreb: parseInt(dreb || '0', 10),
      ast: parseInt(ast || '0', 10),
      stl: parseInt(stl || '0', 10),
      blk: parseInt(blk || '0', 10),
      tov: parseInt(tov || '0', 10),
    };

    // Validation
    if (formData.two_pm > formData.two_pa) {
      setErrorMessage('2PM cannot be greater than 2PA.');
      return;
    }
    if (formData.three_pm > formData.three_pa) {
      setErrorMessage('3PM cannot be greater than 3PA.');
      return;
    }
    if (formData.ftm > formData.fta) {
      setErrorMessage('FTM cannot be greater than FTA.');
      return;
    }
    const fgm = formData.two_pm + formData.three_pm;
    const fga = formData.two_pa + formData.three_pa;
    if (fgm > fga) {
      setErrorMessage('FGM cannot be greater than FGA.');
      return;
    }

    try {
      if (statId) {
        // Update existing stats
        await axios.put(`http://localhost:3000/api/stats/${statId}`, formData);
      } else {
        // Create new stats
        await axios.post('http://localhost:3000/api/stats', formData);
      }
      setSuccessMessage('Stats added successfully');
      setErrorMessage('');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      fetchPlayerStats(); // Refresh the stats after submitting
      handleClearForm(); // Clear the form after submission
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

const handleEdit = (stat) => {
  if (statId === stat.id) {
    handleClearForm(); // If the same stat is clicked again, clear the form
  } else {
    setStatId(stat.id); // Set statId for the stat being edited
    setPlayerId(stat.player_id);
    setGameDate(stat.game_date.split('T')[0]);
    setTwoPm(stat.two_pm);
    setTwoPa(stat.two_pa);
    setThreePm(stat.three_pm);
    setThreePa(stat.three_pa);
    setFtm(stat.ftm);
    setFta(stat.fta);
    setOreb(stat.oreb);
    setDreb(stat.dreb);
    setAst(stat.ast);
    setStl(stat.stl);
    setBlk(stat.blk);
    setTov(stat.tov);
    setSelectedGameDate(stat.game_date);
  }
};


  const handleUnedit = () => {
    handleClearForm(); // Clear the form
  };

  const handleClearForm = () => {
    setStatId(null); // Clear statId
    setGameDate('');
    setTwoPm('');
    setTwoPa('');
    setThreePm('');
    setThreePa('');
    setFtm('');
    setFta('');
    setOreb('');
    setDreb('');
    setAst('');
    setStl('');
    setBlk('');
    setTov('');
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this stat?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:3000/api/stats/${id}`);
      setSuccessMessage('Stats deleted successfully');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      fetchPlayerStats(); // Refresh the stats after deleting
    } catch (error) {
      console.error('Error deleting stats:', error);
    }
  };

  const handleGameDateClick = (gameDate) => {
    if (selectedGameDate === gameDate) {
      setSelectedGameDate(null); // Deselect the game date if it's already selected
    } else {
      setSelectedGameDate(gameDate); // Select the clicked game date
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="form-container">
      <form className="stat-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="player">Player</label>
          <select
            id="player"
            value={playerId}
            onChange={(e) => setPlayerId(e.target.value)}
            required
          >
            <option value="">Select a player</option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.first_name} {player.last_name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="gameDate">Game Date</label>
          <input
            type="date"
            id="gameDate"
            value={gameDate}
            onChange={(e) => setGameDate(e.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="twoPm">2PM</label>
            <input
              type="number"
              id="twoPm"
              value={twoPm}
              onChange={(e) => setTwoPm(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="twoPa">2PA</label>
            <input
              type="number"
              id="twoPa"
              value={twoPa}
              onChange={(e) => setTwoPa(e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="threePm">3PM</label>
            <input
              type="number"
              id="threePm"
              value={threePm}
              onChange={(e) => setThreePm(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="threePa">3PA</label>
            <input
              type="number"
              id="threePa"
              value={threePa}
              onChange={(e) => setThreePa(e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="ftm">FTM</label>
            <input
              type="number"
              id="ftm"
              value={ftm}
              onChange={(e) => setFtm(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="fta">FTA</label>
            <input
              type="number"
              id="fta"
              value={fta}
              onChange={(e) => setFta(e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="oreb">OREB</label>
            <input
              type="number"
              id="oreb"
              value={oreb}
              onChange={(e) => setOreb(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="dreb">DREB</label>
            <input
              type="number"
              id="dreb"
              value={dreb}
              onChange={(e) => setDreb(e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="ast">AST</label>
            <input
              type="number"
              id="ast"
              value={ast}
              onChange={(e) => setAst(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="stl">STL</label>
            <input
              type="number"
              id="stl"
              value={stl}
              onChange={(e) => setStl(e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="blk">BLK</label>
            <input
              type="number"
              id="blk"
              value={blk}
              onChange={(e) => setBlk(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="tov">TOV</label>
            <input
              type="number"
              id="tov"
              value={tov}
              onChange={(e) => setTov(e.target.value)}
            />
          </div>
        </div>

         <button type="submit" className="submit-button">Submit</button>
         {successMessage && (
           <div className="success-message">
             {successMessage}
           </div>
         )}
         {errorMessage && (
           <div className="error-message">
             {errorMessage}
           </div>
         )}

      </form>
      <div className="right-side-content">
        <h2>Game Dates</h2>
        <ul className="game-dates">
          {stats.map((stat) => (
            <li key={stat.id}>
              <button className="game-date" onClick={() => handleGameDateClick(stat.game_date)}>
                {formatDate(stat.game_date)}
              </button>
              {selectedGameDate === stat.game_date && (
                <div className="game-stats">
                  <p>2PM: {stat.two_pm}</p>
                  <p>2PA: {stat.two_pa}</p>
                  <p>3PM: {stat.three_pm}</p>
                  <p>3PA: {stat.three_pa}</p>
                  <p>FTM: {stat.ftm}</p>
                  <p>FTA: {stat.fta}</p>
                  <p>OREB: {stat.oreb}</p>
                  <p>DREB: {stat.dreb}</p>
                  <p>AST: {stat.ast}</p>
                  <p>STL: {stat.stl}</p>
                  <p>BLK: {stat.blk}</p>
                  <p>TOV: {stat.tov}</p>
                  <button onClick={() => handleEdit(stat)}>
                   {statId === stat.id ? 'Unedit' : 'Edit'}
                  </button>
                  <button onClick={() => handleDelete(stat.id)}>Delete</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StatForm;