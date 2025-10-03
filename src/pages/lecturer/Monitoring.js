// src/pages/lecturer/Monitoring.js
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const Monitoring = () => {
  const [monitoringData, setMonitoringData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMonitoring = async () => {
      try {
        const res = await api.get('/lecturer/monitoring');
        setMonitoringData(res.data);
      } catch (err) {
        console.error('Failed to load monitoring data');
      } finally {
        setLoading(false);
      }
    };
    fetchMonitoring();
  }, []);

  if (loading) return <p>Loading monitoring data...</p>;

  return (
    <div>
      <h4>Lecture Attendance Monitoring</h4>
      <p>Track your class attendance over time.</p>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Date</th>
              <th>Course</th>
              <th>Students Present</th>
              <th>Attendance %</th>
            </tr>
          </thead>
          <tbody>
            {monitoringData.map((item, idx) => (
              <tr key={idx}>
                <td>{item.date_of_lecture}</td>
                <td>{item.course_name}</td>
                <td>{item.actual_students_present} / {item.total_registered_students}</td>
                <td>
                  <span className={item.attendance_pct >= 80 ? 'text-success' : 'text-warning'}>
                    {item.attendance_pct}% 
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {monitoringData.length === 0 && <p>No attendance data available.</p>}
    </div>
  );
};

export default Monitoring;