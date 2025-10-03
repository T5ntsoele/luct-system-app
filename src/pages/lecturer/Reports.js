// src/pages/lecturer/Reports.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get('/lecturer/reports');
        setReports(res.data);
      } catch (err) {
        console.error('Failed to load reports');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return <p>Loading reports...</p>;

  return (
    <div>
      <h4>My Lecture Reports</h4>
      <button 
        className="btn btn-primary btn-sm mb-3" 
        onClick={() => navigate('/lecturer/reports/new')}
      >
        + New Report
      </button>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="table-light">
            <tr>
              <th>Date</th>
              <th>Course</th>
              <th>Week</th>
              <th>Attendance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(report => (
              <tr key={report.id}>
                <td>{report.date_of_lecture}</td>
                <td>{report.course_name}</td>
                <td>Week {report.week_of_reporting}</td>
                <td>
                  {report.actual_students_present} / {report.total_registered_students}
                  {' '}({Math.round((report.actual_students_present / report.total_registered_students) * 100)}%)
                </td>
                <td>
                  <button 
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => {
                      setSelectedReport(report);
                      setShowModal(true);
                    }}
                  >
                    View Details
                  </button>
                  {report.prl_feedback && (
                    <span className="badge bg-success ms-2">Reviewed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {reports.length === 0 && <p className="text-muted">No reports submitted yet.</p>}

      {/* Report Details Modal */}
      {showModal && selectedReport && (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Report Details - {selectedReport.course_name} (Week {selectedReport.week_of_reporting})
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <p><strong>Date:</strong> {selectedReport.date_of_lecture}</p>
                    <p><strong>Faculty:</strong> {selectedReport.faculty_name}</p>
                    <p><strong>Class:</strong> {selectedReport.class_name}</p>
                    <p><strong>Venue:</strong> {selectedReport.venue}</p>
                    <p><strong>Time:</strong> {selectedReport.scheduled_time}</p>
                    <p><strong>Attendance:</strong> {selectedReport.actual_students_present} / {selectedReport.total_registered_students}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Topic Taught:</strong></p>
                    <p className="text-muted">{selectedReport.topic_taught}</p>
                    
                    {selectedReport.learning_outcomes && (
                      <>
                        <p><strong>Learning Outcomes:</strong></p>
                        <p className="text-muted">{selectedReport.learning_outcomes}</p>
                      </>
                    )}
                    
                    {selectedReport.lecturer_recommendations && (
                      <>
                        <p><strong>Recommendations:</strong></p>
                        <p className="text-muted">{selectedReport.lecturer_recommendations}</p>
                      </>
                    )}
                  </div>
                </div>
                
                {selectedReport.prl_feedback && (
                  <div className="mt-3">
                    <h6 className="text-success">PRL Feedback:</h6>
                    <div className="alert alert-success">
                      {selectedReport.prl_feedback}
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;