import React from 'react';

const Reports = () => {
  return (
    <div>
      <h4>Reports from Principal Lecturers</h4>
      <p>Review feedback and reports submitted by PRLs.</p>
      <div className="card">
        <div className="card-body">
          <h6>Web Development - PRL Feedback</h6>
          <p>"Lecturer needs to improve attendance tracking."</p>
          <small className="text-muted">Submitted by: Thabo Mokoena (PRL)</small>
        </div>
      </div>
    </div>
  );
};

export default Reports;