import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './GameForm.css';

const GameForm = () => {
  const [games, setGames] = useState([]);
  const [teams, setTeams] = useState([]);
  const [game, setGame] = useState({
    game_date: '', game_time: '', home_team_id: '', away_team_id: '',
    location: '', home_team_points: 0, away_team_points: 0, video_url: ''
  });
  const [editing, setEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredGames, setFilteredGames] = useState([]);

  useEffect(() => {
    fetchGames();
    fetchTeams();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const results = games.filter(game =>
        new Date(game.game_date).toLocaleDateString() === selectedDate.toLocaleDateString()
      );
      setFilteredGames(results);
    } else {
      setFilteredGames([]);
    }
  }, [selectedDate, games]);

  const fetchGames = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/games');
      const sortedGames = response.data.sort((a, b) => new Date(a.game_date) - new Date(b.game_date));
      setGames(sortedGames);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/teams');
      setTeams(response.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGame({ ...game, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      game_date: game.game_date,
      game_time: game.game_time,
      home_team_id: parseInt(game.home_team_id, 10),
      away_team_id: parseInt(game.away_team_id, 10),
      location: game.location,
      home_team_points: parseInt(game.home_team_points, 10),
      away_team_points: parseInt(game.away_team_points, 10),
      video_url: game.video_url
    };

    try {
      if (editing) {
        await axios.put(`http://localhost:3000/api/games/${editingId}`, formData);
        setEditing(false);
        setEditingId(null);
      } else {
        await axios.post('http://localhost:3000/api/games', formData);
      }
      setGame({
        game_date: '', game_time: '', home_team_id: '', away_team_id: '',
        location: '', home_team_points: 0, away_team_points: 0, video_url: ''
      });
      fetchGames();
    } catch (error) {
      console.error('Error saving game:', error);
    }
  };

const handleEdit = (game) => {
  if (editingId === game.id) {
    setGame({
      game_date: '', game_time: '', home_team_id: '', away_team_id: '',
      location: '', home_team_points: 0, away_team_points: 0, video_url: ''
    });
    setEditing(false);
    setEditingId(null);
  } else {
    setGame({
      ...game,
      game_date: new Date(game.game_date).toISOString().split('T')[0] // Format the date properly
    });
    setEditing(true);
    setEditingId(game.id);
  }
};

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this game?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:3000/api/games/${id}`);
        fetchGames();
      } catch (error) {
        console.error('Error deleting game:', error);
      }
    }
  };

  return (
    <div className="game-form-page-unique">
      <h2>{editing ? 'Update Game' : 'Add Game'}</h2>
      <form onSubmit={handleSubmit} className="game-form-unique">
        <div className="form-row-unique">
          <div className="form-group-unique">
            <label>Date:</label>
            <input type="date" name="game_date" value={game.game_date} onChange={handleChange} required />
          </div>
          <div className="form-group-unique">
            <label>Time:</label>
            <input type="time" name="game_time" value={game.game_time} onChange={handleChange} required />
          </div>
          <div className="form-group-unique">
            <label>Home Team:</label>
            <select name="home_team_id" value={game.home_team_id} onChange={handleChange} required>
              <option value="">Select a team</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group-unique">
            <label>Away Team:</label>
            <select name="away_team_id" value={game.away_team_id} onChange={handleChange} required>
              <option value="">Select a team</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group-unique">
            <label>Location:</label>
            <input type="text" name="location" value={game.location} onChange={handleChange} required />
          </div>
          <div className="form-group-unique">
            <label>Home Team Points:</label>
            <input type="number" name="home_team_points" value={game.home_team_points} onChange={handleChange} required />
          </div>
          <div className="form-group-unique">
            <label>Away Team Points:</label>
            <input type="number" name="away_team_points" value={game.away_team_points} onChange={handleChange} required />
          </div>
          <div className="form-group-unique">
            <label>Video URL:</label>
            <input type="url" name="video_url" value={game.video_url} onChange={handleChange} />
          </div>
        </div>
        <button type="submit">{editing ? 'Update Game' : 'Add Game'}</button>
      </form>

      <h2>Filter Games by Date</h2>
      <div className="date-picker-container-unique">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
          className="date-picker-unique"
          placeholderText="Select a date"
        />
      </div>

      <h2>Games List</h2>
      <ul className="game-form-list-unique">
        {(filteredGames.length > 0 ? filteredGames : games).map((game) => (
          <li key={game.id} className="game-form-item-unique">
            <p className="game-date-unique">{new Date(game.game_date).toLocaleDateString()}</p>
            <p className="game-time-unique">{game.game_time}</p>
            <p className="game-teams-unique">{game.home_team_name} {game.home_team_points} vs {game.away_team_name} {game.away_team_points}</p>
            <p className="game-location-unique">{game.location}</p>
            <button className="game-form-edit-btn-unique" onClick={() => handleEdit(game)}>
              {editingId === game.id ? 'Unedit' : 'Edit'}
            </button>
            <button className="game-form-delete-btn-unique" onClick={() => handleDelete(game.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GameForm;
