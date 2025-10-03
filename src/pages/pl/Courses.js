import React, { useState, useEffect } from 'react';
import InputField from '../../components/ui/InputField';
import api from '../../services/api';

const Courses = () => {
  const [formData, setFormData] = useState({
    course_code: '',
    course_name: '',
    lecturer_id: ''
  });
  const [lecturers, setLecturers] = useState([]); // ✅ State for lecturers
  const [loading, setLoading] = useState(true);

  // ✅ Fetch lecturers on component mount
  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        const res = await api.get('/pl/lecturers');
        setLecturers(res.data);
      } catch (err) {
        console.error('Failed to load lecturers');
      } finally {
        setLoading(false);
      }
    };
    fetchLecturers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/pl/courses', formData);
      alert('Course assigned successfully!');
      setFormData({ course_code: '', course_name: '', lecturer_id: '' });
    } catch (err) {
      alert('Failed to assign course: ' + (err.response?.data?.message || 'Unknown error'));
    }
  };

  return (
    <div>
      <h4>Assign Course to Lecturer</h4>
      <p>Select a lecturer and assign a course module.</p>

      <div className="card mb-4">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <InputField 
              label="Course Code" 
              name="course_code" 
              value={formData.course_code} 
              onChange={handleChange} 
              required 
            />
            <InputField 
              label="Course Name" 
              name="course_name" 
              value={formData.course_name} 
              onChange={handleChange} 
              required 
            />
            
            <div className="mb-3">
              <label className="form-label">Lecturer</label>
              {loading ? (
                <p>Loading lecturers...</p>
              ) : (
                <select
                  className="form-select"
                  name="lecturer_id"
                  value={formData.lecturer_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Lecturer --</option>
                  {lecturers.map(lecturer => (
                    <option key={lecturer.id} value={lecturer.id}>
                      {lecturer.name} {lecturer.surname} ({lecturer.email})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <button type="submit" className="btn btn-primary">Assign Course</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Courses;