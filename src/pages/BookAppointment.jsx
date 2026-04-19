import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import "./BookAppointment.css";

const BookAppointment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialService = queryParams.get("service") || "FACIAL THERAPY";

  const [selectedService, setSelectedService] = useState(initialService);
  const [sessionLength, setSessionLength] = useState("30 mins");
  const [place, setPlace] = useState("At Parlor");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const isHairService = ["HAIRCUTS, STYLING & COLORING", "HAIR TREATMENTS"].includes(selectedService);

  const handleBook = (e) => {
    e.preventDefault();
    const price = getPrice();
    navigate("/checkout", {
      state: {
        service: selectedService,
        duration: !isHairService ? sessionLength : null,
        place,
        address: place === 'At Home' ? address : null,
        date,
        time,
        mobile,
        price
      }
    });
  };

  const getPrice = () => {
    if (isHairService) {
      return "$50+"; // Placeholder base price for hair services
    }
    switch (sessionLength) {
      case "30 mins": return "$20";
      case "60 mins": return "$40";
      case "90 mins": return "$60";
      case "120 mins": return "$80";
      default: return "$20";
    }
  };

  return (
    <div className="book-page">
      <div className="book-container">

        <div className="book-header">
          <button type="button" className="back-btn" onClick={() => navigate(-1)}><ArrowLeft size={24} /></button>
          <h2>Book Service</h2>
          <div style={{ width: 24 }}></div> {/* Spacer for center alignment */}
        </div>

        <form onSubmit={handleBook}>
          <div className="form-section">
            <label>Select Service</label>
            <select
              value={selectedService}
              onChange={e => setSelectedService(e.target.value)}
              className="text-input"
            >
              <option value="FACIAL">FACIAL MASSAGE</option>
              <option value="BODY MASSAGE">BODY MASSAGE</option>
              <option value="SPA & WELLNESS">SPA & WELLNESS</option>
              <option value="FACIAL THERAPY">FACIAL THERAPY</option>
              <option value="HOLISTIC MASSAGE">HOLISTIC MASSAGE</option>
              <option value="HOT STONE MASSAGE">HOT STONE MASSAGE</option>
              <option value="HAIRCUTS, STYLING & COLORING">Haircuts, styling, coloring (balayage, highlights)</option>
              <option value="HAIR TREATMENTS">Hair treatments (botox, keratin, nano-plastia)</option>
            </select>
          </div>
          
          {!isHairService && (
            <div className="form-section">
              <label>Session length</label>
              <div className="options-grid">
                {['30 mins', '60 mins', '90 mins', '120 mins'].map(len => (
                  <div
                    key={len}
                    className={`option-box ${sessionLength === len ? 'selected' : ''}`}
                    onClick={() => setSessionLength(len)}
                  >
                    <span className="len">{len}</span>
                    <span className="price">${len === '30 mins' ? '20' : len === '60 mins' ? '40' : len === '90 mins' ? '60' : '80'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="form-section">
            <label>Where you want to get service?</label>
            <div className="options-row">
              <div
                className={`option-btn ${place === 'At Parlor' ? 'selected' : ''}`}
                onClick={() => setPlace('At Parlor')}
              >
                At Parlor
              </div>
              <div
                className={`option-btn ${place === 'At Home' ? 'selected' : ''}`}
                onClick={() => setPlace('At Home')}
              >
                At Home
              </div>
            </div>
          </div>

          {place === 'At Home' && (
            <div className="form-section">
              <label>Full Address</label>
              <textarea 
                placeholder="Enter your complete home address" 
                value={address} 
                onChange={e => setAddress(e.target.value)} 
                className="text-input"
                required 
                style={{ resize: 'vertical', minHeight: '80px', padding: '15px' }}
              />
            </div>
          )}

          <div className="form-section">
            <label>Select date</label>
            <div className="input-wrapper">
              <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
              <Calendar size={18} className="input-icon" />
            </div>
          </div>

          <div className="form-section">
            <label>Select time</label>
            <div className="input-wrapper">
              <input type="time" value={time} onChange={e => setTime(e.target.value)} required />
              <Clock size={18} className="input-icon" />
            </div>
          </div>

          <div className="form-section">
            <label>Mobile number</label>
            <input
              type="tel"
              placeholder="+1 3323432234"
              value={mobile}
              onChange={e => setMobile(e.target.value)}
              className="text-input"
              required
            />
          </div>

          <div className="bottom-bar">
            <div className="total-payable">
              <span>Total payable</span>
              <h4>{getPrice()}</h4>
            </div>
            <button type="submit" className="btn-book-now-final">Continue to Payment</button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default BookAppointment;
