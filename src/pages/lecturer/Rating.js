// src/pages/lecturer/Rating.js
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const Rating = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const res = await api.get('/lecturer/rating');
        setRatings(res.data);
      } catch (err) {
        console.error('Failed to load ratings');
      } finally {
        setLoading(false);
      }
    };
    fetchRatings();
  }, []);

  if (loading) return <p>Loading ratings...</p>;

  return (
    <div>
      <h4>Student Ratings</h4>
      <p>Feedback from your students.</p>
      {ratings.length === 0 ? (
        <p className="text-muted">No ratings yet. Students will rate your lectures after attending.</p>
      ) : (
        <div className="row g-3">
          {ratings.map((r, idx) => (
            <div className="col-md-6" key={idx}>
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <h6>{r.course_name}</h6>
                    <span className="text-warning">
                      {'★'.repeat(Math.floor(r.rating))}{'☆'.repeat(5 - Math.floor(r.rating))}
                    </span>
                  </div>
                  <p className="text-muted mb-1">Rating: {r.rating}/5</p>
                  {r.comment && <p className="mb-0">"{r.comment}"</p>}
                  <small className="text-muted">— Student, {new Date(r.created_at).toLocaleDateString()}</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Rating;