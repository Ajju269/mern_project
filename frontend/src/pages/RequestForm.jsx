import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';

const STATUS_LABEL = { pending: 'Pending', accepted: 'Accepted', declined: 'Declined' };

function StatusBadge({ status = 'pending' }) {
  return (
    <span className={`status-badge status-${status}`}>
      <span className="pulse-dot"></span>
      {STATUS_LABEL[status] || status}
    </span>
  );
}

function RequestForm() {
  const [name, setName] = useState('');
  const [emergencyType, setEmergencyType] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [shareLocation, setShareLocation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [myRequests, setMyRequests] = useState([]);

  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerInstance = useRef(null);

  useEffect(() => {
    const defaultLocation = { lat: 17.437462, lng: 78.448288 };

    mapInstance.current = new google.maps.Map(mapRef.current, {
      center: defaultLocation,
      zoom: 12
    });

    markerInstance.current = new google.maps.Marker({
      position: defaultLocation,
      map: mapInstance.current,
      draggable: true
    });

    markerInstance.current.addListener('dragend', () => {
      const position = markerInstance.current.getPosition();
      setLocation(`${position.lat()},${position.lng()}`);
    });

    setLocation(`${defaultLocation.lat},${defaultLocation.lng}`);
  }, []);

  // Poll for status updates on requests this user has submitted
  useEffect(() => {
    const loadMyRequests = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/requests/mine', { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          setMyRequests(data);
        }
      } catch (err) {
        console.error('Failed to load your requests:', err);
      }
    };

    loadMyRequests();
    const interval = setInterval(loadMyRequests, 8000); // check every 8 seconds for volunteer updates
    return () => clearInterval(interval);
  }, []);

  const handleGPS = (e) => {
    e.preventDefault();
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newPosition = { lat: latitude, lng: longitude };
        mapInstance.current.setCenter(newPosition);
        markerInstance.current.setPosition(newPosition);
        setLocation(`${latitude},${longitude}`);
      },
      () => alert('Unable to fetch your location. Please allow location access or enter it manually.')
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const requestData = {
      name,
      emergencyType,
      location,
      description,
      shareLocation,
      timestamp: new Date().toISOString()
    };

    try {
      const response = await fetch('http://localhost:5000/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
        credentials: 'include'
      });

      if (response.ok) {
        setName('');
        setEmergencyType('');
        setDescription('');
        setShareLocation(false);

        // refresh status list immediately so the new request shows up right away
        const refreshed = await fetch('http://localhost:5000/api/requests/mine', { credentials: 'include' });
        if (refreshed.ok) setMyRequests(await refreshed.json());
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to submit request.');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Could not reach the server. Is the backend running on port 5000?');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="container" style={{ paddingTop: '6.5rem', paddingBottom: '3rem' }}>
        <div className="form-card">
          <span className="eyebrow">Request emergency help</span>
          <h2 className="section-title">Tell us what's happening</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Your name</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="form-group">
              <label htmlFor="emergencyType">Emergency type</label>
              <select id="emergencyType" value={emergencyType} onChange={(e) => setEmergencyType(e.target.value)} required>
                <option value="" disabled>Select emergency type</option>
                <option value="Medical">Medical</option>
                <option value="Fire">Fire</option>
                <option value="Accident">Accident</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="location">Location (latitude, longitude)</label>
              <input type="text" id="location" value={location} readOnly />
              <button type="button" onClick={handleGPS} className="button button-secondary" style={{ marginTop: '0.6rem' }}>
                Use my location
              </button>
              <div ref={mapRef} style={{ height: '320px', width: '100%', marginTop: '1rem', borderRadius: '10px', overflow: 'hidden' }}></div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea id="description" rows="4" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                id="shareLocation"
                checked={shareLocation}
                onChange={(e) => setShareLocation(e.target.checked)}
                style={{ width: 'auto' }}
              />
              <label htmlFor="shareLocation" style={{ margin: 0 }}>Share live location with responders</label>
            </div>

            {error && (
              <p style={{ color: '#a1402b', fontSize: '0.9rem', marginBottom: '1rem' }}>{error}</p>
            )}

            <button type="submit" className="button button-primary" style={{ width: '100%' }} disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit request'}
            </button>
          </form>
        </div>

        {myRequests.length > 0 && (
          <div className="form-card" style={{ marginTop: '2rem' }}>
            <span className="eyebrow">Your requests</span>
            <h2 className="section-title" style={{ fontSize: '1.4rem' }}>Status updates</h2>
            <p style={{ color: 'var(--slate)', fontSize: '0.85rem', marginBottom: '1rem' }}>
              Refreshes automatically every few seconds as a volunteer responds.
            </p>

            {myRequests.map((req) => (
              <div key={req._id} className="request-card" style={{ cursor: 'default' }}>
                <div className="request-card-top">
                  <h3>{req.emergencyType}</h3>
                  <StatusBadge status={req.status} />
                </div>
                <p>{req.description}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

export default RequestForm;
