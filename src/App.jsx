import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Players from './pages/Players';
import LoginForm from './components/LoginForm';
import PlayerForm from './forms/PlayerForm';
import StatForm from './forms/StatForm';
import VideoForm from './forms/VideoForm';
import TeamForm from './forms/TeamForm';
import GameForm from './forms/GameForm';
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
          <Route path="/login" element={<LoginForm />} />
          <Route path="/player-form" element={<PlayerForm />} />
          <Route path="/stats-form" element={<StatForm />} />
          <Route path="/video-form" element={<VideoForm />} /> 
          <Route path="/team-form" element={<TeamForm />} />
          <Route path="/game-form" element={<GameForm />} />
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
