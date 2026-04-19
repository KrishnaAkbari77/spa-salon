/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Calendar as CalendarIcon, Users, Briefcase, Edit2, Trash2, X, LayoutDashboard, MessageSquare, Plus, Check } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import "./AdminPanel.css";

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

  // New Appointment Modal State
  const [showAddApptModal, setShowAddApptModal] = useState(false);
  const [addApptData, setAddApptData] = useState({ userId: "", service: "", date: "", time: "", place: "Salon", price: "50" });

  // New Staff State
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffRole, setNewStaffRole] = useState("");
  const [newStaffPhone, setNewStaffPhone] = useState("");

  const [currentDate, setCurrentDate] = useState(new Date());

  const fetchData = async () => {
    try {
      const apptRes = await fetch("http://localhost:3001/appointments");
      const apptData = await apptRes.json();
      apptData.sort((a, b) => new Date(b.date) - new Date(a.date));
      setAppointments(apptData);

      const userRes = await fetch("http://localhost:3001/users");
      setUsers(await userRes.json());

      const staffRes = await fetch("http://localhost:3001/staff");
      setStaff(await staffRes.json());

      const feedbackRes = await fetch("http://localhost:3001/feedbacks");
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
    setShowModal(true);
  };

  const handleReschedule = async (e) => {
    e.preventDefault();
    if (!selectedAppt) return;

    try {
      const updatedAppt = { ...selectedAppt, date: newDate, time: newTime };
      await fetch(`http://localhost:3001/appointments/${selectedAppt.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedAppt)
      });

      const message = {
        userId: selectedAppt.userId,
        text: `Your appointment for ${selectedAppt.service} has been rescheduled by the admin to ${newDate} at ${newTime}.`,
        createdAt: new Date().toISOString(),
        read: false
      };
      await fetch("http://localhost:3001/messages", {
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
    try {
      await fetch("http://localhost:3001/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...addApptData, status: 'upcoming' })
      });
      setShowAddApptModal(false);
      fetchData();
      alert("Appointment added!");
    } catch (err) {
      console.error("Failed to add appointment", err);
    }
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    try {
      await fetch("http://localhost:3001/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newStaffName, role: newStaffRole, phone: newStaffPhone })
      });
      setNewStaffName("");
      setNewStaffRole("");
      setNewStaffPhone("");
      fetchData();
    } catch (err) {
      console.error("Failed to add staff", err);
    }
  };

  const handleDeleteStaff = async (id) => {
    if (!window.confirm("Are you sure you want to remove this staff member?")) return;
    try {
      await fetch(`http://localhost:3001/staff/${id}`, { method: "DELETE" });
      fetchData();
    } catch (err) {
      console.error("Failed to delete staff", err);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await fetch(`http://localhost:3001/users/${id}`, { method: "DELETE" });
      fetchData();
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  const handleUpdateFeedbackStatus = async (id, status) => {
    try {
      await fetch(`http://localhost:3001/feedbacks/${id}`, {
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
          onClick={() => {
            setAddApptData({ ...addApptData, date: dateStr });
            setShowAddApptModal(true);
          }}
        >
          <span className="day-number">{day}</span>
          <div className="day-appointments">
            {dayAppointments.slice(0, 3).map(app => (
              <div key={app.id} className="mini-appt" title={`${app.time} - ${app.service}`}>
                <div className="mini-avatar">{users.find(u => String(u.id) === String(app.userId))?.name?.charAt(0) || 'U'}</div>
                <span>{app.time}</span>
              </div>
            ))}
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
                      <th>User ID</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map(app => (
                      <tr key={app.id}>
                        <td><strong>{app.service}</strong></td>
                        <td>{app.date} at {app.time}</td>
                        <td>{app.place}</td>
                        <td>#{app.userId}</td>
                        <td><span className={`status ${app.status}`}>{app.status}</span></td>
                        <td>
                          <button onClick={() => openRescheduleModal(app)} className="btn-reschedule">
                            <Edit2 size={14} /> Reschedule
                          </button>
                        </td>
                      </tr>
                    ))}
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
                <div className="form-row">
                  <input type="text" placeholder="Full Name" value={newStaffName} onChange={e => setNewStaffName(e.target.value)} required />
                  <input type="text" placeholder="Role (e.g. Therapist)" value={newStaffRole} onChange={e => setNewStaffRole(e.target.value)} required />
                  <input type="text" placeholder="Phone" value={newStaffPhone} onChange={e => setNewStaffPhone(e.target.value)} required />
                  <button type="submit">Add</button>
                </div>
              </form>

              <div className="table-responsive mt-30">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Phone</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staff.map(s => (
                      <tr key={s.id}>
                        <td><strong>{s.name}</strong></td>
                        <td>{s.role}</td>
                        <td>{s.phone}</td>
                        <td>
                          <button onClick={() => handleDeleteStaff(s.id)} className="btn-delete">
                            <Trash2 size={14} /> Remove
                          </button>
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
              <button type="submit" className="btn-submit-reschedule">Confirm Reschedule & Notify User</button>
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
                <label>User ID</label>
                <select value={addApptData.userId} onChange={e => setAddApptData({ ...addApptData, userId: e.target.value })} required>
                  <option value="">Select User</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.name} (#{u.id})</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Service</label>
                <input type="text" placeholder="e.g. Swedish Massage" value={addApptData.service} onChange={e => setAddApptData({ ...addApptData, service: e.target.value })} required />
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
              <button type="submit" className="btn-submit-reschedule">Add Appointment</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPanel;
