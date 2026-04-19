import React, { useEffect } from "react";
import "./Locations.css";
import { MapPin, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const locations = [
  { city: "New York", address: "123 Broadway, NY 10001", phone: "+1 212-555-0100", img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80" },
  { city: "Manhattan", address: "456 5th Ave, NY 10018", phone: "+1 212-555-0101", img: "https://images.unsplash.com/photo-1522083165195-3424ed129620?auto=format&fit=crop&w=600&q=80" },
  { city: "Boston", address: "789 Boylston St, MA 02116", phone: "+1 617-555-0102", img: "https://images.unsplash.com/photo-1506527581691-030a2139e80e?auto=format&fit=crop&w=600&q=80" },
  { city: "Los Angeles", address: "101 Hollywood Blvd, CA 90028", phone: "+1 323-555-0103", img: "https://images.unsplash.com/photo-1580659324422-cb02082f05a3?auto=format&fit=crop&w=600&q=80" },
  { city: "Seoul", address: "123 Gangnam-daero, Seoul 06611", phone: "+82 2-555-0104", img: "https://images.unsplash.com/photo-1588506161499-1bd1713e2f47?auto=format&fit=crop&w=600&q=80" },
  { city: "Mumbai", address: "456 Marine Drive, MH 400020", phone: "+91 22-5555-0105", img: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=600&q=80" },
  { city: "Tokyo", address: "789 Shibuya, Tokyo 150-0002", phone: "+81 3-5555-0106", img: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80" },
];

const Locations = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="locations-page">
      <div className="locations-header">
        <h1>Find Our Sanctuaries</h1>
        <p>Experience the ultimate holistic care at any of our global locations.</p>
      </div>

      <div className="locations-grid container">
        {locations.map((loc, index) => (
          <div className="location-card" key={index}>
            <div className="location-img">
              <img src={loc.img} alt={loc.city} />
            </div>
            <div className="location-info">
              <h2>{loc.city}</h2>
              <div className="info-line">
                <MapPin size={18} />
                <span>{loc.address}</span>
              </div>
              <div className="info-line">
                <Phone size={18} />
                <span>{loc.phone}</span>
              </div>
              <div className="info-line">
                <Mail size={18} />
                <span>hello@{loc.city.toLowerCase().replace(" ", "")}.aurawellness.com</span>
              </div>
              <Link to="/book" className="btn-loc-book">Book at {loc.city}</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Locations;
