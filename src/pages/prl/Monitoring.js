import React from 'react';

const Monitoring = () => {
  return (
    <div>
      <h4>PRL Monitoring Dashboard</h4>
      <p>View attendance trends, student engagement, and lecture compliance across your stream.</p>
      <div className="alert alert-info">
        <strong>Note:</strong> Data is aggregated from all lecture reports in your faculty.
      </div>
      {/* In real app: charts or tables from /api/prl/monitoring */}
      <p>No data available yet.</p>
    </div>
  );
};

export default Monitoring;