import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Offers from "./pages/Offers";
import Locations from "./pages/Locations";
import BookAppointment from "./pages/BookAppointment";
import Checkout from "./pages/Checkout";
import User from "./pages/User";
import Auth from "./pages/Auth";
import AdminPanel from "./pages/AdminPanel";
import Specialists from "./pages/Specialists";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="offers" element={<Offers />} />
          <Route path="specialists" element={<Specialists />} />
          <Route path="locations" element={<Locations />} />
          <Route path="book" element={<BookAppointment />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="user" element={<User />} />
          <Route path="auth" element={<Auth />} />
          <Route path="admin" element={<AdminPanel />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;