import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './Schedule.css'

const Schedule = () => {
  const { leagueId } = useParams(); // Get the league ID from the route params if needed
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    fetchSchedule();
  }, [leagueId]);

  const fetchSchedule = async () => {
    try {
      const url = leagueId 
        ? `${import.meta.env.VITE_API_BASE_URL}/schedule/league/${leagueId}` // Fetch schedule by league
        : `${import.meta.env.VITE_API_BASE_URL}/schedules`; // Fetch all schedules

      const response = await axios.get(url);
      setSchedule(response.data);
    } catch (error) {
      console.error('Error fetching schedule:', error);
    }
  };

  return (
    <div className='schedule'>
      <h1>{leagueId ? `Schedule for League ${leagueId}` : "All Schedules"}</h1>
      {schedule.length > 0 ? (
        <ul>
          {schedule.map((game) => (
            <li key={game.id}>
              <div>
                <strong>Game Date:</strong> {new Date(game.game_date).toLocaleDateString()} <br />
                <strong>Time:</strong> {game.game_time} <br />
                <strong>Home Team:</strong> {game.home_team_name || "TBD"} <br />
                <strong>Away Team:</strong> {game.away_team_name || "TBD"} <br />
                <strong>Location:</strong> {game.location}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No games scheduled yet.</p>
      )}
    </div>
  );
};

export default Schedule;
