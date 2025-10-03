// src/pages/student/StudentDashboard.js
import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const StudentDashboard = () => {
  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-md-3">
          <div className="list-group">
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

export default StudentDashboard;