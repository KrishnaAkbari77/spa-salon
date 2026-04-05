import "./Navbar.css";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="logo">SpaBelles</div>

      <ul className="nav-links">
        <li>SHOP</li>
        <li>ABOUT US</li>
        <li>SERVICES</li>
        <li>YOUR EVENT</li>
        <li>GIFT CARDS</li>
        <li>LOCATIONS</li>
      </ul>

      <div className="cart">🛍️</div>
    </div>
  );
};

export default Navbar;