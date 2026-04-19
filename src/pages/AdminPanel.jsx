import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Calendar, Users, Briefcase, Edit2, Trash2, X } from "lucide-react";
import "./AdminPanel.css";

const AdminPanel = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("appointments");
  const [appointments, setAppointments] = useState([]);
  const [users, setUsers] = useState([]);
  const [staff, setStaff] = useState([]);
  
  // Reschedule Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  // New Staff State
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffRole, setNewStaffRole] = useState("");
  const [newStaffPhone, setNewStaffPhone] = useState("");

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }
    fetchData();
  }, [user, navigate]);

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
    } catch (err) {
      console.error("Failed to fetch admin data", err);
    }
  };

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
      // 1. Update Appointment
      const updatedAppt = { ...selectedAppt, date: newDate, time: newTime };
      await fetch(`http://localhost:3001/appointments/${selectedAppt.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedAppt)
      });

      // 2. Create Notification Message for User
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

      // 3. Refresh data and close
      setShowModal(false);
      fetchData();
      alert("Appointment rescheduled and user notified!");
    } catch (err) {
      console.error("Failed to reschedule", err);
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
    if(!window.confirm("Are you sure you want to remove this staff member?")) return;
    try {
      await fetch(`http://localhost:3001/staff/${id}`, { method: "DELETE" });
      fetchData();
    } catch (err) {
      console.error("Failed to delete staff", err);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        
        <div className="admin-sidebar card">
          <h3>Admin Panel</h3>
          <ul>
            <li className={activeTab === 'appointments' ? 'active' : ''} onClick={() => setActiveTab('appointments')}>
              <Calendar size={18} /> Appointments
            </li>
            <li className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
              <Users size={18} /> Customers
            </li>
            <li className={activeTab === 'staff' ? 'active' : ''} onClick={() => setActiveTab('staff')}>
              <Briefcase size={18} /> Staff Management
            </li>
          </ul>
        </div>

        <div className="admin-content card">
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

        </div>
      </div>

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

    </div>
  );
};

export default AdminPanel;
