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
    city: "Ahmedabad",
    address: "101, Shivalik High Street, Vastrapur, Ahmedabad, Gujarat 380015",
    phone: "+91 79-5555-0101",
    img: img1,
  },
  {
    city: "Surat",
    address: "402, Rajhans Heights, Piplod, Surat, Gujarat 395007",
    phone: "+91 261-555-0102",
    img: img2,
  },
  {
    city: "Mumbai",
    address: "456 Marine Drive, Mumbai, Maharashtra 400020",
    phone: "+91 22-5555-0103",
    img: img6,
  },
  {
    city: "Delhi",
    address: "12, Connaught Place, New Delhi, Delhi 110001",
    phone: "+91 11-5555-0104",
    img: img3,
  },
  {
    city: "Bengaluru",
    address: "89, Indiranagar Double Road, Bengaluru, Karnataka 560038",
    phone: "+91 80-5555-0105",
    img: img4,
  },
  {
    city: "Pune",
    address: "305, Koregaon Park Road, Pune, Maharashtra 411001",
    phone: "+91 20-5555-0106",
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
          Experience the ultimate holistic care at any of our premier Indian locations.
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
