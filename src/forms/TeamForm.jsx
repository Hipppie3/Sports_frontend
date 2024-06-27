import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TeamForm.css';
import defaultImage from '../images/defaultImage.png'; // Ensure the correct path to your default image
import SearchImage from '../images/search.png'; // Ensure the correct path to your search image

const TeamForm = () => {
  const [teams, setTeams] = useState([]);
  const [team, setTeam] = useState({ name: '', sport: '', image: null });
  const [editing, setEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [filteredTeams, setFilteredTeams] = useState([]);

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    if (search) {
      const results = teams.filter(team =>
        team.name.toLowerCase().startsWith(search.toLowerCase())
      );
      setFilteredTeams(results);
    } else {
      setFilteredTeams([]);
    }
  }, [search, teams]);

  const fetchTeams = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/teams`);
      const sortedTeams = response.data.sort((a, b) => a.name.localeCompare(b.name));
      setTeams(sortedTeams);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeam({ ...team, [name]: value });
  };

  const handleImageChange = (e) => {
    setTeam({ ...team, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', team.name);
    formData.append('sport', team.sport);
    if (team.image) {
      formData.append('image', team.image);
    }

    try {
      if (editing) {
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/teams/${editingId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setEditing(false);
        setEditingId(null);
      } else {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/teams`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      setTeam({ name: '', sport: '', image: null });
      fetchTeams();
    } catch (error) {
      console.error('Error saving team:', error);
    }
  };

  const handleEdit = (team) => {
    if (editingId === team.id) {
      // If the same team is clicked again, clear the form
      setTeam({ name: '', sport: '', image: null });
      setEditing(false);
      setEditingId(null);
    } else {
      setTeam(team);
      setEditing(true);
      setEditingId(team.id);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this team?');
    if (confirmDelete) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/teams/${id}`);
        fetchTeams();
      } catch (error) {
        console.error('Error deleting team:', error);
      }
    }
  };

  return (
    <div className="team-form-page-unique">
      <h2>{editing ? 'Update Team' : 'Add Team'}</h2>
      <form onSubmit={handleSubmit} className="team-form-unique">
        <div className="form-row-unique">
          <div className="form-group-unique">
            <label>Name:</label>
            <input type="text" name="name" value={team.name} onChange={handleChange} required />
          </div>
          <div className="form-group-unique">
            <label>Sport:</label>
            <input type="text" name="sport" value={team.sport} onChange={handleChange} required />
          </div>
          <div className="form-group-unique">
            <label>Image:</label>
            <input type="file" name="image" onChange={handleImageChange} />
          </div>
        </div>
        <button type="submit">{editing ? 'Update Team' : 'Add Team'}</button>
      </form>

      <h2>Teams List</h2>
      <div className="search-container-unique">
        <input
          type="text"
          placeholder="Search by team name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-bar-unique"
        />
        <img src={SearchImage} alt="Search Icon" className="search-icon-unique" />
      </div>
      <ul className="team-form-list-unique">
        {(filteredTeams.length > 0 ? filteredTeams : teams).map((team) => (
          <li key={team.id} className="team-form-item-unique">
            <img 
              src={team.image ? `data:image/jpeg;base64,${team.image}` : defaultImage} 
              alt="Team" 
              className="team-form-image-unique" 
            />
            <p className="team-name-unique">{team.name}</p>
            <p className="team-sport-unique">{team.sport}</p>
            <button className="team-form-edit-btn-unique" onClick={() => handleEdit(team)}>
              {editingId === team.id ? 'Unedit' : 'Edit'}
            </button>
            <button className="team-form-delete-btn-unique" onClick={() => handleDelete(team.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamForm;
