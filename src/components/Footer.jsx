import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-col">
          <Link to="/" className="footer-logo">
            aura
          </Link>
          <p className="footer-desc">
            aura is a holistic wellness center that offers a wide range of
            services to help you relax, rejuvenate, and restore your body and
            mind.
          </p>
          <div className="socials">
            <a href="#">FB</a>
            <a href="#">IG</a>
            <a href="#">X</a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <Link to="/">Home</Link>
          <Link to="/services">Services</Link>
          <Link to="/offers">Offers</Link>
          <Link to="/locations">Locations</Link>
        </div>

        <div className="footer-col">
          <h4>Contact</h4>
          <p>123 Wellness Ave, NY 10001</p>
          <p>hello@aurawellness.com</p>
          <p>+1 (555) 123-4567</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="copyright">
          © {new Date().getFullYear()} Aura Wellness. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
