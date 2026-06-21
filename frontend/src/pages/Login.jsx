import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Login() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        navigate(userType === 'volunteer' ? '/dashboard' : '/request');
      } else {
        setError(data.message || 'Invalid credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Could not reach the server. Is the backend running on port 5000?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="auth-wrapper">
        <div className="auth-card">
          <h2 className="section-title">Welcome back</h2>
          <p className="auth-subtitle">Log in to request help or respond to one.</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="user-type">I am a</label>
              <select id="user-type" value={userType} onChange={(e) => setUserType(e.target.value)} required>
                <option value="" disabled>Select your role</option>
                <option value="volunteer">Volunteer</option>
                <option value="user">User</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            {error && (
              <p style={{ color: '#a1402b', fontSize: '0.9rem', marginBottom: '1rem' }}>{error}</p>
            )}

            <button type="submit" className="button button-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Logging in…' : 'Log in'}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;
