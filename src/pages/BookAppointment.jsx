/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import "./BookAppointment.css";

// ─── Component ──────────────────────────────────────────────────────────────
const BookAppointment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const initialService = queryParams.get("service") || "FACIAL THERAPY";
  const initialSpecialistId = queryParams.get("specialistId")
    ? parseInt(queryParams.get("specialistId"), 10)
    : null;

  const [selectedService, setSelectedService] = useState(initialService);
  const [sessionLength, setSessionLength] = useState("30 mins");
  const [place, setPlace] = useState("At Parlor");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");

  const [specialistsData, setSpecialistsData] = useState([]);
  const [assignedStaff, setAssignedStaff] = useState(null);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await fetch("http://localhost:3002/staff");
        if (res.ok) {
          const data = await res.json();
          setSpecialistsData(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchStaff();
  }, []);

  // ── Staff logic ────────────────────────────────────────────────────────────
  // If coming from Specialists page → lock to that specialist.
  // Otherwise → random based on service, re-randomise when service changes.
  const lockedSpecialist = useMemo(() => {
    if (!initialSpecialistId || specialistsData.length === 0) return null;
    return specialistsData.find((s) => s.id === initialSpecialistId) || null;
  }, [initialSpecialistId, specialistsData]);

  // Re-assign random staff only when service changes AND no specialist was pre-selected
  useEffect(() => {
    if (specialistsData.length > 0) {
      if (lockedSpecialist) {
        setAssignedStaff(lockedSpecialist);
      } else {
        const matched = specialistsData.filter(
          (s) => s.serviceKey === selectedService,
        );
        const pool = matched.length > 0 ? matched : specialistsData;
        setAssignedStaff(pool[Math.floor(Math.random() * pool.length)]);
      }
    }
  }, [selectedService, lockedSpecialist, specialistsData]);

  // ── Derived ────────────────────────────────────────────────────────────────
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const isHairService = [
    "HAIRCUTS, STYLING & COLORING",
    "HAIR TREATMENTS",
  ].includes(selectedService);

  const getPrice = () => {
    if (isHairService) return "₹4,676+";
    switch (sessionLength) {
      case "30 mins":
        return "₹1,870";
      case "60 mins":
        return "₹3,740";
      case "90 mins":
        return "₹5,611";
      case "120 mins":
        return "₹7,481";
      default:
        return "₹1,870";
    }
  };

  const handleBook = (e) => {
    e.preventDefault();
    navigate("/checkout", {
      state: {
        service: selectedService,
        duration: !isHairService ? sessionLength : null,
        place,
        address: place === "At Home" ? address : null,
        date,
        time,
        mobile,
        price: getPrice(),
        staff: assignedStaff
          ? {
              id: assignedStaff.id,
              name: assignedStaff.name,
              role: assignedStaff.role,
              image: assignedStaff.image,
            }
          : null,
      },
    });
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="book-page">
      <div className="book-container">
        <div className="book-header">
          <button
            type="button"
            className="back-btn"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={24} />
          </button>
          <h2>Book Service</h2>
          <div style={{ width: 24 }} />
        </div>

        <form onSubmit={handleBook}>
          {/* ── Service ── */}
          <div className="form-section">
            <label>Select Service</label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="text-input"
            >
              <option value="FACIAL">FACIAL MASSAGE</option>
              <option value="BODY MASSAGE">BODY MASSAGE</option>
              <option value="SPA & WELLNESS">SPA & WELLNESS</option>
              <option value="FACIAL THERAPY">FACIAL THERAPY</option>
              <option value="HOLISTIC MASSAGE">HOLISTIC MASSAGE</option>
              <option value="HOT STONE MASSAGE">HOT STONE MASSAGE</option>
              <option value="HAIRCUTS, STYLING & COLORING">
                Haircuts, styling, coloring (balayage, highlights)
              </option>
              <option value="HAIR TREATMENTS">
                Hair treatments (botox, keratin, nano-plastia)
              </option>
            </select>
          </div>

          {/* ── Session length ── */}
          {!isHairService && (
            <div className="form-section">
              <label>Session length</label>
              <div className="options-grid">
                {["30 mins", "60 mins", "90 mins", "120 mins"].map((len) => (
                  <div
                    key={len}
                    className={`option-box ${sessionLength === len ? "selected" : ""}`}
                    onClick={() => setSessionLength(len)}
                  >
                    <span className="len">{len}</span>
                    <span className="price">
                      {len === "30 mins"
                        ? "₹1,870"
                        : len === "60 mins"
                          ? "₹3,740"
                          : len === "90 mins"
                            ? "₹5,611"
                            : "₹7,481"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Assigned Staff ── */}
          <div className="form-section">
            <label>Assigned specialist ✨</label>
            {assignedStaff ? (
              <div className="staff-card">
                <div className="staff-card-info">
                  <span className="staff-card-role">{assignedStaff.role}</span>{" "}
                  -
                  <i>
                    <span className="staff-card-name">
                      {assignedStaff.name}
                    </span>{" "}
                  </i>
                </div>
              </div>
            ) : (
              <div className="staff-card">
                <div className="staff-card-info">
                  <i>
                    <span className="staff-card-name">
                      Loading specialist...
                    </span>
                  </i>
                </div>
              </div>
            )}
          </div>

          {/* ── Place ── */}
          <div className="form-section">
            <label>Where you want to get service?</label>
            <div className="options-row">
              {["At Parlor", "At Home"].map((opt) => (
                <div
                  key={opt}
                  className={`option-btn ${place === opt ? "selected" : ""}`}
                  onClick={() => setPlace(opt)}
                >
                  {opt}
                </div>
              ))}
            </div>
          </div>

          {place === "At Home" && (
            <div className="form-section">
              <label>Full Address</label>
              <textarea
                placeholder="Enter your complete home address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="text-input"
                required
                style={{
                  resize: "vertical",
                  minHeight: "80px",
                  padding: "15px",
                }}
              />
            </div>
          )}

          {/* ── Date ── */}
          <div className="form-section">
            <label>Select date</label>
            <div className="input-wrapper">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
              <Calendar size={18} className="input-icon" />
            </div>
          </div>

          {/* ── Time ── */}
          <div className="form-section">
            <label>Select time</label>
            <div className="input-wrapper">
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
              <Clock size={18} className="input-icon" />
            </div>
          </div>

          {/* ── Mobile ── */}
          <div className="form-section">
            <label>Mobile number</label>
            <input
              type="tel"
              placeholder="+1 3323432234"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="text-input"
              required
            />
          </div>

          {/* ── Bottom bar ── */}
          <div className="bottom-bar">
            <div className="total-payable">
              <span>Total payable</span>
              <h4>{getPrice()}</h4>
            </div>
            <button type="submit" className="btn-book-now-final">
              Continue to Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
