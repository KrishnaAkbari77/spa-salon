/* global process */
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dns from "dns";

// Set DNS servers to Google's public DNS to bypass local router DNS resolution limits for MongoDB Atlas
try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (err) {
  console.warn("Unable to set Google DNS servers:", err.message);
}

// Import Models
import User from "./models/User.js";
import Appointment from "./models/Appointment.js";
import Staff from "./models/Staff.js";
import Message from "./models/Message.js";
import Feedback from "./models/Feedback.js";

import Razorpay from "razorpay";
import crypto from "crypto";
import { GoogleGenerativeAI } from "@google/generative-ai";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


console.log("========================================");
console.log("SERVER STARTING...");
console.log("VERSION: 2.2 (Ultra Bypass Mode)");
console.log("========================================");

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Error handling for JSON parsing/limit
app.use((err, req, res, next) => {
  if (err) {
    console.error("Server Middleware Error:", err.message);
    return res.status(err.status || 500).json({ error: err.message });
  }
  next();
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/spasalon";
mongoose
  .connect(MONGODB_URI)
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

// Forcefully remove phone validation if it somehow persists
if (Staff.schema.path('phone')) {
  console.log("Removing persistent phone path...");
  Staff.schema.path('phone').required(false);
}
console.log("Staff Model initialized. Fields:", Object.keys(Staff.schema.paths));

// Forcefully remove userId validation for guest bookings if it persists
if (Appointment.schema.path('userId')) {
  Appointment.schema.path('userId').required(false);
}

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
    console.log("Adding new appointment for:", req.body.userId || req.body.userName);
    const newAppointment = new Appointment(req.body);
    const savedAppt = await newAppointment.save();
    console.log("Appointment saved successfully:", savedAppt.id);
    res.json(savedAppt);
  } catch (err) {
    console.error("Error adding appointment:", err.message);
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

app.delete("/appointments/:id", async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
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
    console.log("Adding new staff (Bypassing Mongoose Validation):", req.body.name);
    
    // Ensure id exists (following previous pattern)
    const count = await mongoose.connection.db.collection('staffs').countDocuments();
    const newDoc = { 
      ...req.body, 
      id: (count + 1).toString(),
      createdAt: new Date()
    };

    const result = await mongoose.connection.db.collection('staffs').insertOne(newDoc);
    console.log("Staff saved successfully via bypass:", result.insertedId);
    res.json({ ...newDoc, _id: result.insertedId });
  } catch (err) {
    console.error("Bypass Error adding staff:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.put("/staff/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    // Remove fields that shouldn't be updated or might cause issues
    delete updateData._id;
    delete updateData.id;

    const updatedStaff = await Staff.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: false }
    );

    if (!updatedStaff) {
      return res.status(404).json({ error: "Staff member not found" });
    }

    res.json(updatedStaff);
  } catch (err) {
    console.error("Error updating staff:", err.message);
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

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log("========================================");
  console.log(`Express server running on http://localhost:${PORT}`);
  console.log("SERVER VERSION: 2.2 (Ultra Bypass Mode)");
  console.log("========================================");
});

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_Sespjc2xXLVyJx",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "30FXhXAHVY6PSGyKPDmbNETY",
});

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

// ================= CHATBOT ENDPOINT =================
app.post("/chat", async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  // 1. Check if Gemini API key is configured
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log("[Chatbot] GEMINI_API_KEY not found in environment. Using fallback assistant.");
    const reply = getLocalChatFallback(message);
    // Mimic API delay for realistic feel
    await new Promise((resolve) => setTimeout(resolve, 800));
    return res.json({ reply });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `You are Aura, the warm and welcoming AI Customer Support Assistant for "Aura Spa & Salon". 
Your goal is to assist users in a professional, serene, and helpful manner.

Here is the key context about Aura Spa & Salon:
1. SERVICES & PRICING:
   - Massage Therapy:
     * Swedish Massage (60/90 mins) - ₹2,000 / ₹3,000. Relaxing, light-to-medium pressure.
     * Deep Tissue Massage (60/90 mins) - ₹2,500 / ₹3,700. Relieves deep muscle tension.
     * Hot Stone Massage (90 mins) - ₹4,500. Warming volcanic stones.
   - Facials & Skincare:
     * HydraFacial (60 mins) - ₹3,500. Deep cleansing, exfoliation, hydration.
     * Charcoal Detox Facial (60 mins) - ₹2,000. Removes impurities.
     * Glow Facial (45 mins) - ₹1,500. Quick skin brightening.
   - Hair Care:
     * Spa Haircut & Styling - ₹1,200. Includes wash and blow-dry.
     * Hair Spa Treatment - ₹2,500. Nourishing deep conditioning.
     * Global Hair Coloring - ₹3,800+. Premium hair dye.
   - Body Scrubs & Wraps:
     * Salt Glow Body Scrub (45 mins) - ₹2,500. Full body exfoliation.
     * Herbal Mud Wrap (60 mins) - ₹3,500. Detoxifying and skin-smoothing.

2. BOOKING AN APPOINTMENT:
   - Customers can book online by visiting the Booking page at '/book'.
   - They can select their desired service, duration, location (At Parlor or At Home), date, time, and specialist.
   - We support online payment via Razorpay or Cash on Delivery (COD).

3. PHYSICAL LOCATIONS:
   - Ahmedabad Branch (Downtown Sanctuary): 101, Shivalik High Street, Vastrapur, Ahmedabad (Open Daily: 8:00 AM - 10:00 PM)
   - Surat Branch (Coastal Retreat): 402, Rajhans Heights, Piplod, Surat (Open Daily: 9:00 AM - 9:00 PM)
   - Mumbai Branch: 456 Marine Drive, Mumbai (Open Daily: 9:00 AM - 10:00 PM)
   - Delhi Branch: 12, Connaught Place, New Delhi (Open Daily: 9:00 AM - 10:00 PM)


4. REFUND & CANCELLATION POLICY:
   - Appointments can be cancelled or rescheduled up to 4 hours in advance free of charge.
   - Late cancellations or no-shows may incur a 50% fee.

5. PAYMENT INTEGRATION:
   - We support 100% secure payments via Razorpay (Credit cards, UPI, Netbanking) during checkout, or Cash on Delivery (COD) which allows customers to pay after service completion.

Guidelines:
- Keep your responses relatively concise, serene, and friendly (max 2-3 short paragraphs).
- Direct customers to specific pages if appropriate: '/book' for booking, '/user' for checking their profile or history, '/services' to view the catalog, and '/offers' to view promotions.
- Be polite. If you don't know something, offer to let them contact us directly via the contact page or message forms.
`
    });

    // Format chat history to Gemini structure
    const formattedHistory = (history || []).map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content || msg.text || "" }],
    }));

    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage(message);
    const replyText = result.response.text();

    res.json({ reply: replyText });
  } catch (error) {
    console.error("[Chatbot Error]:", error);
    // Fall back to local rules if Gemini API fails during live call
    const reply = getLocalChatFallback(message);
    res.json({ reply, error: error.message });
  }
});

