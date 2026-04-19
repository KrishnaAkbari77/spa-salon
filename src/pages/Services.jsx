import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Services.css";

import imgSpaWellness from "../assets/services.png";
import imgFacialTherapy from "../assets/image1.jpg";
import imgHolisticMassage from "../assets/image2.jpg";
import imgHotStone from "../assets/1.webp";
import imgHaircuts from "../assets/2.jpg";
import imgHairTreatments from "../assets/3.jpg";

const spaServices = [
  { id: 1, title: "SPA & WELLNESS", img: imgSpaWellness, desc: "Holistic care encompassing body and mind." },
  { id: 2, title: "FACIAL THERAPY", img: imgFacialTherapy, desc: "Targeted therapy to rejuvenate your facial features." },
  { id: 3, title: "HOLISTIC MASSAGE", img: imgHolisticMassage, desc: "Balance your body's energy with our holistic approach." },
  { id: 4, title: "HOT STONE MASSAGE", img: imgHotStone, desc: "Melt away tension with heated stones placed on key points." }
];

const salonServices = [
  { id: 5, title: "HAIRCUTS, STYLING & COLORING", img: imgHaircuts, desc: "Expert haircuts, styling, and coloring including balayage and highlights." },
  { id: 6, title: "HAIR TREATMENTS", img: imgHairTreatments, desc: "Revitalizing treatments like botox, keratin, and nano-plastia for healthy hair." }
];

const Services = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="services-page">
      <div className="services-header">
        <h1>Our Services</h1>
        <p>Discover our wide range of holistic and beauty treatments.</p>
      </div>

      <div className="services-category container">
        <h2 className="category-title" style={{ textAlign: 'center', fontSize: '40px', margin: '40px 0 20px', color: 'var(--primary)' }}>Spa Services</h2>
        <div className="services-list" style={{ paddingTop: '20px' }}>
          {spaServices.map((service, index) => (
            <div className="service-card" key={service.id}>
              <div className={`service-img ${index % 2 === 1 ? 'order-last' : ''}`}>
                <img src={service.img} alt={service.title} />
              </div>
              <div className="service-info">
                <h2>{service.title}</h2>
                <p>{service.desc}</p>
                <Link to={`/book?service=${encodeURIComponent(service.title)}`} className="btn-book">Book Appointment</Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="services-category container" style={{ paddingBottom: '80px' }}>
        <h2 className="category-title" style={{ textAlign: 'center', fontSize: '40px', margin: '40px 0 20px', color: 'var(--primary)' }}>Salon Services</h2>
        <div className="services-list" style={{ paddingTop: '20px' }}>
          {salonServices.map((service, index) => (
            <div className="service-card" key={service.id}>
              <div className={`service-img ${index % 2 === 1 ? 'order-last' : ''}`}>
                <img src={service.img} alt={service.title} />
              </div>
              <div className="service-info">
                <h2>{service.title}</h2>
                <p>{service.desc}</p>
                <Link to={`/book?service=${encodeURIComponent(service.title)}`} className="btn-book">Book Appointment</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
