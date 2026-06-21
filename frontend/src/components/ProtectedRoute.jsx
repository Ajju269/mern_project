import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const [authStatus, setAuthStatus] = useState('checking');

  useEffect(() => {
    fetch('http://localhost:5000/api/check-auth', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setAuthStatus(data.isLoggedIn ? 'authed' : 'guest'))
      .catch((error) => {
        console.error('check-auth request failed:', error);
        setAuthStatus('error');
      });
  }, []);

  if (authStatus === 'checking') {
    return <p>Loading...</p>;
  }

  if (authStatus === 'error') {
    return <p>Could not reach the server. Is the backend running on port 5000?</p>;
  }

  if (authStatus === 'guest') {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;