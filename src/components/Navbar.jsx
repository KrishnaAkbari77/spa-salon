import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserCircle } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = location.pathname === "/";

  return (
    <nav className={`navbar ${scrolled || !isHome ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <Link to="/" className="logo">
          aura
        </Link>

        <ul className="nav-links">
          <li>
            <Link to="/">HOME</Link>
          </li>
          <li>
            <Link to="/services">SERVICES</Link>
          </li>
          <li>
            <Link to="/specialists">SPECIALISTS</Link>
          </li>
          <li>
            <Link to="/offers">OFFERS</Link>
          </li>
          <li>
            <Link to="/locations">LOCATIONS</Link>
          </li>
          {user && user.role === "admin" && (
            <li>
              <Link to="/admin">ADMIN PANEL</Link>
            </li>
          )}
        </ul>

        <div
          className="nav-actions"
          style={{ display: "flex", alignItems: "center", gap: "15px" }}
        >
          <Link to="/book" className="btn-nav-book">
            BOOK APPOINTMENT
          </Link>
          <Link
            to={user ? "/user" : "/auth"}
            className="btn-nav-user"
            style={{ color: "#fff", display: "flex", alignItems: "center" }}
          >
            <UserCircle size={28} />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
