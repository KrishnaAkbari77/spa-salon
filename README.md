# Aura — Spa & Salon Booking Platform

A full-stack spa and salon booking platform with AI-powered customer support, end-to-end payment integration, and separate user and admin dashboards.

**Live Demo:** https://kaleidoscopic-kataifi-f85220.netlify.app/  
**Backend API:** https://aura-spa-and-salon.onrender.com

---

## Features

### Customer (User)
- Browse services with pricing and treatment details
- View specialists/therapists and select preferred one
- Book appointments (at parlor or at home) with date and time selection
- Secure online payment via **Razorpay** (Cards, UPI, Netbanking) or Cash on Delivery
- View and manage upcoming/past bookings from profile dashboard
- Cancel or reschedule appointments (free up to 4 hours before slot)
- Submit feedback and reviews
- **Aura AI Chatbot** — AI assistant for service queries, booking guidance, payment info, cancellation policy, and specialist recommendations

### Admin
- Manage staff — add, update, remove specialists
- View and manage all appointments across users
- User directory management
- Moderate customer feedback and support messages
- Analytics dashboard with booking and revenue trends (Recharts)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, React Router DOM, Redux Toolkit |
| Backend | Node.js, Express.js 5 |
| Database | MongoDB (Mongoose) |
| Payments | Razorpay SDK |
| AI Chatbot | Claude / Gemini API |
| Charts | Recharts |
| Styling | CSS3, Lucide React |
| Deployment | Netlify (frontend), Render (backend) |

---

## API Routes (18 endpoints)

| Module | Routes |
|---|---|
| Users | GET, POST, DELETE |
| Appointments | GET, POST, PUT, DELETE |
| Staff | GET, POST, PUT, DELETE |
| Messages | GET, POST, PATCH |
| Feedbacks | GET, POST, PATCH |
| Payments | POST /payment/orders, POST /payment/verify |

---

## Payment Flow

1. User selects service and completes booking form
2. Frontend calls `/payment/orders` → backend creates Razorpay order via SDK
3. Razorpay modal opens for card/UPI/Netbanking payment
4. On completion, Razorpay returns a cryptographic signature
5. Frontend sends signature to `/payment/verify` → backend validates using **HMAC-SHA256**
6. On success, booking is saved to MongoDB and user is redirected to confirmation

---

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB Atlas account
- Razorpay account (Key ID + Secret)
- AI API key (Claude or Gemini)

### Installation

```bash
git clone https://github.com/KrishnaAkbari77/spa-salon.git
cd spa-salon
npm install
```

### Environment Variables

Create a `.env` file in the root:

```env
VITE_API_URL=http://localhost:3000
VITE_AI_API_KEY=your_ai_api_key
```

Create a `.env` file inside `/server`:

```env
MONGO_URI=your_mongodb_atlas_connection_string
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
PORT=3000
```

### Run the App

```bash
# Run frontend and backend together
npm run dev:all

# Or separately
npm run dev        # Frontend → http://localhost:5173
npm run server     # Backend  → http://localhost:3000
```

---
