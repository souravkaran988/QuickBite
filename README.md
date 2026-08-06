# 🍔 QuickBite — Food Delivery Platform

<img src="./screenshots/home.png" alt="QuickBite Home Page" width="100%"/>

A full-stack food delivery web app where users discover restaurants, explore menus, and order in a few taps — with live order tracking and secure payments.

🔗 **Live Demo:** [quick-bite-alpha-six.vercel.app](https://quick-bite-alpha-six.vercel.app)

![React](https://img.shields.io/badge/-React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/-Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/-Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/-MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Vercel](https://img.shields.io/badge/-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

---

## 📸 More Screenshots

<img src="./screenshots/login.png" alt="Login Page" width="49%"/> <img src="./screenshots/admin-dashboard.png" alt="Admin Dashboard" width="49%"/>

---

## ✨ Features

**For customers**
- 🔐 Login with email/password or Google
- 🏪 Browse restaurants and menus
- 🛒 Cart, checkout, and secure Razorpay payments
- 📦 Real-time order tracking (Socket.io)
- 🧾 Order history

**For admins**
- 🏪 Add/edit/delete restaurants
- 🍽️ Manage menu items with image upload (Cloudinary)
- 📦 Manage and update order statuses

---

## 🛠️ Tech Stack

**Frontend:** React 19, Vite, Redux Toolkit, React Router v7, Tailwind CSS, Axios, Socket.io-client
**Backend:** Node.js, Express, MongoDB (Mongoose), JWT, Passport.js (Google OAuth), Socket.io
**Other:** Cloudinary (uploads), Razorpay (payments)
**Hosting:** Vercel (frontend) · Render (backend) · MongoDB Atlas (database)

---

## 📁 Project Structure

```
QuickBite/
├── client/                      # React frontend (Vite)
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── AdminRoute.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── AdminMenuItems.jsx
│   │   │   │   ├── AdminOrders.jsx
│   │   │   │   └── AdminRestaurants.jsx
│   │   │   ├── AuthSuccess.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── OrderHistory.jsx
│   │   │   ├── OrderTracking.jsx
│   │   │   ├── Register.jsx
│   │   │   └── RestaurantDetail.jsx
│   │   ├── redux/
│   │   │   ├── slices/
│   │   │   │   ├── authSlice.js
│   │   │   │   └── cartSlice.js
│   │   │   └── store.js
│   │   ├── utils/
│   │   │   └── axios.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env
│   ├── package.json
│   └── vite.config.js
│
├── server/                      # Express backend
│   ├── config/
│   │   ├── cloudinary.js
│   │   ├── db.js
│   │   └── passport.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── menuController.js
│   │   ├── orderController.js
│   │   ├── paymentController.js
│   │   └── restaurantController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models/
│   │   ├── MenuItem.js
│   │   ├── Order.js
│   │   ├── Restaurant.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── menuRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── restaurantRoutes.js
│   ├── .env
│   ├── index.js
│   ├── package.json
│   └── seed.js
│
├── screenshots/                 # Images used in this README
└── README.md
```

---

## 🚀 Local Setup

**1. Clone**
```bash
git clone https://github.com/souravkaran988/QuickBite.git
cd QuickBite
```

**2. Backend**
```bash
cd server
npm install
```
Create `server/.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLIENT_URL=http://localhost:5173
```
Seed an admin user, then start the server:
```bash
node seed.js
npm run dev
```
Default admin login → `admin@quickbite.com` / `admin123`

**3. Frontend**
```bash
cd client
npm install
```
Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```
```bash
npm run dev
```

App runs at `http://localhost:5173`, API at `http://localhost:5000`.

---

## 🌐 Deployment

- **Backend (Render):** Root directory `server` · Build `npm install` · Start `npm start` · add all env vars above
- **Frontend (Vercel):** Root directory `client` · add `VITE_API_URL` (your Render URL + `/api`) and `VITE_RAZORPAY_KEY_ID`
- Update CORS `origin` in `server/index.js` and `CLIENT_URL` in Render to your live Vercel URL

---

## 👤 Author

**Sourav Karan** — [GitHub](https://github.com/souravkaran988)

⭐ If you like this project, consider giving it a star!