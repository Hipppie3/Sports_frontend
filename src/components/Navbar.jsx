import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleMouseEnter = () => {
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setDropdownOpen(false);
  };

  return (
    <nav className="navbar-custom">
      <ul className="nav-list-custom">
        <li className="nav-item-custom"><Link to="/" className="nav-link-custom">Home</Link></li>
        <li className="nav-item-custom"><Link to="/players" className="nav-link-custom">Players</Link></li>
        {isAuthenticated ? (
          <>
            <li className="nav-item-custom" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <button className="nav-link-custom" onClick={handleDropdownToggle}>Form</button>
              {dropdownOpen && (
                <ul className="dropdown-menu-custom">
                  <li><Link to="/player-form" className="dropdown-link-custom">Player Form</Link></li>
                  <li><Link to="/stats-form" className="dropdown-link-custom">Stats Form</Link></li>
                  <li><Link to="/video-form" className="dropdown-link-custom">Video Form</Link></li> {/* Add link to VideoForm */}
                </ul>
              )}
            </li>
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
