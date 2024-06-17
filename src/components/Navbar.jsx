// src/components/Navbar.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar-custom">
      <ul className="nav-list-custom">
        <li className="nav-item-custom"><Link to="/" className="nav-link-custom">Home</Link></li>
        <li className="nav-item-custom"><Link to="/players" className="nav-link-custom">Players</Link></li>
        <li className="nav-item-custom"><Link to="/login" className="nav-link-custom">Login</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
