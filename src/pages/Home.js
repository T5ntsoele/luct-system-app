// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // We'll create this next

const Home = () => {
  const userRaw = localStorage.getItem('user');
  const user = userRaw ? JSON.parse(userRaw) : null;

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>LUCT Reporting System</h1>
          <p>A centralized platform for students, lecturers, Principal Lecturers, and Program Leaders to manage class reporting, monitoring, and feedback at Limkokwing University.</p>
          <div className="hero-buttons">
            <Link to="/login" className="btn btn-primary btn-lg">Login</Link>
            <Link to="/register" className="btn btn-outline-primary btn-lg">Register (Students)</Link>
          </div>
        </div>
      </section>

      {/* Role-Based Welcome (if logged in) */}
      {user && (
        <section className="welcome-section">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-8 text-center">
                <h3>Hello, {user.name} ({user.role.toUpperCase()})</h3>
                <p>You’re logged in. Navigate to your dashboard using the menu above.</p>
                <Link to={`/${user.role}/dashboard`} className="btn btn-success">Go to Dashboard</Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
