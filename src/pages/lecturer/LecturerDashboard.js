// src/pages/lecturer/LecturerDashboard.js
import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const LecturerDashboard = () => {
  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-md-3">
          <div className="list-group">
            <Link to="classes" className="list-group-item list-group-item-action">
              My Classes
            </Link>
            <Link to="reports" className="list-group-item list-group-item-action">
              Reports
            </Link>
            <Link to="reports/add" className="list-group-item list-group-item-action">
              Add Lecture Report
            </Link>
            <Link to="monitoring" className="list-group-item list-group-item-action">
              Monitoring
            </Link>
            <Link to="rating" className="list-group-item list-group-item-action">
              Rating
            </Link>
          </div>
        </div>
        <div className="col-md-9">
          <div className="card shadow-sm">
            <div className="card-body">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LecturerDashboard;