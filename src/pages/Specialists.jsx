import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Specialists.css";

const specialistsData = [
  {
    id: 1,
    role: "Hairstylist",
    name: "Elena Rodriguez",
    achievement: "Voted Top Stylist in the City, 2025. 10+ years specializing in modern coloring techniques and textured cuts.",
    image: "/images/specialists/hairstylist.png",
  },
  {
    id: 2,
    role: "Hairdresser",
    name: "Marcus Chen",
    achievement: "Award-winning precision cutter. Featured in 'Vogue Hair Trends' and global platform educator.",
    image: "/images/specialists/hairdresser.png",
  },
  {
    id: 3,
    role: "Beautician",
    name: "Sarah Jenkins",
    achievement: "Certified Master Esthetician with a focus on holistic skincare. Transformed over 500 clients' skin journeys.",
    image: "/images/specialists/beautician.png",
  },
  {
    id: 4,
    role: "Makeup Artist",
    name: "David Kim",
    achievement: "Celebrity makeup artist with credits in major fashion weeks (NY & Paris). Specializes in bridal and editorial makeup.",
    image: "/images/specialists/makeup_artist.png",
  },
  {
    id: 5,
    role: "Massage Therapist",
    name: "Aisha Patel",
    achievement: "Advanced certification in deep tissue and reflexology. 15 years of experience healing chronic tension.",
    image: "/images/specialists/massage_therapist.png",
  },
  {
    id: 6,
    role: "Spa Therapist",
    name: "Liam O'Connor",
    achievement: "Pioneer in aromatherapy integration. Created signature relaxation protocols used across luxury wellness centers.",
    image: "/images/specialists/spa_therapist.png",
  },
  {
    id: 7,
    role: "Beauty Therapist",
    name: "Chloe Dupont",
    achievement: "Expert in non-invasive anti-aging treatments. Holds the highest level of international CIDESCO diploma.",
    image: "/images/specialists/beautician.png", // Reused since generation failed
  },
];

const Specialists = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
            passionate, and highly-trained professionals in the beauty and wellness
            industry. From award-winning hairstylists to certified master therapists,
            every member of our team is dedicated to providing you with a transformative
            experience. Trust your care to the hands of true artists and healers.
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
                  <img src={specialist.image} alt={specialist.name} className="team-card-image" />
                  <div className="team-card-role-badge">{specialist.role}</div>
                </div>
                <div className="team-card-info">
                  <h3>{specialist.name}</h3>
                  <div className="team-card-divider"></div>
                  <p className="team-card-achievement">{specialist.achievement}</p>
                  <Link to={`/book?service=${encodeURIComponent(specialist.role)}`} className="btn-book-specialist">
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
          <Link to="/book" className="btn-primary">Book an Appointment</Link>
        </div>
      </section>
    </div>
  );
};

export default Specialists;
