import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, CreditCard, Landmark } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import "./Checkout.css";
import checkoutImg from "../assets/1.webp";

const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Provide fallback details for direct navigation/testing
  const bookingDetails = location.state || {
    service: "Sample Spa Service",
    duration: "60 mins",
    place: "At Parlor",
    address: "",
    date: "2026-05-01",
    time: "10:00 AM",
    price: "₹40",
  };

  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const saveBookingToDB = async () => {
    try {
      const newAppointment = {
        userId: user.id, // Real logged-in user
        service: bookingDetails.service,
        duration: bookingDetails.duration || "",
        place: bookingDetails.place,
        address: bookingDetails.address || "",
        date: bookingDetails.date,
        time: bookingDetails.time,
        price: bookingDetails.price,
        paymentMethod: paymentMethod,
        status: "upcoming",
      };

      await fetch("http://localhost:3001/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAppointment),
      });
    } catch (err) {
      console.error("Failed to save booking to database", err);
    }
  };

  const displayRazorpay = async () => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js",
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Please check your connection.");
      setIsProcessing(false);
      return;
    }

    // Extract numerical value from price string (e.g. "₹40" -> 40)
    const numericPrice = bookingDetails.price.replace(/[^0-9]/g, "");
    const amountInCurrency = numericPrice
      ? parseInt(numericPrice, 10) * 80
      : 500; // Mock conversion

    try {
      // Step 1: Create Order from backend
      const result = await fetch("http://localhost:3001/payment/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountInCurrency, currency: "INR" }),
      });

      if (!result.ok) {
        throw new Error("Failed to create order");
      }

      const order = await result.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_Sespjc2xXLVyJx", // Use the provided Key ID
        amount: order.amount.toString(),
        currency: order.currency,
        name: "aura Spa & Salon",
        description: `Payment for ${bookingDetails.service}`,
        image: window.location.origin + checkoutImg,
        order_id: order.id,
        handler: async function (response) {
          try {
            // Step 2: Verify Payment
            const verifyResult = await fetch(
              "http://localhost:3001/payment/verify",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              },
            );

            if (verifyResult.ok) {
              await saveBookingToDB();
              setIsProcessing(false);
              setIsSuccess(true);
              setTimeout(() => {
                navigate("/user");
              }, 3000);
            } else {
              alert("Payment verification failed!");
              setIsProcessing(false);
            }
          } catch (error) {
            console.error("Verification error", error);
            alert("Payment verification error");
            setIsProcessing(false);
          }
        },
        prefill: {
          name: user?.name || "Valued Customer",
          email: user?.email || "customer@example.com",
          contact: user?.phone || "9999999999",
        },
        theme: {
          color: "#2F3324",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", function (response) {
        alert("Payment Failed. Reason: " + response.error.description);
        setIsProcessing(false);
      });
      paymentObject.open();
    } catch (error) {
      console.error(error);
      alert("Something went wrong with the payment gateway.");
      setIsProcessing(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please log in or register to complete your booking.");
      navigate("/auth");
      return;
    }

    setIsProcessing(true);

    if (paymentMethod === "razorpay") {
      await displayRazorpay();
    } else {
      // Cash on delivery processing simulation
      setTimeout(async () => {
        setIsProcessing(false);
        await saveBookingToDB();
        setIsSuccess(true);

        // Redirect to user profile after 3 seconds
        setTimeout(() => {
          navigate("/user");
        }, 3000);
      }, 2000);
    }
  };

  if (isSuccess) {
    return (
      <div className="checkout-page success-view">
        <div className="success-card">
          <CheckCircle size={80} color="#2F3324" />
          <h2>Booking Confirmed!</h2>
          <p>
            Your appointment for <strong>{bookingDetails.service}</strong> is
            set.
          </p>
          <div className="success-details">
            <p>
              <strong>Date:</strong> {bookingDetails.date}
            </p>
            <p>
              <strong>Time:</strong> {bookingDetails.time}
            </p>
            <p>
              <strong>Location:</strong> {bookingDetails.place}
            </p>
          </div>
          <p className="redirect-text">Redirecting to profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <button
            type="button"
            className="back-btn"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={24} />
          </button>
          <h2>Checkout</h2>
          <div style={{ width: 24 }}></div>
        </div>

        <div className="checkout-content">
          <div className="booking-summary card">
            <h3>Booking Summary</h3>
            <div className="summary-item">
              <span>Service</span>
              <span>{bookingDetails.service}</span>
            </div>
            {bookingDetails.duration && (
              <div className="summary-item">
                <span>Duration</span>
                <span>{bookingDetails.duration}</span>
              </div>
            )}
            <div className="summary-item">
              <span>Date & Time</span>
              <span>
                {bookingDetails.date} at {bookingDetails.time}
              </span>
            </div>
            <div className="summary-item">
              <span>Location</span>
              <span className="right-align">
                {bookingDetails.place}{" "}
                {bookingDetails.address ? `(${bookingDetails.address})` : ""}
              </span>
            </div>
            <div className="summary-total">
              <span>Total Amount</span>
              <span>{bookingDetails.price}</span>
            </div>
          </div>

          <form onSubmit={handlePayment} className="payment-form card">
            <h3>Select Payment Method</h3>

            <div
              className="payment-methods"
              style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
            >
              <div
                className={`method-box ${paymentMethod === "razorpay" ? "selected" : ""}`}
                onClick={() => setPaymentMethod("razorpay")}
              >
                <CreditCard size={24} />
                <span>Razorpay</span>
              </div>
              <div
                className={`method-box ${paymentMethod === "cod" ? "selected" : ""}`}
                onClick={() => setPaymentMethod("cod")}
              >
                <Landmark size={24} />
                <span>Cash on Delivery</span>
              </div>
            </div>

            {paymentMethod === "razorpay" && (
              <div className="paypal-details slide-down">
                <p>
                  You will be securely redirected to Razorpay to complete your
                  purchase.
                </p>
              </div>
            )}

            {paymentMethod === "cod" && (
              <div className="salon-details slide-down">
                <p>
                  Your appointment will be booked. You can pay via cash when you
                  arrive or upon service completion.
                </p>
              </div>
            )}

            <button
              type="submit"
              className={`btn-pay-now ${isProcessing ? "processing" : ""}`}
              disabled={isProcessing}
            >
              {isProcessing
                ? "Processing..."
                : `Pay ${paymentMethod === "cod" ? "Later" : bookingDetails.price}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
