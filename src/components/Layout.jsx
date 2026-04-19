import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

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
      <Footer />
    </>
  );
};

export default Layout;
