// src/pages/student/Monitoring.js
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const Monitoring = () => {
  const [monitoringData, setMonitoringData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState({}); // map of reportId -> boolean

  useEffect(() => {
    const fetchMonitoring = async () => {
      try {
        const res = await api.get('/student/monitoring');
        setMonitoringData(res.data);
      } catch (err) {
        console.error('Failed to load monitoring data');
      } finally {
        setLoading(false);
      }
    };
    fetchMonitoring();
  }, []);

  const markPresent = async (reportId) => {
    try {
      setSubmitting((s) => ({ ...s, [reportId]: true }));
      await api.post('/student/attendance', { lecture_report_id: reportId });
      // Refresh data after successful submission
      const res = await api.get('/student/monitoring');
      setMonitoringData(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit attendance');
    } finally {
      setSubmitting((s) => ({ ...s, [reportId]: false }));
    }
  };

  if (loading) return <p>Loading monitoring data...</p>;

  return (
    <div>
      <h3 className="mb-4">Monitoring Dashboard</h3>
      <p>Track your lecture attendance and progress below.</p>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="table-light">
            <tr>
              <th>Course</th>
              <th>Code</th>
              <th>Date</th>
              <th>Week</th>
              <th>Topic</th>
              <th>Attendance</th>
              <th>Lecturer</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {monitoringData.map((item) => (
              <tr key={item.id}>
                <td>{item.course}</td>
                <td className="fw-bold">{item.course_code}</td>
                <td>{item.date}</td>
                <td>Week {item.week}</td>
                <td>{item.topic}</td>
                <td>{item.actual_students_present} / {item.total_registered_students}</td>
                <td>{item.lecturer}</td>
                <td>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => markPresent(item.id)}
                    disabled={!!submitting[item.id]}
                  >
                    {submitting[item.id] ? 'Submitting...' : 'Mark Present'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {monitoringData.length === 0 && !loading && <p className="text-muted">No monitoring data available.</p>}
    </div>
  );
};

export default Monitoring;