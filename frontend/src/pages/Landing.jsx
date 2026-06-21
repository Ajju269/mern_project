import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Landing() {
  const navigate = useNavigate();

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Navbar />

      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <span className="pulse-badge">
              <span className="pulse-dot"></span>
              24/7 response network
            </span>
            <h2>Help reaches you faster when the right people are listening.</h2>
            <p>
              CareConnect routes emergency requests straight to nearby volunteers,
              with live location, response status, and direct contact — no waiting
              on hold.
            </p>
            <div className="button-group">
              <button className="button button-secondary" onClick={scrollToAbout}>
                Learn more
              </button>
              <button className="button button-primary" onClick={() => navigate('/login')}>
                Get help now
              </button>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-visual-header">
              <span>Live incident feed</span>
              <span>3 active</span>
            </div>

            <div className="feed-card">
              <div className="feed-card-top">
                <span className="feed-card-title">Medical — Asha R.</span>
                <span className="status-badge status-pending">
                  <span className="pulse-dot"></span> Pending
                </span>
              </div>
              <span className="feed-card-meta">17.437, 78.448 · 2 min ago</span>
            </div>

            <div className="feed-card">
              <div className="feed-card-top">
                <span className="feed-card-title">Accident — Karthik M.</span>
                <span className="status-badge status-accepted">
                  <span className="pulse-dot"></span> Accepted
                </span>
              </div>
              <span className="feed-card-meta">17.402, 78.486 · 6 min ago</span>
            </div>

            <div className="feed-card">
              <div className="feed-card-top">
                <span className="feed-card-title">Fire — Block C</span>
                <span className="status-badge status-pending">
                  <span className="pulse-dot"></span> Pending
                </span>
              </div>
              <span className="feed-card-meta">17.411, 78.473 · just now</span>
            </div>
          </div>
        </div>
      </section>

      <main className="container">
        <section id="about" className="section">
          <span className="eyebrow">About CareConnect</span>
          <h2 className="section-title">Built for the moment help can't wait.</h2>
          <p>
            CareConnect connects people facing an emergency with nearby volunteers
            and responders. Every request carries a live location, a clear status,
            and a direct line of contact — so help isn't just dispatched, it's
            tracked until it arrives.
          </p>
        </section>

        <section id="contact" className="section">
          <span className="eyebrow">Contact</span>
          <h2 className="section-title">Reach the team</h2>
          <p>
            Questions or feedback? Email <a href="mailto:support@careconnect.com">support@careconnect.com</a>.
            For an active emergency, always call your local emergency hotline first.
          </p>
        </section>
      </main>

      <footer className="footer">
        <p>Copyright © 2026 CareConnect. All rights reserved.</p>
      </footer>
    </>
  );
}

export default Landing;
