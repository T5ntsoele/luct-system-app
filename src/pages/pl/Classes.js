// src/pages/pl/Classes.js
import React from 'react';

const Classes = () => {
  const mockClasses = [
    { id: 1, course: 'Web App Dev', code: 'DIWA2110', stream: 'ICT - Diploma', venue: 'Lab 3', status: 'On Track' },
    { id: 2, course: 'DB Systems', code: 'DBMS2020', stream: 'ICT - BSc', venue: 'Room 204', status: 'Delayed' }
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Faculty-Wide Classes Overview</h4>
        <button className="btn btn-outline-primary btn-sm">Generate Report</button>
      </div>
      <p className="text-muted">Monitor all classes across programs and streams.</p>

      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="table-light">
            <tr>
              <th>Course</th>
              <th>Code</th>
              <th>Program Stream</th>
              <th>Venue</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockClasses.map(cls => (
              <tr key={cls.id}>
                <td>{cls.course}</td>
                <td className="fw-bold">{cls.code}</td>
                <td>{cls.stream}</td>
                <td>{cls.venue}</td>
                <td>
                  <span className={`badge ${cls.status === 'On Track' ? 'bg-success' : 'bg-warning'}`}>
                    {cls.status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-sm btn-outline-secondary">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {mockClasses.length === 0 && (
        <div className="alert alert-info">
          No classes have been scheduled yet. Assign courses to lecturers to populate this list.
        </div>
      )}
    </div>
  );
};

export default Classes;