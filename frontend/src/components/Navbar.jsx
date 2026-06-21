import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/download.jpg';

function Navbar() {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState({ checked: false, isLoggedIn: false, userType: null });

  useEffect(() => {
    fetch('http://localhost:5000/api/check-auth', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setAuthState({
          checked: true,
          isLoggedIn: data.isLoggedIn,
          userType: data.isLoggedIn ? data.user.userType : null
        });
      })
      .catch(() => setAuthState({ checked: true, isLoggedIn: false, userType: null }));
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/api/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      navigate('/login');
    }
  };

  return (
    <header className="header">
      <nav className="nav container">
        <Link to="/" className="logo">
          <img src={logo} alt="CareConnect Logo" className="logo-image" />
          <h1>CareConnect</h1>
        </Link>
        <ul className="nav-links">
          <li className="pulse-badge">
            <span className="pulse-dot"></span>
            Network active
          </li>
          <li><Link to="/" className="nav-link">Home</Link></li>

          {authState.checked && authState.isLoggedIn ? (
            <>
              <li>
                <Link to={authState.userType === 'volunteer' ? '/dashboard' : '/request'} className="nav-link">
                  {authState.userType === 'volunteer' ? 'Dashboard' : 'Request help'}
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="button button-secondary" style={{ padding: '0.5rem 1.1rem' }}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li><Link to="/login" className="nav-link">Login</Link></li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
