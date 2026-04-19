import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserCircle, Mail, Phone, Calendar, Clock, MapPin, CreditCard, LogOut, Bell } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import "./User.css";

const User = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [newFeedbackText, setNewFeedbackText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (!user) {
      navigate("/auth");
      return;
    }

    const fetchData = async () => {
      try {
        const apptRes = await fetch(`http://localhost:3001/appointments?userId=${user.id}`);
        const apptData = await apptRes.json();
        
        // Sort appointments by date descending (newest first)
        apptData.sort((a, b) => new Date(b.date) - new Date(a.date));
        setAppointments(apptData);

        const msgRes = await fetch(`http://localhost:3001/messages?userId=${user.id}`);
        const msgData = await msgRes.json();
        msgData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setMessages(msgData);

        const fbRes = await fetch(`http://localhost:3001/feedbacks?userId=${user.id}`);
        const fbData = await fbRes.json();
        fbData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setFeedbacks(fbData);
      } catch (err) {
        console.error("Error fetching user data.", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const markAsRead = async (id) => {
    try {
      await fetch(`http://localhost:3001/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true })
      });
      setMessages(messages.map(m => m.id === id ? { ...m, read: true } : m));
    } catch(err) { 
      console.error(err); 
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if(!newFeedbackText.trim()) return;

    try {
      const fbData = {
        userId: user.id || user._id || 'unknown',
        userName: user.name || 'User',
        text: newFeedbackText
      };
      
      const res = await fetch("http://localhost:3001/feedbacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fbData)
      });
      const addedFb = await res.json();
      setFeedbacks([addedFb, ...feedbacks]);
      setNewFeedbackText("");
      alert("Feedback submitted successfully! Waiting for admin approval.");
    } catch (err) {
      console.error("Failed to submit feedback", err);
    }
  };

  if (loading) {
    return <div className="user-page loading"><p>Loading profile...</p></div>;
  }

  if (!user) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = appointments.filter(app => {
    const appDate = new Date(app.date);
    return appDate >= today;
  });

  const previous = appointments.filter(app => {
    const appDate = new Date(app.date);
    return appDate < today;
  });

  const AppointmentCard = ({ app, isPast }) => (
    <div className={`appointment-card ${isPast ? 'past' : ''}`}>
      <div className="appt-header">
        <h4>{app.service}</h4>
        <span className={`status-badge ${isPast ? 'completed' : 'upcoming'}`}>
          {isPast ? 'Completed' : 'Upcoming'}
        </span>
      </div>
      <div className="appt-details">
        <div className="detail-row">
          <Calendar size={16} /> <span>{app.date}</span>
        </div>
        <div className="detail-row">
          <Clock size={16} /> <span>{app.time} {app.duration ? `(${app.duration})` : ''}</span>
        </div>
        <div className="detail-row">
          <MapPin size={16} /> <span>{app.place} {app.address ? `- ${app.address}` : ''}</span>
        </div>
        <div className="detail-row">
          <CreditCard size={16} /> <span>{app.price} • {app.paymentMethod === 'razorpay' ? 'Razorpay' : 'Cash on Delivery'}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="user-page container">
      
      <div className="profile-header card">
        <UserCircle size={80} className="profile-icon" />
        <div className="profile-info" style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
            <div>
              <h2>{user.name}</h2>
              <div className="contact-info">
                <span><Mail size={16} /> {user.email}</span>
                <span><Phone size={16} /> {user.phone}</span>
              </div>
            </div>
            <button onClick={handleLogout} className="btn-logout" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#ffebee', color: '#c62828', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', transition: 'background 0.3s' }}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="notifications-section mt-40">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Bell size={20}/> Notifications</h3>
          <div className="notifications-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {messages.map(msg => (
              <div key={msg.id} className={`notification-card card ${msg.read ? 'read' : 'unread'}`} style={{ padding: '20px', borderLeft: msg.read ? 'none' : '4px solid var(--primary)', opacity: msg.read ? 0.7 : 1 }}>
                <p style={{ margin: '0 0 10px 0', fontSize: '15px', color: 'var(--text)' }}>{msg.text}</p>
                <div className="notif-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="notif-time" style={{ fontSize: '12px', color: 'var(--light-text)' }}>{new Date(msg.createdAt).toLocaleString()}</span>
                  {!msg.read && (
                    <button onClick={() => markAsRead(msg.id)} className="btn-mark-read" style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>Mark as Read</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="appointments-section mt-40">
        <h3>Upcoming Appointments</h3>
        {upcoming.length > 0 ? (
          <div className="appointments-grid">
            {upcoming.map(app => <AppointmentCard key={app.id} app={app} isPast={false} />)}
          </div>
        ) : (
          <div className="empty-state">No upcoming appointments.</div>
        )}
      </div>

      <div className="appointments-section mt-40">
        <h3>Previous Appointments</h3>
        {previous.length > 0 ? (
          <div className="appointments-grid">
            {previous.map(app => <AppointmentCard key={app.id} app={app} isPast={true} />)}
          </div>
        ) : (
          <div className="empty-state">No past appointments.</div>
        )}
      </div>

      <div className="feedback-section mt-40 card">
        <h3>My Feedbacks</h3>
        
        <form className="feedback-form" onSubmit={handleSubmitFeedback}>
          <textarea 
            placeholder="Share your experience with us..." 
            value={newFeedbackText} 
            onChange={(e) => setNewFeedbackText(e.target.value)}
            rows={3}
            required
          ></textarea>
          <button type="submit" className="btn-submit-feedback">Submit Feedback</button>
        </form>

        {feedbacks.length > 0 && (
          <div className="feedback-history mt-20">
            <h4>Feedback History</h4>
            <div className="feedback-list">
              {feedbacks.map(fb => (
                <div key={fb.id} className={`feedback-item ${fb.status}`}>
                  <div className="fb-header">
                    <span className="fb-date">{new Date(fb.createdAt).toLocaleDateString()}</span>
                    <span className={`status-badge ${fb.status}`}>{fb.status}</span>
                  </div>
                  <p className="fb-text">"{fb.text}"</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default User;
