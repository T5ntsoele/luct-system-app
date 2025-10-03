// src/pages/student/Rating.js
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const Rating = () => {
  const [lectureReports, setLectureReports] = useState([]);
  const [selectedReportId, setSelectedReportId] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch lecture reports the student can rate
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get('/student/monitoring');
        setLectureReports(res.data);
      } catch (err) {
        console.error('Failed to load lectures');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleStarClick = (value) => {
    setRating(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedReportId || rating === 0) {
      alert('Please select a lecture and provide a rating.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/student/rating', {
        lecture_report_id: selectedReportId,
        rating,
        comment: comment.trim() || null
      });
      alert('Thank you! Your rating has been submitted.');
      // Reset form
      setSelectedReportId('');
      setRating(0);
      setComment('');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit rating. You may have already rated this lecture.';
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h4>Rate Your Lecture</h4>
      <p>Provide feedback to help improve teaching quality.</p>

      {loading ? (
        <p>Loading your lectures...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Select Lecture</label>
            <select
              className="form-select"
              value={selectedReportId}
              onChange={(e) => setSelectedReportId(e.target.value)}
              required
            >
              <option value="">-- Choose a lecture you attended --</option>
              {lectureReports.map(report => (
                <option key={report.id} value={report.id}>
                  {report.course} - Week {report.week} ({report.date})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Your Rating</label>
            <div className="d-flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => handleStarClick(star)}
                  style={{
                    fontSize: '2rem',
                    cursor: 'pointer',
                    color: star <= rating ? '#ffc107' : '#e4e5e6'
                  }}
                >
                  ★
                </span>
              ))}
            </div>
            <small className="text-muted">Click to select (1 = Poor, 5 = Excellent)</small>
          </div>

          <div className="mb-3">
            <label className="form-label">Comments (Optional)</label>
            <textarea
              className="form-control"
              rows="3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you like or think could be improved?"
            />
          </div>

          <button
            type="submit"
            className="btn btn-success"
            disabled={!selectedReportId || rating === 0 || submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Rating'}
          </button>
        </form>
      )}
    </div>
  );
};

export default Rating;