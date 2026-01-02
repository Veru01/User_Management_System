import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');

  const history = useHistory();
  useEffect(() => {
    // Check if user is logged in on component mount
    const loggedInStatus = localStorage.getItem('loggedIn');
    if (loggedInStatus === 'true') {
      setIsLoggedIn(true);
      const userEmail = localStorage.getItem('email');
      setEmail(userEmail);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    const userEmail = localStorage.getItem('email');
    setEmail(userEmail);
    localStorage.setItem('loggedIn', 'true'); // Store 'loggedIn' status in local storage
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail('');
    localStorage.removeItem('loggedIn'); 
    history.push('/');
  };

  const navLinkStyle = {
    position: 'relative',
  };

  const underlineStyle = {
    content: ' ',
    position: 'absolute',
    left: 0,
    bottom: -2,
    width: '100%',
    height: 2,
    backgroundColor: 'blue',
    transition: 'width 0.3s ease, opacity 0.3s ease', // Added transition for width and opacity
    opacity: 0, // Initially hide the underline
  };

  const handleMouseEnter = (e) => {
    e.target.querySelector('div').style.width = '100%'; // Expand the underline on hover
    e.target.querySelector('div').style.opacity = 1; // Show the underline on hover
  };

  const handleMouseLeave = (e) => {
    e.target.querySelector('div').style.width = 0; // Shrink the underline when not hovered
    e.target.querySelector('div').style.opacity = 0; // Hide the underline when not hovered
  };

 

  return (
    <header>
     <nav className="navbar navbar-expand-lg navbar-light" style={{backgroundColor: '#e3f2fd'}}>
        
        <div className="container-fluid">
        <NavLink
          className="navbar-brand"
          to="/home"
          style={navLinkStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Home
          <div style={underlineStyle}></div>
        </NavLink>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
      <NavLink
        className="nav-link"
        activeClassName="active"
        aria-current="page"
        to="/graph"
        style={navLinkStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        GraphView
        <div style={underlineStyle}></div>
      </NavLink>
    </li>
            </ul>
           
            {!isLoggedIn ? (
              <div className="d-flex align-items-center">
                <button className="btn btn-outline-light" onClick={handleLogin}>Login</button>
              </div>
            ) : (
              <div className="d-flex align-items-center">
       
       <button 
  className="btn btn-outline-light" 
  onClick={handleLogout} 
  style={{
    textTransform: 'uppercase',
    borderRadius: '50%',
    width: '42px',
    height: '42px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '36px',
    background: 'navy',
    color: 'white', 
    transition: 'background-color 0.3s, color 0.3s' 
  }}
  onMouseEnter={(e) => {
    e.target.style.backgroundColor = 'white'; 
    e.target.style.color = 'black'; 
  }}
  onMouseLeave={(e) => {
    e.target.style.backgroundColor = 'navy'; 
    e.target.style.color = 'white'; 
  }}
>
  {email[0]}
</button>

              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
