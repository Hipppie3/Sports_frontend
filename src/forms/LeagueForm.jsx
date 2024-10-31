import React, { useState } from 'react';
import axios from 'axios';

const LeagueForm = () => {
  const [league, setLeague] = useState({ name: '', start_date: '', end_date: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeague({ ...league, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/leagues`, league);
      alert('League created successfully!');
    } catch (error) {
      console.error('Error creating league:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>League Name:</label>
      <input type="text" name="name" value={league.name} onChange={handleChange} required />
      <label>Start Date:</label>
      <input type="date" name="start_date" value={league.start_date} onChange={handleChange} required />
      <label>End Date:</label>
      <input type="date" name="end_date" value={league.end_date} onChange={handleChange} required />
      <button type="submit">Create League</button>
    </form>
  );
};

export default LeagueForm;
