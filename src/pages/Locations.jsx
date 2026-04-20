import React, { useEffect } from "react";
import "./Locations.css";
import { MapPin, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

import img1 from "../assets/newyork.jpg";
import img2 from "../assets/manhatten.jpg";
import img3 from "../assets/boston.jpg";
import img4 from "../assets/la.jpg";
import img5 from "../assets/seoul.jpg";
import img6 from "../assets/mumbai.jpg";
import img7 from "../assets/tokyo.jpg";

const locations = [
  {
    city: "New York",
    address: "123 Broadway, NY 10001",
    phone: "+1 212-555-0100",
    img: img1,
  },
  {
    city: "Manhattan",
    address: "456 5th Ave, NY 10018",
    phone: "+1 212-555-0101",
    img: img2,
  },
  {
    city: "Boston",
    address: "789 Boylston St, MA 02116",
    phone: "+1 617-555-0102",
    img: img3,
  },
  {
    city: "Los Angeles",
    address: "101 Hollywood Blvd, CA 90028",
    phone: "+1 323-555-0103",
    img: img4,
  },
  {
    city: "Seoul",
    address: "123 Gangnam-daero, Seoul 06611",
    phone: "+82 2-555-0104",
    img: img5,
  },
  {
    city: "Mumbai",
    address: "456 Marine Drive, MH 400020",
    phone: "+91 22-5555-0105",
    img: img6,
  },
  {
    city: "Tokyo",
    address: "789 Shibuya, Tokyo 150-0002",
    phone: "+81 3-5555-0106",
    img: img7,
  },
];

const Locations = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="locations-page">
      <div className="locations-header">
        <h1>Find Our Sanctuaries</h1>
        <p>
          Experience the ultimate holistic care at any of our global locations.
        </p>
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
                <span>
                  hello@{loc.city.toLowerCase().replace(" ", "")}
                  .aurawellness.com
                </span>
              </div>
              <Link to="/book" className="btn-loc-book">
                Book at {loc.city}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Locations;
