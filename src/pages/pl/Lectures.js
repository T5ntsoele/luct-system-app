import React, { useState, useEffect } from 'react';
import InputField from '../../components/ui/InputField';
import api from '../../services/api';

const Lectures = () => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: ''
  });
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fetch lecturers on component mount
  useEffect(() => {
    fetchLecturers();
  }, []);

  const fetchLecturers = async () => {
    try {
      const res = await api.get('/pl/lecturers');
      setLecturers(res.data);
    } catch (err) {
      console.error('Failed to load lecturers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/pl/lectures', formData); // Backend derives faculty from token
      alert('Lecturer added successfully!');
      setFormData({ name: '', surname: '', email: '' });
      // Refresh the lecturers list
      fetchLecturers();
    } catch (err) {
      alert('Failed to add lecturer: ' + (err.response?.data?.message || 'Unknown error'));
    }
  };

  return (
    <div>
      <h4>Manage Lecturers</h4>
      <p>Add or assign lecturers to courses.</p>

      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          Add New Lecturer
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <InputField label="First Name" name="name" value={formData.name} onChange={handleChange} required />
            <InputField label="Surname" name="surname" value={formData.surname} onChange={handleChange} required />
            <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            <button type="submit" className="btn btn-primary">Add Lecturer</button>
          </form>
        </div>
      </div>

      {/* Existing Lecturers List */}
      <div className="card">
        <div className="card-header bg-info text-white">
          <h5 className="mb-0">All Lecturers</h5>
        </div>
        <div className="card-body">
          {loading ? (
            <p>Loading lecturers...</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Faculty</th>
                    <th>Added Date</th>
                  </tr>
                </thead>
                <tbody>
                  {lecturers.map((lecturer) => (
                    <tr key={lecturer.id}>
                      <td>
                        <strong>{lecturer.name} {lecturer.surname}</strong>
                        {lecturer.name === 'Thabo' && (
                          <span className="badge bg-success ms-2">Recently Added</span>
                        )}
                      </td>
                      <td>{lecturer.email}</td>
                      <td>
                        <span className="badge bg-secondary">{lecturer.faculty}</span>
                      </td>
                      <td>
                        {lecturer.created_at ? new Date(lecturer.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {lecturers.length === 0 && !loading && (
            <p className="text-muted">No lecturers found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Lectures;