// Serve static built files from client (Vite build)
app.use(express.static(path.join(__dirname, "../dist")));

// SPA Catch-all Route: redirect non-API client requests to the single-page application entry point
app.get("*any", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

// Helper for local keyword chat fallback
function getLocalChatFallback(message) {
  const msg = message.toLowerCase().trim();
  
  if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey") || msg.includes("greetings")) {
    return "Hello! I am Aura, your virtual wellness assistant at Aura Spa & Salon. How can I help you relax or plan your visit today?";
  }
  
  // 1. Cancellation / Refund / Rescheduling (Priority over general booking)
  if (
    msg.includes("cancel") || 
    msg.includes("cacel") || 
    msg.includes("cancle") || 
    msg.includes("cancell") || 
    msg.includes("refund") || 
    msg.includes("reschedul") || 
    msg.includes("policy") ||
    msg.includes("delete") ||
    msg.includes("remove") ||
    msg.includes("change")
  ) {
    return "You can cancel or reschedule appointments free of charge up to 4 hours in advance. To view or cancel your upcoming bookings, visit your Profile page at /user. Late cancellations/no-shows are subject to a 50% fee.";
  }
  
  if (msg.includes("price") || msg.includes("pricing") || msg.includes("cost") || msg.includes("rate") || msg.includes("charge")) {
    return "We offer premium spa & beauty treatments. Here are some of our popular services:\n\n• Swedish Massage (60 mins) — ₹2,000\n• Deep Tissue Massage (60 mins) — ₹2,500\n• HydraFacial (60 mins) — ₹3,500\n• Hair Spa Treatment — ₹2,500\n• Salt Glow Body Scrub — ₹2,500\n\nYou can view the full menu on our /services page, or schedule a session directly on our /book page.";
  }
  
  if (msg.includes("book") || msg.includes("appointment") || msg.includes("apointment") || msg.includes("schedule") || msg.includes("reserve") || msg.includes("slot")) {
    return "Booking is easy! Head to our Book Appointment page at /book. You can customize your treatment type, location (At Parlor or At Home), choice of specialist, date, and time. You can choose to pay in advance via Razorpay or choose Cash on Delivery.";
  }
  
  if (msg.includes("payment") || msg.includes("razorpay") || msg.includes("pay") || msg.includes("card") || msg.includes("upi") || msg.includes("cod")) {
    return "We support secure payments via Razorpay (which accepts Credit/Debit Cards, UPI, and Netbanking) on our /checkout page. We also offer Cash on Delivery (COD), allowing you to pay in cash or via card after your treatment is complete.";
  }
  
  if (msg.includes("location") || msg.includes("address") || msg.includes("where") || msg.includes("branch") || msg.includes("store")) {
    return "We have premier Indian locations:\n1. Ahmedabad Branch: 101, Shivalik High Street, Vastrapur (Open 8 AM - 10 PM)\n2. Surat Branch: 402, Rajhans Heights, Piplod (Open 9 AM - 9 PM)\n3. Mumbai Branch: 456 Marine Drive, Mumbai (Open 9 AM - 10 PM)\n\nFind complete addresses and maps for all branches (including Delhi, Pune, and Bengaluru) on our /locations page.";
  }
  
  if (msg.includes("hour") || msg.includes("time") || msg.includes("open") || msg.includes("close")) {
    return "Our Ahmedabad branch is open daily from 8:00 AM to 10:00 PM. Our Surat branch is open daily from 9:00 AM to 9:00 PM. Our Mumbai branch is open daily from 9:00 AM to 10:00 PM.";
  }
  
  if (msg.includes("offer") || msg.includes("discount") || msg.includes("coupon") || msg.includes("promo") || msg.includes("deal")) {
    return "We offer seasonal discounts and packages! Check out all active deals on our /offers page, including first-time guest privileges.";
  }
  
  if (msg.includes("specialist") || msg.includes("staff") || msg.includes("therapist") || msg.includes("stylist") || msg.includes("therapists")) {
    return "Our team consists of highly trained and certified therapists and styling specialists. You can read their profiles on our /specialists page and select your preferred specialist when booking at /book.";
  }
  
  return "That sounds wonderful! As your wellness assistant, I'd suggest checking our list of premium services at /services, or booking your serene getaway at /book. Let me know if you have any questions about specific massages, facials, or styling treatments!";
}

