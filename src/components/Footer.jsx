import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">

        <h4>HOURS</h4>
        <p>Monday - Saturday: 10 AM - 8 PM</p>
        <p>Sunday: 10 AM - 7 PM</p>

        <div className="footer-links">
          <p>CONTACT</p>
          <p>SPA POLICY</p>
          <p>ORDER & PAYMENTS</p>
          <p>RETURN & EXCHANGE</p>
          <p>TERMS & CONDITIONS</p>
        </div>

        <p className="copyright">© All Rights Reserved</p>

      </div>
    </footer>
  );
};

export default Footer;