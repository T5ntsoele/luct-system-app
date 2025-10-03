// src/pages/lecturer/Classes.js
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await api.get('/lecturer/classes');
        setClasses(res.data);
      } catch (err) {
        console.error('Failed to load classes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  if (loading) return <p>Loading classes...</p>;

  return (
    <div>
      <h3 className="mb-4">My Classes</h3>
      <div className="row">
        {classes.map(cls => (
          <div className="col-md-6 mb-4" key={cls.id}>
            <div className="card h-100 border-left-primary">
              <div className="card-body">
                <h5 className="card-title">{cls.course_code} - {cls.course_name}</h5>
                <p className="card-text">
                  <strong>Faculty:</strong> {cls.faculty}<br />
                  <strong>Course ID:</strong> {cls.id}
                </p>
                <button className="btn btn-outline-primary btn-sm">View Reports</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {classes.length === 0 && !loading && (
        <p className="text-muted">No classes assigned yet.</p>
      )}
    </div>
  );
};

export default Classes;