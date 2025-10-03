import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/prl/courses');
        setCourses(res.data);
      } catch (err) {
        console.error('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) return <p>Loading courses...</p>;

  return (
    <div>
      <h4>📚 Courses & Lectures Under My Stream</h4>
      <p className="text-muted mb-4">Courses assigned to lecturers in your faculty that you supervise as PRL.</p>
      
      {courses.length > 0 ? (
        <>
          <div className="alert alert-info">
            <strong>📊 Summary:</strong> You are supervising <strong>{courses.length}</strong> course(s) in your faculty.
          </div>
          
          <div className="table-responsive mt-3">
            <table className="table table-hover table-striped">
              <thead className="table-dark">
                <tr>
                  <th>🏷️ Course Code</th>
                  <th>📖 Course Name</th>
                  <th>👨‍🏫 Assigned Lecturer</th>
                  <th>🏫 Faculty</th>
                  <th>📊 Status</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <span className="badge bg-primary text-white px-3 py-2">
                        {c.course_code}
                      </span>
                    </td>
                    <td>
                      <strong>{c.course_name}</strong>
                    </td>
                    <td>
                      {c.lecturer_name ? (
                        <span className="text-success">
                          <i className="fas fa-user-check"></i> {c.lecturer_name}
                        </span>
                      ) : (
                        <span className="text-warning">
                          <i className="fas fa-exclamation-triangle"></i> No lecturer assigned
                        </span>
                      )}
                    </td>
                    <td>
                      <span className="badge bg-secondary">{c.faculty}</span>
                    </td>
                    <td>
                      {c.lecturer_name ? (
                        <span className="badge bg-success">✅ Active</span>
                      ) : (
                        <span className="badge bg-warning">⚠️ Needs Lecturer</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="card mt-4">
            <div className="card-header bg-light">
              <h6 className="mb-0">💡 Quick Actions</h6>
            </div>
            <div className="card-body">
              <p className="mb-2"><strong>As PRL, you can:</strong></p>
              <ul className="mb-0">
                <li>📝 View and review lecture reports from these courses</li>
                <li>💬 Add feedback to lecturer reports</li>
                <li>📊 Monitor attendance trends across your faculty</li>
                <li>⭐ Review student ratings and feedback</li>
              </ul>
            </div>
          </div>
        </>
      ) : (
        <div className="alert alert-warning">
          <h5>📭 No Courses Found</h5>
          <p className="mb-0">
            No courses have been assigned in your faculty yet. 
            Contact your Program Leader (PL) to assign courses to lecturers.
          </p>
        </div>
      )}
    </div>
  );
};

export default Courses;