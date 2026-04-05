import React from "react";
import "./Home.css";


const Home = () => {
  return (
    <div className="home">

      {/* HERO */}
      <section className="hero">
        <div className="hero-overlay">
          <h1>
            Elevated <br /> Beauty & Wellness
          </h1>
          <button className="btn-dark">LEARN MORE</button>
        </div>
      </section>

      {/* INTRO TEXT */}
      <section className="intro">
        <p>
          With multiple locations throughout New York City, busy New Yorkers can
          enjoy a quick manicure, pedicure or express facial in a peaceful,
          rejuvenating ambiance. Our nurturing array of manicure, pedicure,
          body and facial services are enhanced by quality personal service
          from a staff of certified professionals. So come enjoy the
          revitalizing solitude of our day spa, and let us pamper you with the
          quality and excellence you deserve.
        </p>
        <button className="btn-dark">LEARN MORE</button>
      </section>

      {/* GRID */}
      <section className="grid">

        {/* LEFT */}
        <div className="grid-left">
          <div className="grid-box big nail">
            <div className="overlay-text">
              <h2>Nail Art</h2>
              <p>WE PROVIDE A VARIETY OF UNIQUE NAIL ART</p>
            </div>
          </div>

          <div className="grid-row">
            <div className="grid-box small location">
              <h3>Locations</h3>
            </div>

            <div className="grid-box small contact">
              <h3>Contact Us</h3>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="grid-right">
          <div className="grid-row">
            <div className="grid-box small gift">
              <h3>Gift Cards</h3>
            </div>

            <div className="grid-box small events">
              <h3>Events</h3>
            </div>
          </div>

          <div className="grid-box big services">
            <div className="overlay-text">
              <h2>Services</h2>
              <p>FROM MANICURE TO FULL SPA PACKAGES</p>
            </div>
          </div>
        </div>

      </section>

      {/* INSTAGRAM + SUBSCRIBE */}
      <section className="bottom">

        <div className="instagram">
          <h3>Follow us on Instagram @Spabelles</h3>
          <div className="insta-images">
            <img src="https://images.unsplash.com/photo-1604654894610-df63bc536371" />
            <img src="https://images.unsplash.com/photo-1607779097040-26e80aa78e66" />
          </div>
        </div>

        <div className="subscribe">
          <h3>Subscribe</h3>
          <p>Sign up with your email address to receive news and updates.</p>
          <div className="subscribe-box">
            <input placeholder="Email Address" />
            <button className="btn-dark">SIGN UP</button>
          </div>
          <small>We respect your privacy</small>
        </div>

      </section>
    </div>
  );
};

export default Home;