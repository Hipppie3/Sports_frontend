import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PlayerForm.css';
import defaultImage from '../images/defaultImage.png'; // Ensure the correct path to your default image
import SearchImage from '../images/search.png'; // Ensure the correct path to your search image

const PlayerForm = () => {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]); // State to store teams
  const [player, setPlayer] = useState({ first_name: '', last_name: '', position: '', sport: '', image: null, team_id: '' });
  const [editing, setEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [filteredPlayers, setFilteredPlayers] = useState([]);

  useEffect(() => {
    fetchPlayers();
    fetchTeams(); // Fetch teams on mount
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
    formData.append('team_id', player.team_id);
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
      setPlayer({ first_name: '', last_name: '', position: '', sport: '', image: null, team_id: '' });
      fetchPlayers();
    } catch (error) {
      console.error('Error saving player:', error);
    }
  };

  const handleEdit = (player) => {
    if (editingId === player.id) {
      // If the same player is clicked again, clear the form
      setPlayer({ first_name: '', last_name: '', position: '', sport: '', image: null, team_id: '' });
      setEditing(false);
      setEditingId(null);
    } else {
      setPlayer(player);
      setEditing(true);
      setEditingId(player.id);
    }
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
    <div className="player-form-page-unique">
      <h2>{editing ? 'Update Player' : 'Add Player'}</h2>
      <form onSubmit={handleSubmit} className="player-form-unique">
        <div className="form-row-unique">
          <div className="form-group-unique">
            <label>First Name:</label>
            <input type="text" name="first_name" value={player.first_name} onChange={handleChange} required />
          </div>
          <div className="form-group-unique">
            <label>Last Name:</label>
            <input type="text" name="last_name" value={player.last_name} onChange={handleChange} required />
          </div>
          <div className="form-group-unique">
            <label>Position:</label>
            <input type="text" name="position" value={player.position} onChange={handleChange} />
          </div>
          <div className="form-group-unique">
            <label>Sport:</label>
            <input type="text" name="sport" value={player.sport} onChange={handleChange} />
          </div>
          <div className="form-group-unique">
            <label>Team:</label>
            <select name="team_id" value={player.team_id} onChange={handleChange} required>
              <option value="">Select a team</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group-unique">
            <label>Image:</label>
            <input type="file" name="image" onChange={handleImageChange} />
          </div>
        </div>
        <button type="submit">{editing ? 'Update Player' : 'Add Player'}</button>
      </form>

      <h2>Players List</h2>
      <div className="search-container-unique">
        <input
          type="text"
          placeholder="Search by first or last name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-bar-unique"
        />
        <img src={SearchImage} alt="Search Icon" className="search-icon-unique" />
      </div>
      <ul className="player-form-list-unique">
        {(filteredPlayers.length > 0 ? filteredPlayers : players).map((player) => (
          <li key={player.id} className="player-form-item-unique">
            <img 
              src={player.image ? `data:image/jpeg;base64,${player.image}` : defaultImage} 
              alt="Player" 
              className="player-form-image-unique" 
            />
            {console.log(player)}
            <p className="player-name-unique">{player.first_name} {player.last_name}</p>
            <p className="player-sport-unique">{player.sport}</p>
            <p className="player-team-unique">{player.team_name}</p>
            <button className="player-form-edit-btn-unique" onClick={() => handleEdit(player)}>
              {editingId === player.id ? 'Unedit' : 'Edit'}
            </button>
            <button className="player-form-delete-btn-unique" onClick={() => handleDelete(player.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerForm;
