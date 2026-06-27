import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../config";
import "./Specialists.css";

const Specialists = () => {
  const [specialistsData, setSpecialistsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchSpecialists = async () => {
      try {
        const response = await fetch(`${API_URL}/staff`);
        if (response.ok) {
          const data = await response.json();
          setSpecialistsData(data);
        }
      } catch (error) {
        console.error("Failed to fetch specialists:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSpecialists();
  }, []);

  if (loading) {
    return (
      <div className="specialists-page">
        <div className="intro-container">
          <h2>Loading Specialists...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="specialists-page">
      {/* Hero Section */}
      <section className="specialists-hero">
        <div className="specialists-hero-content">
          <h1>Our Experts</h1>
          <p>Meet the masters behind the magic.</p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="specialists-intro">
        <div className="intro-container">
          <h2>The Best Industry Experts in the Field</h2>
          <p>
            At Aura Spa & Salon, we believe that exceptional service begins with
            exceptional talent. We have curated a team of the most skilled,
            passionate, and highly-trained professionals in the beauty and
            wellness industry. From award-winning hairstylists to certified
            master therapists, every member of our team is dedicated to
            providing you with a transformative experience. Trust your care to
            the hands of true artists and healers.
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="specialists-team">
        <div className="team-container">
          <div className="team-grid">
            {specialistsData.map((specialist) => (
              <div key={specialist.id} className="team-card">
                <div className="team-card-image-wrapper">
                  <img
                    src={specialist.image}
                    alt={specialist.name}
                    className="team-card-image"
                  />
                  <div className="team-card-role-badge">{specialist.role}</div>
                </div>
                <div className="team-card-info">
                  <h3>{specialist.name}</h3>
                  <div className="team-card-divider"></div>
                  <p className="team-card-achievement">
                    {specialist.achievement}
                  </p>
                  {/* Pass specialistId and pre-select the matching service */}
                  <Link
                    to={`/book?service=${encodeURIComponent(specialist.serviceKey)}&specialistId=${specialist.id}`}
                    className="btn-book-specialist"
                  >
                    Book with {specialist.name.split(" ")[0]}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="specialists-cta">
        <div className="cta-content">
          <h2>Ready for your transformation?</h2>
          <p>Experience the expertise of our renowned specialists.</p>
          <Link to="/book" className="btn-primary">
            Book an Appointment
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Specialists;
