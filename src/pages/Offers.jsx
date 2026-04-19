import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Offers.css";

const Offers = () => {
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="offers-page">
      {/* OFFERS HERO */}
      <section className="offers-hero">
        <div className="offers-hero-content">
          <h1>Salon Benefits at aura</h1>
          <p className="voucher-text">Gift Voucher</p>
          <p className="voucher-price">₹50.00</p>
          <p className="voucher-sub">Perfect to try something new!</p>
        </div>
      </section>

      {/* PROMOTIONS INTRO */}
      <section className="promotions-intro container">
        <div className="promo-text">
          <h2>
            At aura, we offer a range of special promotions & benefits designed
            to enhance your beauty experience.
          </h2>
          <p>
            Enjoy personalized consultations, expert care, valuable package &
            membership deals & exclusive monthly offers ensuring your each visit
            is rewarding & experience - top notch!
          </p>
        </div>
      </section>

      {/* GIFT CARDS & MEMBERSHIP CARDS (Mini banners) */}
      <section className="mini-banners container">
        <div className="banner dark-banner">
          <h3>GRAB THE MEMBERSHIP NOW</h3>
          <p>
            GET <strong>20%</strong> OFF ON ALL YOUR VISITS FOR A WHOLE YEAR
          </p>
        </div>
        <div className="banner light-banner">
          <h3>GIFT THEM AN ENTICING EXPERIENCE WITH THE</h3>
          <p>
            <strong>AURA GIFT CARD</strong>
          </p>
        </div>
        <div className="banner img-banner">
          <div className="overlay">
            <h3>Exclusively for Duty Free Customers</h3>
            <p>
              <strong>20% benefit</strong> on services
            </p>
          </div>
        </div>
      </section>

      {/* SIGNATURE PACKAGES */}
      <section className="signature-packages container">
        <h2>Signature Packages</h2>
        <div className="packages-grid">
          <div className="package-card">
            <h3>Basic</h3>
            <p className="pay-text">Pay</p>
            <h4>₹110</h4>
            <div className="package-details">
              <p>Get service worth ₹135</p>
              <p>Benefit: 25% (6 months) Extra</p>
              <p>Value: ₹27</p>
            </div>
          </div>
          <div className="package-card">
            <h3>Prime</h3>
            <p className="pay-text">Pay</p>
            <h4>₹210</h4>
            <div className="package-details">
              <p>Get service worth ₹275</p>
              <p>Benefit: 30% (10 months) Extra</p>
              <p>Value: ₹65</p>
            </div>
          </div>
          <div className="package-card">
            <h3>Silver</h3>
            <p className="pay-text">Pay</p>
            <h4>₹420</h4>
            <div className="package-details">
              <p>Get service worth ₹567</p>
              <p>Benefit: 35% (12 months) Extra</p>
              <p>Value: ₹147</p>
            </div>
          </div>
          <div className="package-card">
            <h3>Gold</h3>
            <p className="pay-text">Pay</p>
            <h4>₹750</h4>
            <div className="package-details">
              <p>Get service worth ₹1050</p>
              <p>Benefit: 40% (18 months) Extra</p>
              <p>Value: ₹300</p>
            </div>
          </div>
          <div className="package-card">
            <h3>Platinum</h3>
            <p className="pay-text">Pay</p>
            <h4>₹1,000</h4>
            <div className="package-details">
              <p>Get service worth ₹1450</p>
              <p>Benefit: 45% (18 months) Extra</p>
              <p>Value: ₹450</p>
            </div>
          </div>
        </div>
      </section>

      {/* ENQUIRE SECTION */}
      <section className="enquire-section container">
        <div className="enquire-bg">
          <div className="enquire-content">
            <h2>Flat 30% off on your first visit</h2>
            <p>*at select locations *t&c apply</p>
            <button className="btn-enquire" onClick={() => navigate("/book")}>
              BOOK AN APPOINTMENT
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Offers;
