import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Players from './pages/Players';
import Teams from './pages/Teams';
import Games from './pages/Games';
import Schedule from './pages/Schedule';
import League from './pages/League';
import LoginForm from './components/LoginForm';
import PlayerForm from './forms/PlayerForm';
import StatForm from './forms/StatForm';
import VideoForm from './forms/VideoForm';
import TeamForm from './forms/TeamForm';
import GameForm from './forms/GameForm';
import ScheduleForm from './forms/ScheduleForm';
import LeagueForm from './forms/LeagueForm';
import PlayerDetails from './pages/PlayerDetails';
import GameDetails from './pages/GameDetails';
import TeamDetails from './pages/TeamDetails';
import PlayerStats from './pages/PlayerStats';
import PlayerVideos from './pages/PlayerVideos';

import './App.css';

const App = () => {
  return (
    <>
      <Navbar />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/players" element={<Players />} />
          <Route path="/teams" element={<Teams />} />
          <Route path='/games' element={<Games />} />
          <Route path='/schedule' element={<Schedule />} />
          <Route path='/league' element={<League />} />
          <Route path="/league/:leagueId" element={<Schedule />} /> {/* Display schedule by league */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/player-form" element={<PlayerForm />} />
          <Route path="/stats-form" element={<StatForm />} />
          <Route path="/video-form" element={<VideoForm />} /> 
          <Route path="/team-form" element={<TeamForm />} />
          <Route path="/game-form" element={<GameForm />} />
          <Route path='/league-form' element={<LeagueForm />} />
          <Route path='/schedule-form' element={<ScheduleForm />} />
          <Route path="/player/:id" element={<PlayerDetails />} />
          <Route path="/game/:id" element={<GameDetails />} />
          <Route path="/teams/:id" element={<TeamDetails />} /> {/* Corrected path */}
          <Route path="/videos/:id" element={<PlayerVideos />} />
          <Route path="/stats/:id" element={<PlayerStats />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
