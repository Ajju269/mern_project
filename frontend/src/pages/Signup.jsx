import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Signup() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userType, username, email, phone, password })
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/login');
      } else {
        setError(data.message || 'Signup failed.');
      }
    } catch (err) {
      console.error('Signup error:', err);
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
          <h2 className="section-title">Create your account</h2>
          <p className="auth-subtitle">Join as someone who needs help, or someone who gives it.</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="signup-user-type">I am a</label>
              <select id="signup-user-type" value={userType} onChange={(e) => setUserType(e.target.value)} required>
                <option value="" disabled>Select your role</option>
                <option value="volunteer">Volunteer</option>
                <option value="user">User</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="signup-name">Name</label>
              <input id="signup-name" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="signup-email">Email</label>
              <input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="signup-phone">Phone number</label>
              <input id="signup-phone" type="tel" placeholder="e.g., +1234567890" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="signup-password">Password</label>
              <input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            {error && (
              <p style={{ color: '#a1402b', fontSize: '0.9rem', marginBottom: '1rem' }}>{error}</p>
            )}

            <button type="submit" className="button button-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Creating account…' : 'Sign up'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Signup;
