import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Chatbot from "./Chatbot";

const Layout = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <Navbar />
      <main style={{ minHeight: "calc(100vh - 300px)" }}>
        <Outlet />
      </main>
      <Chatbot />
      <Footer />
    </>
  );
};

export default Layout;
