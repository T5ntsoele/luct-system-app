import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [feedback, setFeedback] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get('/prl/reports');
        setReports(res.data);
        // Initialize feedback state
        const fb = {};
        res.data.forEach(r => fb[r.id] = r.prl_feedback || '');
        setFeedback(fb);
      } catch (err) {
        console.error('Failed to load reports');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleFeedbackChange = (id, value) => {
    setFeedback({ ...feedback, [id]: value });
  };

  const handleSubmitFeedback = async (id) => {
    try {
      await api.post('/prl/reports/feedback', { report_id: id, feedback: feedback[id] });
      alert('Feedback saved!');
    } catch (err) {
      alert('Failed to save feedback');
    }
  };

  if (loading) return <p>Loading reports...</p>;

  return (
    <div>
      <h4>Lecture Reports & Feedback</h4>
      {reports.map((r) => (
        <div key={r.id} className="card mb-3">
          <div className="card-body">
            <h6>{r.course_name} - Week {r.week_of_reporting} ({r.date_of_lecture})</h6>
            <p><strong>Topic:</strong> {r.topic_taught}</p>
            <p><strong>Lecturer:</strong> {r.lecturer_name}</p>
            <div className="mb-2">
              <label>Feedback to Lecturer</label>
              <textarea
                className="form-control"
                value={feedback[r.id] || ''}
                onChange={(e) => handleFeedbackChange(r.id, e.target.value)}
                rows="2"
              />
            </div>
            <button
              className="btn btn-sm btn-primary"
              onClick={() => handleSubmitFeedback(r.id)}
            >
              Save Feedback
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Reports;