import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AddLectureReport = () => {
  const [formData, setFormData] = useState({
    course_id: '',
    date_of_lecture: '',
    week_of_reporting: '',
    topic_taught: '',
    actual_students_present: '',
    total_registered_students: ''
  });
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/lecturer/courses');
        setCourses(res.data);
      } catch (err) {
        console.error('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/lecturer/reports', formData);
      alert('Lecture report submitted successfully!');
      setFormData({
        course_id: '',
        date_of_lecture: '',
        week_of_reporting: '',
        topic_taught: '',
        actual_students_present: '',
        total_registered_students: ''
      });
    } catch (err) {
      alert('Failed to submit report: ' + (err.response?.data?.message || 'Unknown error'));
    }
  };

  return (
    <div>
      <h4>Add Lecture Report</h4>
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Course</label>
              {loading ? (
                <p>Loading courses...</p>
              ) : (
                <select
                  className="form-select"
                  name="course_id"
                  value={formData.course_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Course --</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.course_name} ({course.course_code})
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Date of Lecture</label>
              <input type="date" className="form-control" name="date_of_lecture" value={formData.date_of_lecture} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Week of Reporting</label>
              <input type="number" className="form-control" name="week_of_reporting" value={formData.week_of_reporting} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Topic Taught</label>
              <input type="text" className="form-control" name="topic_taught" value={formData.topic_taught} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Actual Students Present</label>
              <input type="number" className="form-control" name="actual_students_present" value={formData.actual_students_present} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Total Registered Students</label>
              <input type="number" className="form-control" name="total_registered_students" value={formData.total_registered_students} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-primary">Submit Report</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddLectureReport;
