// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Student
import StudentDashboard from './pages/student/StudentDashboard';
import StudentMonitoring from './pages/student/Monitoring';
import StudentRating from './pages/student/Rating';

// Lecturer
import LecturerDashboard from './pages/lecturer/LecturerDashboard';
import LecturerClasses from './pages/lecturer/Classes';
import LecturerReports from './pages/lecturer/Reports';
import LecturerMonitoring from './pages/lecturer/Monitoring';
import LecturerRating from './pages/lecturer/Rating';
import NewReport from './pages/lecturer/NewReport';
import AddLectureReport from './pages/lecturer/AddLectureReport';

// PRL
import PRLDashboard from './pages/prl/PRLDashboard';
import PRLCourses from './pages/prl/Courses';
import PRLReports from './pages/prl/Reports';
import PRLMonitoring from './pages/prl/Monitoring';
import PRLRating from './pages/prl/Rating';
import PRLClasses from './pages/prl/Classes';

// PL
import PLDashboard from './pages/pl/PLDashboard';
import PLCourses from './pages/pl/Courses';
import PLReports from './pages/pl/Reports';
import PLMonitoring from './pages/pl/Monitoring';
import PLLectures from './pages/pl/Lectures';
import PLClasses from './pages/pl/Classes';
import PLRating from './pages/pl/Rating';

// Utils
import PrivateRoute from './components/routing/PrivateRoute';
import { ROLES } from './utils/roles';

const App = () => {
  const userRaw = localStorage.getItem('user');
  const user = userRaw ? JSON.parse(userRaw) : null;

  return (
    <BrowserRouter>
      <Navbar user={user} />
      <div className="flex-grow-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student Routes - Protected */}
          <Route element={<PrivateRoute allowedRoles={[ROLES.STUDENT]} />}>
            <Route path="/student/dashboard" element={<StudentDashboard />}>
              <Route index element={<StudentMonitoring />} />
              <Route path="monitoring" element={<StudentMonitoring />} />
              <Route path="rating" element={<StudentRating />} />
            </Route>
          </Route>

          {/* Lecturer Routes - Protected */}
          <Route element={<PrivateRoute allowedRoles={[ROLES.LECTURER]} />}>
            <Route path="/lecturer/dashboard" element={<LecturerDashboard />}>
              <Route index element={<LecturerClasses />} />
              <Route path="classes" element={<LecturerClasses />} />
              <Route path="reports" element={<LecturerReports />} />
              <Route path="reports/new" element={<NewReport />} /> {/* ✅ NEW */}
              <Route path="reports/add" element={<AddLectureReport />} />
              <Route path="monitoring" element={<LecturerMonitoring />} />
              <Route path="rating" element={<LecturerRating />} />
            </Route>
          </Route>

          {/* ✅ PRL Routes - FULLY ENABLED */}
          <Route element={<PrivateRoute allowedRoles={[ROLES.PRL]} />}>
            <Route path="/prl/dashboard" element={<PRLDashboard />}>
              <Route index element={<PRLCourses />} />
              <Route path="courses" element={<PRLCourses />} />
              <Route path="reports" element={<PRLReports />} />
              <Route path="monitoring" element={<PRLMonitoring />} />
              <Route path="rating" element={<PRLRating />} />
              <Route path="classes" element={<PRLClasses />} />
            </Route>
          </Route>

          {/* ✅ PL Routes - FULLY ENABLED */}
          <Route element={<PrivateRoute allowedRoles={[ROLES.PL]} />}>
            <Route path="/pl/dashboard" element={<PLDashboard />}>
              <Route index element={<PLCourses />} />
              <Route path="courses" element={<PLCourses />} />
              <Route path="reports" element={<PLReports />} />
              <Route path="monitoring" element={<PLMonitoring />} />
              <Route path="lectures" element={<PLLectures />} />
              <Route path="classes" element={<PLClasses />} />
              <Route path="rating" element={<PLRating />} />
            </Route>
          </Route>

          {/* Catch-all: redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
};

export default App;