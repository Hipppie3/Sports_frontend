import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const [click, setClick] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isShrunk, setIsShrunk] = useState(false);
  
  const navigate = useNavigate();

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleMouseEnter = () => setDropdownOpen(true);
  const handleMouseLeave = () => setDropdownOpen(false);

  // Detect scroll and apply the shrink class
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsShrunk(true);
      } else {
        setIsShrunk(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isShrunk ? 'shrunk' : ''}`}>
      <div className="navbar-container">
        <NavLink to="/" className="navbar-logo" onClick={closeMobileMenu}>
          HIPPPIE <span className="navbar-logo-sub">SPORTS</span>
        </NavLink>
      <div className="menu-icon" onClick={handleClick}>
          {click ? <FaTimes /> : <FaBars />}
        </div>

        <ul className={click ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <NavLink to="/players" className="nav-links" onClick={closeMobileMenu}>Players</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/teams" className="nav-links" onClick={closeMobileMenu}>Teams</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/games" className="nav-links" onClick={closeMobileMenu}>Games</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/schedule" className="nav-links" onClick={closeMobileMenu}>Schedule</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/league" className="nav-links" onClick={closeMobileMenu}>League</NavLink>
          </li>

          {isAuthenticated ? (
            <>
              <li className="nav-item" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <button className="nav-links" onClick={handleDropdownToggle}>
                  Form
                </button>
                {dropdownOpen && (
                  <ul className="dropdown-menu">
                    <li><NavLink to="/player-form" className="dropdown-link" onClick={closeMobileMenu}>Player Form</NavLink></li>
                    <li><NavLink to="/stats-form" className="dropdown-link" onClick={closeMobileMenu}>Stats Form</NavLink></li>
                    <li><NavLink to="/video-form" className="dropdown-link" onClick={closeMobileMenu}>Video Form</NavLink></li>
                    <li><NavLink to="/team-form" className="dropdown-link" onClick={closeMobileMenu}>Team Form</NavLink></li>
                    <li><NavLink to="/game-form" className="dropdown-link" onClick={closeMobileMenu}>Game Form</NavLink></li>
                    <li><NavLink to="/league-form" className="dropdown-link" onClick={closeMobileMenu}>League Form</NavLink></li>
                    <li><NavLink to="/schedule-form" className="dropdown-link" onClick={closeMobileMenu}>Schedule Form</NavLink></li>
                  </ul>
                )}
              </li>
              <li className="nav-item">
                <button onClick={logout} className="nav-links">Logout</button>
              </li>
            </>
          ) : (
            <li className="nav-item">
              <NavLink to="/login" className="nav-links" onClick={closeMobileMenu}>Login</NavLink>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
