import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, username, logout } = useAuth();
  console.log('Navbar isAuthenticated:', isAuthenticated);

  return (
    <nav className="navbar-custom">
      <ul className="nav-list-custom">
        <li className="nav-item-custom"><Link to="/" className="nav-link-custom">Home</Link></li>
        <li className="nav-item-custom"><Link to="/players" className="nav-link-custom">Players</Link></li>
        {isAuthenticated ? (
          <>
            <li className="nav-item-custom"><Link to="/form" className="nav-link-custom">Form</Link></li>
            <li className="nav-item-custom"><button onClick={logout} className="nav-link-custom">Logout</button></li>
          </>
        ) : (
          <li className="nav-item-custom"><Link to="/login" className="nav-link-custom">Login</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
