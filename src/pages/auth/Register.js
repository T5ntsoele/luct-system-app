// src/pages/auth/Register.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputField from '../../components/ui/InputField';
import api from '../../services/api';

const ROLES = [
  { value: 'student', label: 'Student' },
  { value: 'lecturer', label: 'Lecturer' },
  { value: 'prl', label: 'Principal Lecturer (PRL)' },
  { value: 'pl', label: 'Program Leader (PL)' }
];

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    studentNumber: '', // Only required for students
    faculty: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // For students, studentNumber is required
    if (formData.role === 'student' && !formData.studentNumber) {
      setError('Student Number is required');
      return;
    }

    try {
      await api.post('/auth/register', {
        name: formData.name,
        surname: formData.surname,
        email: formData.email,
        studentNumber: formData.role === 'student' ? formData.studentNumber : null,
        faculty: formData.faculty,
        password: formData.password,
        role: formData.role
      });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <div className="card shadow">
        <div className="card-header bg-primary text-white text-center">
          <h4>LUCT Reporting System — Register</h4>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <InputField label="First Name" name="name" value={formData.name} onChange={handleChange} required />
            <InputField label="Surname" name="surname" value={formData.surname} onChange={handleChange} required />
            <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            
            {formData.role === 'student' && (
              <InputField 
                label="Student Number" 
                name="studentNumber" 
                value={formData.studentNumber} 
                onChange={handleChange} 
                required 
              />
            )}

            <InputField label="Faculty" name="faculty" value={formData.faculty} onChange={handleChange} required />

            <div className="mb-3">
              <label className="form-label">Role</label>
              <select
                className="form-select"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                {ROLES.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>

            <InputField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required />
            <InputField label="Confirm Password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required />
            
            <button type="submit" className="btn btn-primary w-100">Register</button>
          </form>
          <div className="text-center mt-3">
            <p>Already have an account? <Link to="/login">Login here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;