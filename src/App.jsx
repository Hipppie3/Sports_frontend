import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Players from './pages/Players';
import LoginForm from './components/LoginForm';
import Form from './pages/Form';
import './App.css'; // Make sure to import your App.css

const App = () => {
  return (
    <>
      <Navbar />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/players" element={<Players />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/form" element={<Form />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
