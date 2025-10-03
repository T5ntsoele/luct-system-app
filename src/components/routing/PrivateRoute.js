// src/components/routing/PrivateRoute.js
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ allowedRoles = [] }) => {
  const token = localStorage.getItem('token');
  const userJSON = localStorage.getItem('user');

  // If no token → not logged in
  if (!token || !userJSON) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userJSON);

  // If allowedRoles is provided, check if user.role is in it
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect based on role or to home
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  // If all checks pass → render the child route (Outlet)
  return <Outlet />;
};

export default PrivateRoute;