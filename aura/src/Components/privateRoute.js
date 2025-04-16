// frontend/src/Components/PrivateRoute.js
import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { LoginContext } from './LoginContext'; // Adjust path as needed

const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useContext(LoginContext);
  const location = useLocation(); // Get current location to redirect back after login

  if (!isLoggedIn) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to in `state`. This allows us to send them back there after login.
    return <Navigate to="/login" state={{ from: location }} replace />;
    // 'replace' prevents the login page from being added to the history stack
  }

  // If logged in, render the component that was passed as children
  return children;
};

export default PrivateRoute;