// src/components/layout/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css'; // Optional — you can also use inline styles or global CSS

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>LUCT Reporting System</h4>
          <p>
            A centralized platform for students, lecturers, Principal Lecturers, and Program Leaders 
            to manage class reporting, monitoring, and feedback at Limkokwing University.
          </p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register (Students)</Link></li>
            <li><a href="mailto:liteboho.molaoa@limkokwing.ac.ls">Contact Lecturer</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <p>📧 liteboho.molaoa@limkokwing.ac.ls</p>
          <p>🏫 Faculty of ICT, Limkokwing University</p>
          <p>📍 Maseru, Lesotho</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} LUCT Reporting System. 
          Web Application Development – DIWA2110. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;