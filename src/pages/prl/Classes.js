// src/pages/prl/Classes.js
import React from 'react';

const Classes = () => {
  // In real app: fetch from /api/prl/classes
  const mockClasses = [
    { id: 1, course: 'Web Application Development', code: 'DIWA2110', venue: 'Lab 3', time: 'Mon 10:00–12:00', lecturer: 'Dr. Radebe' },
    { id: 2, course: 'Database Systems', code: 'DBMS2020', venue: 'Room 204', time: 'Wed 14:00–16:00', lecturer: 'Prof. Mokoena' }
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Classes Under My Stream</h4>
        <button className="btn btn-outline-primary btn-sm">Export to Excel</button>
      </div>
      <p className="text-muted">View scheduled classes, venues, and assigned lecturers in your faculty.</p>

      <div className="row g-4">
        {mockClasses.map(cls => (
          <div className="col-md-6" key={cls.id}>
            <div className="card border-left-primary h-100 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="card-title mb-1">{cls.course}</h6>
                    <p className="text-muted mb-2">{cls.code}</p>
                  </div>
                  <span className="badge bg-primary">Active</span>
                </div>
                <ul className="list-unstyled mb-0">
                  <li><strong>Venue:</strong> {cls.venue}</li>
                  <li><strong>Time:</strong> {cls.time}</li>
                  <li><strong>Lecturer:</strong> {cls.lecturer}</li>
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {mockClasses.length === 0 && (
        <div className="text-center py-5">
          <div className="text-muted">No classes found in your stream.</div>
        </div>
      )}
    </div>
  );
};

export default Classes;