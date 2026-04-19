import React, { useState, useEffect } from "react";
import "./Home.css";
import { Link } from "react-router-dom";

import heroImg from "../assets/banner.jpg";
import service1 from "../assets/services.png";
import service2 from "../assets/image1.jpg";
import service3 from "../assets/image2.jpg";
import service4 from "../assets/1.webp";

const Home = () => {
  const [approvedFeedbacks, setApprovedFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await fetch(
          "http://localhost:3001/feedbacks?status=approved",
        );
        const data = await res.json();
        setApprovedFeedbacks(data);
      } catch (error) {
        console.error("Failed to fetch feedbacks", error);
      }
    };
    fetchFeedbacks();
  }, []);

  return (
    <div className="home">
      {/* HERO SECTION */}
      <section className="hero" style={{ backgroundImage: `url(${heroImg})` }}>
        <div className="hero-content">
          <h1 className="hero-title">
            Restore Body
            <br />
            And Mind
          </h1>
          <p className="hero-subtitle">
            Holistic therapies to renew your mind, body and spirit. Discover our
            range of treatments tailored to your unique needs.
          </p>
          <Link to="/book" className="btn-book-now">
            BOOK APPOINTMENT
          </Link>
        </div>
      </section>

      {/* ABOUT US */}
      <section className="about-section container">
        <div className="about-left">
          <h2>About Us</h2>
          <p>
            We provide a full range of salon treatments and styling services
            provided by a team of professional stylists.
          </p>
        </div>
        <div className="about-right">
          <h3>
            We Believe That Wellness Is A Healing Process That Is Unique To
            Every Individual. We Are Creating An Environment Designed To Support
            Your Total Wellness Journey.
          </h3>
        </div>
      </section>

      {/* TOP SERVICES */}
      <section className="top-services container">
        <div className="top-services-header">
          <h2>
            Our Top <em>Services</em>
          </h2>
          <p>
            Our experienced team provides a full range of spa treatments
            designed to leave you feeling relaxed and rejuvenated.
          </p>
        </div>

        <div className="services-grid-round">
          <div className="service-round">
            <div className="img-wrapper">
              <img src={service1} alt="Spa" />
            </div>
            <h4>Spa & Wellness</h4>
          </div>
          <div className="service-round">
            <div className="img-wrapper">
              <img src={service2} alt="Facial" />
            </div>
            <h4>Facial Therapy</h4>
          </div>
          <div className="service-round">
            <div className="img-wrapper">
              <img src={service3} alt="Massage" />
            </div>
            <h4>Holistic Massage</h4>
          </div>
          <div className="service-round">
            <div className="img-wrapper">
              <img src={service4} alt="Hot Stone" />
            </div>
            <h4>Hot Stone Massage</h4>
          </div>
        </div>
      </section>

      {/* WELLNESS CARE */}
      <section className="wellness-care container">
        <div className="wellness-left">
          <p>
            Let us help you to feel completely revitalized. Our Spa, Massage
            Therapy and full list of treatments offer exactly what you need to
            achieve relaxation, peace and wellness.
          </p>
        </div>
        <div className="wellness-right">
          <h2>
            Our Trusted Partner In Holistic Wellness Care With Our Expert Spa
            Treatments
          </h2>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-section">
        <div className="container stats-grid">
          <div className="stat">
            <h3>100%</h3>
            <p>Client Satisfaction</p>
          </div>
          <div className="stat">
            <h3>10+</h3>
            <p>Years Experience</p>
          </div>
          <div className="stat">
            <h3>30+</h3>
            <p>Premium Spa</p>
          </div>
          <div className="stat">
            <h3>24/7</h3>
            <p>We Treat You Right</p>
          </div>
        </div>
      </section>

      {/* IMAGE GALLERY SECTION */}
      <section className="gallery-section container">
        <div className="gallery-grid">
          <div className="gallery-col col-1">
            <img src={service1} alt="Gallery 1" />
            <img src={service2} alt="Gallery 2" />
          </div>
          <div className="gallery-col col-2">
            <img src={service3} alt="Gallery 3" />
            <div className="gallery-text-box">
              <p>
                We use best wellness techniques with modern equipment & natural
                oils to treat your mind & body. Enjoy the calming atmosphere and
                discover the wellness secret.
              </p>
            </div>
          </div>
          <div className="gallery-col col-3">
            <img src={service4} alt="Gallery 4" />
            <h2>
              Our Spa Services & Sanctuary Of Calm Offers Every Nurturing
              Treatment You Receive
            </h2>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="pricing-aroma container">
        <div className="pricing-grid">
          <div className="pricing-box">
            <h4>Value Pricing</h4>
            <p>
              We design our service packages thoughtfully so you can get the
              best service at competitive prices.
            </p>
          </div>
          <div className="pricing-box">
            <h4>Speciality</h4>
            <p>
              We do what we do with deep passion. We strive to provide an
              outstanding experience.
            </p>
          </div>
          <div className="pricing-box">
            <h4>Years of Experience</h4>
            <p>
              Our therapists have over a decade of experience, ensuring your
              relaxation is in the best hands.
            </p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials container">
        <h2>
          Our Client <em>Testimonial</em>
        </h2>
        <div className="testimonial-grid">
          {approvedFeedbacks.length > 0 ? (
            approvedFeedbacks.slice(0, 3).map((fb) => (
              <div key={fb.id} className="testimonial">
                <p className="quote">"{fb.text}"</p>
                <div className="author">- {fb.userName}</div>
              </div>
            ))
          ) : (
            <>
              <div className="testimonial">
                <p className="quote">
                  "I had a fantastic experience. The staff is so welcoming and
                  the massage was the best I've ever had. Highly recommend to
                  everyone looking for a relaxing day!"
                </p>
                <div className="author">- Jane Doe</div>
              </div>
              <div className="testimonial">
                <p className="quote">
                  "Beautiful ambiance, excellent service. I left feeling
                  completely rejuvenated. The hot stone massage is an absolute
                  must-try."
                </p>
                <div className="author">- Sarah Smith</div>
              </div>
              <div className="testimonial">
                <p className="quote">
                  "The facial treatment was divine. The esthetician was very
                  knowledgeable and used high-quality products. My skin is
                  glowing!"
                </p>
                <div className="author">- Emily Rose</div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* BOOK APPOINTMENT CTA */}
      <section className="book-cta container">
        <div className="book-cta-wrapper">
          <div className="book-form">
            <h2>
              Book Your <em>Appointment</em> Today
            </h2>
            <form>
              <div className="form-group">
                <input type="text" placeholder="Your Name" />
                <input type="email" placeholder="Email" />
              </div>
              <div className="form-group">
                <input type="date" />
                <select>
                  <option>Select Service</option>
                  <option>SPA PACKAGES</option>
                  <option>NAIL ART</option>
                  <option>MANICURE / PEDICURE</option>
                  <option>FACIAL</option>
                  <option>WAXING</option>
                  <option>BODY MASSAGE</option>
                  <option>BODY TREATMENTS</option>
                  <option>MICRODERMABRASION</option>
                  <option>EYELASH EXTENSIONS</option>
                  <option>PHOTOFACIAL TREATMENT</option>
                  <option>SPA & WELLNESS</option>
                  <option>FACIAL THERAPY</option>
                  <option>HOLISTIC MASSAGE</option>
                  <option>HOT STONE MASSAGE</option>
                </select>
              </div>
              <textarea placeholder="Message"></textarea>
              <Link
                to="/book"
                className="btn-submit"
                style={{ display: "inline-block", textAlign: "center" }}
              >
                Book Appointment
              </Link>
            </form>
          </div>
          <div className="book-img">
            <img src={service1} alt="Book" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
