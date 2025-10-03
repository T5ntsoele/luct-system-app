// src/pages/prl/PRLDashboard.js
import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const PRLDashboard = () => {
  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-md-3">
          <div className="list-group">
            <Link to="courses" className="list-group-item list-group-item-action">Courses</Link>
            <Link to="reports" className="list-group-item list-group-item-action">Reports</Link>
            <Link to="monitoring" className="list-group-item list-group-item-action">Monitoring</Link>
            <Link to="rating" className="list-group-item list-group-item-action">Rating</Link>
            <Link to="classes" className="list-group-item list-group-item-action">Classes</Link>
          </div>
        </div>
        <div className="col-md-9">
          <div className="card shadow-sm">
            <div className="card-body">
              <h4>Principal Lecturer Dashboard</h4>
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PRLDashboard;