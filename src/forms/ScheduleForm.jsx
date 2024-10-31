import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ScheduleForm = () => {
  const [teams, setTeams] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [schedule, setSchedule] = useState({
    league_id: '',
    game_date: '',
    game_time: '',
    home_team_id: '',
    away_team_id: '',
    location: ''
  });

  useEffect(() => {
    fetchTeams();
    fetchLeagues();
  }, []);

  const fetchTeams = async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/teams`);
    setTeams(response.data);
  };

  const fetchLeagues = async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/leagues`);
    setLeagues(response.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSchedule({ ...schedule, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/schedules`, schedule);
      alert('Schedule created successfully!');
    } catch (error) {
      console.error('Error creating schedule:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>League:</label>
      <select name="league_id" value={schedule.league_id} onChange={handleChange} required>
        <option value="">Select League</option>
        {leagues.map((league) => (
          <option key={league.id} value={league.id}>{league.name}</option>
        ))}
      </select>
      <label>Game Date:</label>
      <input type="date" name="game_date" value={schedule.game_date} onChange={handleChange} required />
      <label>Game Time:</label>
      <input type="time" name="game_time" value={schedule.game_time} onChange={handleChange} required />
      <label>Home Team:</label>
      <select name="home_team_id" value={schedule.home_team_id} onChange={handleChange} required>
        <option value="">Select Home Team</option>
        {teams.map((team) => (
          <option key={team.id} value={team.id}>{team.name}</option>
        ))}
      </select>
      <label>Away Team:</label>
      <select name="away_team_id" value={schedule.away_team_id} onChange={handleChange} required>
        <option value="">Select Away Team</option>
        {teams.map((team) => (
          <option key={team.id} value={team.id}>{team.name}</option>
        ))}
      </select>
      <label>Location:</label>
      <input type="text" name="location" value={schedule.location} onChange={handleChange} required />
      <button type="submit">Create Schedule</button>
    </form>
  );
};

export default ScheduleForm;
