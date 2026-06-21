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

function Dashboard() {
  const [requests, setRequests] = useState([]);
  const [volunteerName, setVolunteerName] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loadError, setLoadError] = useState('');

  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/check-auth', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.isLoggedIn) setVolunteerName(data.user.username);
      })
      .catch((err) => console.error('check-auth failed:', err));
  }, []);

  useEffect(() => {
    mapInstance.current = new google.maps.Map(mapRef.current, {
      center: { lat: 17.437462, lng: 78.448288 },
      zoom: 12
    });
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/requests', { credentials: 'include' });
      if (!response.ok) {
        setLoadError('Could not load requests. Please log in again.');
        return;
      }
      const data = await response.json();
      setRequests(data);
      placeMarkers(data);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setLoadError('Could not reach the server. Is the backend running on port 5000?');
    }
  };

  const placeMarkers = (data) => {
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    const bounds = new google.maps.LatLngBounds();
    data.forEach(req => {
      const [lat, lng] = req.location.split(',').map(Number);
      const position = { lat, lng };
      const marker = new google.maps.Marker({
        position,
        map: mapInstance.current,
        title: `${req.emergencyType} - ${req.name}`
      });
      marker.addListener('click', () => setSelectedRequest(req));
      markersRef.current.push(marker);
      bounds.extend(position);
    });

    if (markersRef.current.length > 0) {
      mapInstance.current.fitBounds(bounds);
    }
  };

  const updateStatus = async (status) => {
    try {
      const response = await fetch(`http://localhost:5000/api/requests/${selectedRequest._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
        credentials: 'include'
      });

      if (response.ok) {
        if (status === 'accepted') {
          // Open turn-by-turn directions straight to the requester's location
          const [destLat, destLng] = selectedRequest.location.split(',').map(s => s.trim());
          window.open(
            `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}&travelmode=driving`,
            '_blank'
          );
        }
        setSelectedRequest(null);
        loadRequests();
      }
    } catch (error) {
      console.error('Error updating request:', error);
    }
  };

  return (
    <>
      <Navbar />
      <main className="container dashboard-container">
        <aside className="sidebar">
          <span className="eyebrow">Volunteer</span>
          <h3>{volunteerName || '—'}</h3>
          <div className="pulse-badge" style={{ width: '100%', justifyContent: 'center' }}>
            <span className="pulse-dot"></span>
            On duty
          </div>
        </aside>

        <div className="content-grid">
          <section className="requests-list">
            <h2 className="section-title" style={{ fontSize: '1.4rem' }}>Active requests</h2>

            {loadError && <p style={{ color: '#a1402b', fontSize: '0.9rem' }}>{loadError}</p>}

            {!loadError && requests.length === 0 ? (
              <p style={{ color: 'var(--slate)' }}>No active requests yet.</p>
            ) : (
              requests.map((req) => (
                <div key={req._id} className="request-card" onClick={() => setSelectedRequest(req)}>
                  <div className="request-card-top">
                    <h3>{req.emergencyType} — {req.name}</h3>
                    <StatusBadge status={req.status} />
                  </div>
                  <p>{req.description}</p>
                </div>
              ))
            )}
          </section>

          <section className="map-container">
            <h2 className="section-title" style={{ fontSize: '1.4rem' }}>Request locations</h2>
            <div ref={mapRef} style={{ height: '380px', width: '100%', borderRadius: '10px', overflow: 'hidden' }}></div>
          </section>
        </div>
      </main>

      {selectedRequest && (
        <div className="modal" onClick={(e) => { if (e.target === e.currentTarget) setSelectedRequest(null); }}>
          <div className="modal-content">
            <button className="modal-close" onClick={() => setSelectedRequest(null)} aria-label="Close">&times;</button>
            <h2>Request details</h2>
            <p><strong>Name:</strong> {selectedRequest.name}</p>
            <p><strong>Emergency type:</strong> {selectedRequest.emergencyType}</p>
            <p><strong>Location:</strong> {selectedRequest.location}</p>
            <p><strong>Description:</strong> {selectedRequest.description}</p>
            <p><strong>Contact:</strong> {selectedRequest.email} · {selectedRequest.phone}</p>
            <p><strong>Live location sharing:</strong> {selectedRequest.shareLocation ? 'Enabled' : 'Disabled'}</p>
            <p><strong>Status:</strong> <StatusBadge status={selectedRequest.status} /></p>

            <div className="modal-actions">
              <button className="button button-primary" onClick={() => updateStatus('accepted')}>Accept &amp; navigate</button>
              <button className="button button-decline" onClick={() => updateStatus('declined')}>Decline</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboard;
