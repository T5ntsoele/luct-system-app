// src/pages/pl/Rating.js
import React from 'react';

const Rating = () => {
  const mockRatings = [
    { course: 'Web Application Development', lecturer: 'Dr. Radebe', avgRating: 4.3, feedbackCount: 18, trend: '↑' },
    { course: 'Database Systems', lecturer: 'Prof. Mokoena', avgRating: 3.9, feedbackCount: 12, trend: '↓' }
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Student Rating Summary</h4>
        <button className="btn btn-outline-primary btn-sm">Export Ratings</button>
      </div>
      <p className="text-muted">Aggregated student feedback across all courses and lecturers.</p>

      <div className="row g-4">
        {mockRatings.map((item, idx) => (
          <div className="col-md-6" key={idx}>
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h6 className="card-title">{item.course}</h6>
                <p className="text-muted mb-2">Lecturer: {item.lecturer}</p>
                
                <div className="d-flex align-items-center mb-3">
                  <div className="me-3">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className="text-warning"
                        style={{ fontSize: '1.2rem' }}
                      >
                        {i < Math.floor(item.avgRating) ? '★' : '☆'}
                      </span>
                    ))}
                  </div>
                  <span className="fw-bold me-2">{item.avgRating.toFixed(1)}</span>
                  <span className="text-muted">({item.feedbackCount} reviews)</span>
                  <span className={`ms-2 ${item.trend === '↑' ? 'text-success' : 'text-danger'}`}>
                    {item.trend}
                  </span>
                </div>

                <button className="btn btn-sm btn-outline-primary">View Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {mockRatings.length === 0 && (
        <div className="text-center py-5">
          <div className="text-muted">No student ratings submitted yet.</div>
          <p className="mt-2">Ratings will appear here once students complete evaluations.</p>
        </div>
      )}
    </div>
  );
};

export default Rating;