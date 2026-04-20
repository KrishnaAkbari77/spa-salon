/* global process */
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// Import Models
import User from "./models/User.js";
import Appointment from "./models/Appointment.js";
import Staff from "./models/Staff.js";
import Message from "./models/Message.js";
import Feedback from "./models/Feedback.js";

import Razorpay from "razorpay";
import crypto from "crypto";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/spasalon")
  .then(async () => {
    console.log("Connected to MongoDB successfully!");

    // Create default admin if it doesn't exist
    const adminExists = await User.findOne({ email: "admin@aura.com" });
    if (!adminExists) {
      await User.create({
        name: "Administrator",
        email: "admin@aura.com",
        phone: "0000000000",
        password: "admin",
        role: "admin",
      });
      console.log("Default Admin Account Created: admin@aura.com / admin");
    }
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// ================= API ROUTES =================

// Users
app.get("/users", async (req, res) => {
  try {
    const { email, password } = req.query;
    let query = {};
    if (email) query.email = email;
    if (password) query.password = password;

    const users = await User.find(query);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/users", async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Appointments
app.get("/appointments", async (req, res) => {
  try {
    const { userId } = req.query;
    let query = {};
    if (userId) query.userId = userId;

    const appointments = await Appointment.find(query);
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/appointments", async (req, res) => {
  try {
    const newAppointment = new Appointment(req.body);
    const savedAppt = await newAppointment.save();
    res.json(savedAppt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/appointments/:id", async (req, res) => {
  try {
    const updatedAppt = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    res.json(updatedAppt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Staff
app.get("/staff", async (req, res) => {
  try {
    const staff = await Staff.find();
    res.json(staff);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/staff", async (req, res) => {
  try {
    const newStaff = new Staff(req.body);
    const savedStaff = await newStaff.save();
    res.json(savedStaff);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/staff/:id", async (req, res) => {
  try {
    await Staff.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Messages
app.get("/messages", async (req, res) => {
  try {
    const { userId } = req.query;
    let query = {};
    if (userId) query.userId = userId;

    const messages = await Message.find(query);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/messages", async (req, res) => {
  try {
    const newMessage = new Message(req.body);
    const savedMessage = await newMessage.save();
    res.json(savedMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch("/messages/:id", async (req, res) => {
  try {
    const updatedMessage = await Message.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    res.json(updatedMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Feedbacks
app.get("/feedbacks", async (req, res) => {
  try {
    const { userId, status } = req.query;
    let query = {};
    if (userId) query.userId = userId;
    if (status) query.status = status;

    const feedbacks = await Feedback.find(query);
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/feedbacks", async (req, res) => {
  try {
    const newFeedback = new Feedback(req.body);
    const savedFeedback = await newFeedback.save();
    res.json(savedFeedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch("/feedbacks/:id", async (req, res) => {
  try {
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    res.json(updatedFeedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});

// Razorpay Integration
const razorpay = new Razorpay({
<<<<<<< HEAD
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_Sespjc2xXLVyJx',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '30FXhXAHVY6PSGyKPDmbNETY',
}); 
=======
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_Sespjc2xXLVyJx",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "30FXhXAHVY6PSGyKPDmbNETY",
});
>>>>>>> 19f03e179229129838e64c6a8b556ab8334ac9c4

// Payment Endpoints
app.post("/payment/orders", async (req, res) => {
  try {
    const { amount, currency } = req.body;

    const options = {
      amount: amount * 100, // amount in smallest currency unit
      currency: currency || "INR",
      receipt: `receipt_order_${Math.random() * 10000}`,
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).send("Some error occured");
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/payment/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", razorpay.key_secret)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      return res.status(200).json({ message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
