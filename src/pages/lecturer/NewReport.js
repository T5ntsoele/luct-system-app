// src/pages/lecturer/NewReport.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const NewReport = () => {
  const [formData, setFormData] = useState({
    facultyName: '',
    className: '',
    weekOfReporting: '',
    dateOfLecture: '',
    courseId: '',
    actualStudentsPresent: '',
    totalRegisteredStudents: '',
    venue: '',
    scheduledTime: '',
    topicTaught: '',
    learningOutcomes: '',
    lecturerRecommendations: ''
  });
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  // Fetch lecturer's courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/lecturer/classes');
        setCourses(res.data);
      } catch (err) {
        console.error('Failed to load courses');
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
      alert('Report submitted successfully!');
      navigate('/lecturer/reports');
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || 'Unknown error'));
    }
  };

  return (
    <div>
      <h4>Lecturer Reporting Form</h4>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label>Faculty Name</label>
              <input
                type="text"
                className="form-control"
                name="facultyName"
                value={formData.facultyName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label>Class Name</label>
              <input
                type="text"
                className="form-control"
                name="className"
                value={formData.className}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label>Week of Reporting</label>
              <input
                type="number"
                className="form-control"
                name="weekOfReporting"
                value={formData.weekOfReporting}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label>Date of Lecture</label>
              <input
                type="date"
                className="form-control"
                name="dateOfLecture"
                value={formData.dateOfLecture}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label>Course</label>
              <select
                className="form-select"
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Course --</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.course_code} - {course.course_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label>Actual Students Present</label>
              <input
                type="number"
                className="form-control"
                name="actualStudentsPresent"
                value={formData.actualStudentsPresent}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label>Total Registered Students</label>
              <input
                type="number"
                className="form-control"
                name="totalRegisteredStudents"
                value={formData.totalRegisteredStudents}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label>Venue of the Class</label>
              <input
                type="text"
                className="form-control"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label>Scheduled Lecture Time</label>
              <input
                type="text"
                className="form-control"
                name="scheduledTime"
                placeholder="e.g., 10:00 - 12:00"
                value={formData.scheduledTime}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label>Topic Taught</label>
              <textarea
                className="form-control"
                name="topicTaught"
                value={formData.topicTaught}
                onChange={handleChange}
                required
                rows="2"
              />
            </div>
            <div className="mb-3">
              <label>Learning Outcomes</label>
              <textarea
                className="form-control"
                name="learningOutcomes"
                value={formData.learningOutcomes}
                onChange={handleChange}
                rows="2"
              />
            </div>
            <div className="mb-3">
              <label>Lecturer’s Recommendations</label>
              <textarea
                className="form-control"
                name="lecturerRecommendations"
                value={formData.lecturerRecommendations}
                onChange={handleChange}
                rows="2"
              />
            </div>
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Submit Report</button>
      </form>
    </div>
  );
};

export default NewReport;