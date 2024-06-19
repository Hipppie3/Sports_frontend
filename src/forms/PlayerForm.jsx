import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PlayerForm.css';
import defaultImage from '../images/defaultImage.png'; // Ensure the correct path to your default image

const PlayerForm = () => {
  const [players, setPlayers] = useState([]);
  const [player, setPlayer] = useState({ first_name: '', last_name: '', position: '', sport: '', image: null });
  const [editing, setEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [filteredPlayers, setFilteredPlayers] = useState([]);

  useEffect(() => {
    fetchPlayers();
  }, []);

  useEffect(() => {
    if (search) {
      const results = players.filter(player =>
        player.first_name.toLowerCase().startsWith(search.toLowerCase()) ||
        player.last_name.toLowerCase().startsWith(search.toLowerCase())
      );
      setFilteredPlayers(results);
    } else {
      setFilteredPlayers([]);
    }
  }, [search, players]);

  const fetchPlayers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/players');
      const sortedPlayers = response.data.sort((a, b) => a.first_name.localeCompare(b.first_name));
      setPlayers(sortedPlayers);
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlayer({ ...player, [name]: value });
  };

  const handleImageChange = (e) => {
    setPlayer({ ...player, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('first_name', player.first_name);
    formData.append('last_name', player.last_name);
    formData.append('position', player.position);
    formData.append('sport', player.sport);
    if (player.image) {
      formData.append('image', player.image);
    }

    try {
      if (editing) {
        await axios.put(`http://localhost:3000/api/players/${editingId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setEditing(false);
        setEditingId(null);
      } else {
        await axios.post('http://localhost:3000/api/players', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      setPlayer({ first_name: '', last_name: '', position: '', sport: '', image: null });
      fetchPlayers();
    } catch (error) {
      console.error('Error saving player:', error);
    }
  };

  const handleEdit = (player) => {
    setPlayer(player);
    setEditing(true);
    setEditingId(player.id);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this player?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:3000/api/players/${id}`);
        fetchPlayers();
      } catch (error) {
        console.error('Error deleting player:', error);
      }
    }
  };

  return (
    <div className="player-form-page">
      <h2>{editing ? 'Edit Player' : 'Add Player'}</h2>
      <form onSubmit={handleSubmit} className="player-form">
        <div className="form-row">
          <div className="form-group">
            <label>First Name:</label>
            <input type="text" name="first_name" value={player.first_name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Last Name:</label>
            <input type="text" name="last_name" value={player.last_name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Position:</label>
            <input type="text" name="position" value={player.position} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Sport:</label>
            <input type="text" name="sport" value={player.sport} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Image:</label>
            <input type="file" name="image" onChange={handleImageChange} />
          </div>
        </div>
        <button type="submit">{editing ? 'Update Player' : 'Add Player'}</button>
      </form>

      <h2>Players List</h2>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by first or last name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-bar"
        />
        <img src="/path/to/your/icon.png" alt="Search Icon" className="search-icon" />
      </div>
      <ul className="player-form-list">
        {(filteredPlayers.length > 0 ? filteredPlayers : players).map((player) => (
          <li key={player.id} className="player-form-item">
            <img 
              src={player.image ? `data:image/jpeg;base64,${player.image}` : defaultImage} 
              alt="Player" 
              className="player-form-image" 
            />
            <p>{player.first_name} {player.last_name}</p>
            <p>{player.sport}</p>
            <button className="playerFormEditBtn" onClick={() => handleEdit(player)}>Edit</button>
            <button className="playerFormDeleteBtn" onClick={() => handleDelete(player.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerForm;
