/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Calendar as CalendarIcon, Users, Briefcase, Edit2, Trash2, X, LayoutDashboard, MessageSquare, Plus, Check } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { API_URL } from "../config";
import "./AdminPanel.css";

const SERVICES_LIST = [
  "SPA & WELLNESS",
  "FACIAL THERAPY",
  "HOLISTIC MASSAGE",
  "HOT STONE MASSAGE",
  "HAIRCUTS, STYLING & COLORING",
  "HAIR TREATMENTS",
  "FACIAL",
  "BODY MASSAGE"
];

const AdminPanel = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [appointments, setAppointments] = useState([]);
  const [users, setUsers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  // Reschedule Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newStaffId, setNewStaffId] = useState("");

  // New Appointment Modal State
  const [showAddApptModal, setShowAddApptModal] = useState(false);
  const [addApptData, setAddApptData] = useState({ 
    userId: "", 
    userName: "", // For manual entry
    service: SERVICES_LIST[0], 
    date: "", 
    time: "", 
    place: "At Parlor", 
    price: "4,676",
    staffId: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Staff State
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffRole, setNewStaffRole] = useState("");
  const [newStaffImage, setNewStaffImage] = useState("");
  const [newStaffService, setNewStaffService] = useState(SERVICES_LIST[0]);

  // Edit Staff State
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [editStaffData, setEditStaffData] = useState({ name: "", role: "", image: "", serviceKey: "" });

  const [currentDate, setCurrentDate] = useState(new Date());

  const fetchData = async () => {
    try {
      const apptRes = await fetch(`${API_URL}/appointments`);
      const apptData = await apptRes.json();
      apptData.sort((a, b) => new Date(b.date) - new Date(a.date));
      setAppointments(apptData);

      const userRes = await fetch(`${API_URL}/users`);
      setUsers(await userRes.json());

      const staffRes = await fetch(`${API_URL}/staff`);
      setStaff(await staffRes.json());

      const feedbackRes = await fetch(`${API_URL}/feedbacks`);
      const feedbackData = await feedbackRes.json();
      feedbackData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setFeedbacks(feedbackData);
    } catch (err) {
      console.error("Failed to fetch admin data", err);
    }
  };

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }
    fetchData();
  }, [user, navigate]);

  const openRescheduleModal = (appt) => {
    setSelectedAppt(appt);
    setNewDate(appt.date);
    setNewTime(appt.time);
    setNewStaffId(appt.staffId || appt.staff?.id || "");
    setShowModal(true);
  };

  const handleReschedule = async (e) => {
    e.preventDefault();
    if (!selectedAppt) return;

    try {
      const updatedAppt = { ...selectedAppt, date: newDate, time: newTime, staffId: newStaffId };
      await fetch(`${API_URL}/appointments/${selectedAppt.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedAppt)
      });

      const appStaff = staff.find(s => String(s.id) === String(newStaffId));
      const message = {
        userId: selectedAppt.userId,
        text: `Your appointment for ${selectedAppt.service} has been updated. New time: ${newDate} at ${newTime}. Assigned Specialist: ${appStaff?.name || 'Any'}.`,
        createdAt: new Date().toISOString(),
        read: false
      };
      await fetch(`${API_URL}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message)
      });

      setShowModal(false);
      fetchData();
      alert("Appointment rescheduled and user notified!");
    } catch (err) {
      console.error("Failed to reschedule", err);
    }
  };

  const handleAddAppointment = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    console.log("handleAddAppointment triggered with data:", addApptData);
    try {
      const payload = { 
        ...addApptData, 
        status: 'upcoming', 
        paymentMethod: 'Cash on Delivery' 
      };
      
      console.log("Sending payload to server:", payload);
      const res = await fetch(`${API_URL}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Failed to add appointment");
      }

      setShowAddApptModal(false);
      setAddApptData({ 
        userId: "", 
        userName: "", 
        service: SERVICES_LIST[0], 
        date: "", 
        time: "", 
        place: "At Parlor", 
        price: "4,676",
        staffId: ""
      });
      fetchData();
      alert("Appointment added!");
    } catch (err) {
      console.error("Failed to add appointment", err);
      alert(`Failed to add appointment: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e, callback) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAppointment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;
    try {
      await fetch(`${API_URL}/appointments/${id}`, { method: "DELETE" });
      fetchData();
    } catch (err) {
      console.error("Failed to delete appointment", err);
    }
  };

  const openEditStaffModal = (s) => {
    setSelectedStaff(s);
    setEditStaffData({ name: s.name, role: s.role, image: s.image, serviceKey: s.serviceKey });
    setShowStaffModal(true);
  };

  const handleEditStaff = async (e) => {
    e.preventDefault();
    if (!selectedStaff) return;
    try {
      const res = await fetch(`${API_URL}/staff/${selectedStaff.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editStaffData) // Only send the edited fields
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update staff");
      }

      setShowStaffModal(false);
      fetchData();
      alert("Staff updated!");
    } catch (err) {
      console.error("Failed to edit staff", err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/staff`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: newStaffName, 
          role: newStaffRole, 
          image: newStaffImage || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
          serviceKey: newStaffService,
          achievement: `${newStaffRole} at aura`
        })
      });

      if (!res.ok) {
        let errorMessage = "Server error";
        const resText = await res.text();
        try {
          const errorData = JSON.parse(resText);
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          errorMessage = resText.slice(0, 100) || "Unknown error";
        }
        throw new Error(errorMessage);
      }

      setNewStaffName("");
      setNewStaffRole("");
      setNewStaffImage("");
      fetchData();
      alert("New specialist added successfully!");
    } catch (err) {
      console.error("Failed to add staff", err);
      alert(`Failed to add specialist: ${err.message}`);
    }
  };

  const handleDeleteStaff = async (id) => {
    if (!window.confirm("Are you sure you want to remove this staff member?")) return;
    try {
      await fetch(`${API_URL}/staff/${id}`, { method: "DELETE" });
      fetchData();
    } catch (err) {
      console.error("Failed to delete staff", err);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await fetch(`${API_URL}/users/${id}`, { method: "DELETE" });
      fetchData();
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  const handleUpdateFeedbackStatus = async (id, status) => {
    try {
      await fetch(`${API_URL}/feedbacks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      fetchData();
    } catch (err) {
      console.error("Failed to update feedback status", err);
    }
  };

  // --- Dashboard Data Preparation ---
  const processChartData = () => {
    const dataByDate = {};
    appointments.forEach(app => {
      const dateStr = app.date; // YYYY-MM-DD
      if (!dataByDate[dateStr]) {
        dataByDate[dateStr] = { date: dateStr, revenue: 0, appointments: 0 };
      }
      dataByDate[dateStr].appointments += 1;
      const price = parseFloat(String(app.price).replace(/[^0-9.-]+/g, ""));
      if (!isNaN(price)) {
        dataByDate[dateStr].revenue += price;
      }
    });
    return Object.values(dataByDate).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-7); // Last 7 days with data
  };

  const chartData = processChartData();

  // --- Calendar Helpers ---
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayAppointments = appointments.filter(app => app.date === dateStr);

      days.push(
        <div
          key={day}
          className="calendar-day"
        >
          <span className="day-number">{day}</span>
          <div className="day-appointments">
            {dayAppointments.slice(0, 3).map(app => {
              const appUser = users.find(u => String(u.id) === String(app.userId));
              const displayName = appUser ? appUser.name : (app.userName || "Guest");
              return (
                <div key={app.id} className="mini-appt" title={`${app.time} - ${app.service}`}>
                  <div className="user-name">{displayName}</div>
                  <div className="service-name">{app.service}</div>
                </div>
              );
            })}
            {dayAppointments.length > 3 && <div className="more-appts">+{dayAppointments.length - 3} more</div>}
          </div>
        </div>
      );
    }
    return days;
  };

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  return (
    <div className="admin-page">
      <div className="admin-container">

        <div className="admin-sidebar card">
          <h3>Admin Panel</h3>
          <ul>
            <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
              <LayoutDashboard size={18} /> Dashboard
            </li>
            <li className={activeTab === 'calendar' ? 'active' : ''} onClick={() => setActiveTab('calendar')}>
              <CalendarIcon size={18} /> Schedule Calendar
            </li>
            <li className={activeTab === 'appointments' ? 'active' : ''} onClick={() => setActiveTab('appointments')}>
              <CalendarIcon size={18} /> All Appointments
            </li>
            <li className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
              <Users size={18} /> Customers
            </li>
            <li className={activeTab === 'staff' ? 'active' : ''} onClick={() => setActiveTab('staff')}>
              <Briefcase size={18} /> Staff Management
            </li>
            <li className={activeTab === 'feedbacks' ? 'active' : ''} onClick={() => setActiveTab('feedbacks')}>
              <MessageSquare size={18} /> Feedbacks
              {feedbacks.filter(f => f.status === 'pending').length > 0 && (
                <span className="badge">{feedbacks.filter(f => f.status === 'pending').length}</span>
              )}
            </li>
          </ul>
        </div>

        <div className="admin-content card">

          {activeTab === 'dashboard' && (
            <div className="tab-section dashboard-section">
              <h2>Overview Dashboard</h2>
              <div className="stats-cards">
                <div className="stat-card">
                  <h4>Total Revenue</h4>
                  <p className="stat-value">₹{chartData.reduce((acc, curr) => acc + curr.revenue, 0)}</p>
                </div>
                <div className="stat-card">
                  <h4>Total Appointments</h4>
                  <p className="stat-value">{appointments.length}</p>
                </div>
                <div className="stat-card">
                  <h4>Total Users</h4>
                  <p className="stat-value">{users.length}</p>
                </div>
                <div className="stat-card">
                  <h4>Pending Feedbacks</h4>
                  <p className="stat-value">{feedbacks.filter(f => f.status === 'pending').length}</p>
                </div>
              </div>

              <div className="charts-container">
                <div className="chart-box">
                  <h3>Revenue Chart (Last 7 Days)</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} dx={-10} />
                      <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                      <Line type="monotone" dataKey="revenue" stroke="#d4af37" strokeWidth={3} dot={{ r: 4, fill: '#d4af37', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, fill: '#2E8B57' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="chart-box">
                  <h3>Appointments (Last 7 Days)</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} dx={-10} />
                      <RechartsTooltip cursor={{ fill: '#f5f5f5' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                      <Bar dataKey="appointments" fill="#2E8B57" radius={[6, 6, 0, 0]} maxBarSize={50} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="tab-section calendar-section">
              <div className="calendar-header-actions">
                <h2>Schedule Calendar</h2>
                <button onClick={() => setShowAddApptModal(true)} className="btn-add-appt">
                  <Plus size={16} /> New Appointment
                </button>
              </div>

              <div className="calendar-controls">
                <button onClick={prevMonth}>&lt;</button>
                <h3>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                <button onClick={nextMonth}>&gt;</button>
              </div>

              <div className="calendar-grid">
                <div className="calendar-weekday">Sun</div>
                <div className="calendar-weekday">Mon</div>
                <div className="calendar-weekday">Tue</div>
                <div className="calendar-weekday">Wed</div>
                <div className="calendar-weekday">Thu</div>
                <div className="calendar-weekday">Fri</div>
                <div className="calendar-weekday">Sat</div>
                {renderCalendar()}
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className="tab-section">
              <h2>All Appointments</h2>
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Service</th>
                      <th>Date & Time</th>
                      <th>Location</th>
                      <th>Customer</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map(app => {
                      const appUser = users.find(u => String(u.id) === String(app.userId));
                      const displayName = appUser ? appUser.name : (app.userName || "Guest");
                      
                      return (
                        <tr key={app.id}>
                          <td><strong>{app.service}</strong></td>
                          <td>{app.date} at {app.time}</td>
                          <td>{app.place}</td>
                          <td>
                            <div className="customer-info">
                              <strong>{displayName}</strong>
                            </div>
                          </td>
                          <td><span className={`status ${app.status}`}>{app.status}</span></td>
                          <td>
                            <div style={{ display: 'flex', gap: '10px' }}>
                              <button onClick={() => openRescheduleModal(app)} className="btn-reschedule">
                                <Edit2 size={14} /> Reschedule
                              </button>
                              <button onClick={() => handleDeleteAppointment(app.id)} className="btn-delete">
                                <Trash2 size={14} /> Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="tab-section">
              <h2>Registered Customers</h2>
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id}>
                        <td>#{u.id}</td>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.phone}</td>
                        <td>{u.role || 'customer'}</td>
                        <td>
                          {u.role !== 'admin' && (
                            <button onClick={() => handleDeleteUser(u.id)} className="btn-delete">
                              <Trash2 size={14} /> Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'staff' && (
            <div className="tab-section">
              <h2>Staff Management</h2>

              <form onSubmit={handleAddStaff} className="add-staff-form">
                <h4>Add New Staff</h4>
                <div className="form-row" style={{ flexWrap: 'wrap' }}>
                  <input type="text" placeholder="Full Name" value={newStaffName} onChange={e => setNewStaffName(e.target.value)} required />
                  <input type="text" placeholder="Role (e.g. Therapist)" value={newStaffRole} onChange={e => setNewStaffRole(e.target.value)} required />
                  <div className="file-input-wrapper">
                    <label>Upload Profile Picture</label>
                    <input type="file" accept="image/*" onChange={e => handleFileChange(e, setNewStaffImage)} />
                  </div>
                  <select value={newStaffService} onChange={e => setNewStaffService(e.target.value)} required>
                    {SERVICES_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button type="submit">Add Specialist</button>
                </div>
              </form>

              <div className="table-responsive mt-30">
                <table>
                  <thead>
                    <tr>
                      <th>Profile</th>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Service Category</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staff.map(s => (
                      <tr key={s.id}>
                        <td>
                          <img src={s.image} alt={s.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #eee' }} />
                        </td>
                        <td><strong>{s.name}</strong></td>
                        <td>{s.role}</td>
                        <td><span className="badge-service">{s.serviceKey}</span></td>
                        <td>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => openEditStaffModal(s)} className="btn-reschedule">
                              <Edit2 size={14} /> Edit
                            </button>
                            <button onClick={() => handleDeleteStaff(s.id)} className="btn-delete">
                              <Trash2 size={14} /> Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'feedbacks' && (
            <div className="tab-section">
              <h2>Feedback Approvals</h2>
              <div className="feedback-list">
                {feedbacks.map(f => (
                  <div key={f.id} className={`feedback-card card ${f.status}`}>
                    <div className="feedback-header">
                      <div className="user-info">
                        <strong>{f.userName}</strong>
                        <span className="date">{new Date(f.createdAt).toLocaleDateString()}</span>
                      </div>
                      <span className={`status-badge ${f.status}`}>{f.status}</span>
                    </div>
                    <p className="feedback-text">"{f.text}"</p>
                    {f.status === 'pending' && (
                      <div className="feedback-actions">
                        <button onClick={() => handleUpdateFeedbackStatus(f.id, 'approved')} className="btn-approve">
                          <Check size={14} /> Approve
                        </button>
                        <button onClick={() => handleUpdateFeedbackStatus(f.id, 'rejected')} className="btn-reject">
                          <X size={14} /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                {feedbacks.length === 0 && <p className="empty-state">No feedbacks available.</p>}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Reschedule Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal card">
            <div className="modal-header">
              <h3>Reschedule Appointment</h3>
              <button onClick={() => setShowModal(false)} className="btn-close"><X size={20} /></button>
            </div>
            <form onSubmit={handleReschedule}>
              <div className="form-group">
                <label>New Date</label>
                <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>New Time</label>
                <input type="time" value={newTime} onChange={e => setNewTime(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Reassign Specialist</label>
                <select value={newStaffId} onChange={e => setNewStaffId(e.target.value)} required>
                  <option value="">Select Specialist</option>
                  {staff.map(s => <option key={s.id} value={s.id}>{s.name} ({s.role})</option>)}
                </select>
              </div>
              <button type="submit" className="btn-submit-reschedule">Update Appointment & Notify User</button>
            </form>
          </div>
        </div>
      )}

      {/* Add Appointment Modal */}
      {showAddApptModal && (
        <div className="modal-overlay">
          <div className="modal card">
            <div className="modal-header">
              <h3>Add New Appointment</h3>
              <button onClick={() => setShowAddApptModal(false)} className="btn-close"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddAppointment}>
              <div className="form-group">
                <label>Select Registered User</label>
                <select value={addApptData.userId} onChange={e => setAddApptData({ ...addApptData, userId: e.target.value, userName: "" })}>
                  <option value="">-- Select User --</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.name} (#{u.id})</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>OR Enter Manual Name</label>
                <input type="text" placeholder="Guest Name" value={addApptData.userName} onChange={e => setAddApptData({ ...addApptData, userName: e.target.value, userId: "" })} disabled={addApptData.userId !== ""} />
              </div>
              <div className="form-group">
                <label>Service</label>
                <select value={addApptData.service} onChange={e => setAddApptData({ ...addApptData, service: e.target.value })} required>
                  {SERVICES_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Assign Specialist</label>
                <select value={addApptData.staffId} onChange={e => setAddApptData({ ...addApptData, staffId: e.target.value })} required>
                  <option value="">Select Specialist</option>
                  {staff.map(s => <option key={s.id} value={s.id}>{s.name} ({s.role})</option>)}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input type="date" value={addApptData.date} onChange={e => setAddApptData({ ...addApptData, date: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input type="time" value={addApptData.time} onChange={e => setAddApptData({ ...addApptData, time: e.target.value })} required />
                </div>
              </div>
              <button type="submit" className="btn-submit-reschedule" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Appointment"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Staff Modal */}
      {showStaffModal && (
        <div className="modal-overlay">
          <div className="modal card">
            <div className="modal-header">
              <h3>Edit Specialist</h3>
              <button onClick={() => setShowStaffModal(false)} className="btn-close"><X size={20} /></button>
            </div>
            <form onSubmit={handleEditStaff}>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" value={editStaffData.name} onChange={e => setEditStaffData({ ...editStaffData, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Role</label>
                <input type="text" value={editStaffData.role} onChange={e => setEditStaffData({ ...editStaffData, role: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Profile Image</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                  <img src={editStaffData.image} alt="preview" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
                  <input type="file" accept="image/*" onChange={e => handleFileChange(e, (res) => setEditStaffData({ ...editStaffData, image: res }))} />
                </div>
              </div>
              <div className="form-group">
                <label>Service Category</label>
                <select value={editStaffData.serviceKey} onChange={e => setEditStaffData({ ...editStaffData, serviceKey: e.target.value })} required>
                  {SERVICES_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <button type="submit" className="btn-submit-reschedule">Save Changes</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPanel;
