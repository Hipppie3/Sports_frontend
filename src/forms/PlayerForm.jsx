import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PlayerForm = () => {
  const [players, setPlayers] = useState([]);
  const [player, setPlayer] = useState({ first_name: '', last_name: '', position: '', sport: '', image: null });
  const [editing, setEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/players');
      setPlayers(response.data);
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
    try {
      await axios.delete(`http://localhost:3000/api/players/${id}`);
      fetchPlayers();
    } catch (error) {
      console.error('Error deleting player:', error);
    }
  };

  return (
    <div>
      <h2>{editing ? 'Edit Player' : 'Add Player'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label>
          <input type="text" name="first_name" value={player.first_name} onChange={handleChange} required />
        </div>
        <div>
          <label>Last Name:</label>
          <input type="text" name="last_name" value={player.last_name} onChange={handleChange} required />
        </div>
        <div>
          <label>Position:</label>
          <input type="text" name="position" value={player.position} onChange={handleChange} />
        </div>
        <div>
          <label>Sport:</label>
          <input type="text" name="sport" value={player.sport} onChange={handleChange} />
        </div>
        <div>
          <label>Image:</label>
          <input type="file" name="image" onChange={handleImageChange} />
        </div>
        <button type="submit">{editing ? 'Update Player' : 'Add Player'}</button>
      </form>

      <h2>Players List</h2>
      <ul>
        {players.map((player) => (
          <li key={player.id}>
            <p>{player.first_name} {player.last_name}</p>
            <p>{player.position}</p>
            <p>{player.sport}</p>
            {player.image && <img src={`data:image/jpeg;base64,${player.image}`} alt="Player" width="100" />}
            <button onClick={() => handleEdit(player)}>Edit</button>
            <button onClick={() => handleDelete(player.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerForm;
