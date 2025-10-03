// src/components/layout/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png'; // Ensure this file exists in src/assets/

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login', { replace: true }); // Prevents back-button navigation to dashboard
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            src={logo}
            alt="LUCT Logo"
            height="60" // ✅ Just the number (60px)
            className="me-2 rounded"
            style={{ backgroundColor: 'white', padding: '4px' }}
          />
          <span className="fw-bold">LUCT Reporting System</span>
        </Link>

        {user ? (
          <>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <span className="nav-link text-white">
                    Hello, {user.name} ({user.role.toUpperCase()})
                  </span>
                </li>
                <li className="nav-item">
                  <button 
                    className="btn btn-outline-light btn-sm mx-2" 
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <div className="ms-auto">
            <Link to="/login" className="btn btn-outline-light btn-sm">
              Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;