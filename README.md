# 🛒 Amazon Clone (React JS + Tailwind CSS)

A full-stack Amazon.com clone developed with React JS, Firebase backend, and Stripe payments. Focuses on real-world e-commerce features and a modern, smooth UI.

---

## 🔥 Live Demo

[👉 View Live Website](#) *(Add your demo link here)*

---

## 📸 Preview

| Home Page | Product Page | Cart Page |
|-----------|--------------|-----------|
|![Home](./public/screenShot.png) |

---

## ⚙ Features

- 🔐 **User Authentication:** Register/Login via Firebase Auth (Email & Password)
- 🛍 **Product Listings:** Browse products with filters
- 🛒 **Cart System:** Add, remove, and update items in your cart
- ❤ **Wishlist:** Save items you love (coming soon)
- 💳 **Stripe Payment:** Real-time checkout and payment flow (test mode)
- 🧾 **Order History:** See all previous orders
- 🔄 **State Persist:** Redux-persist keeps cart/auth data after refresh
- 🌐 **Responsive Design:** Perfect on mobile, tablet, desktop (Tailwind & MUI)
- 🔥 **Firebase Backend:** Auth & Firestore for users/products/orders

---

## 🧩 Main Components

- `Header`: Logo, search, navigation, cart preview, user status
- `Footer`: Branding, quick links
- `Login`: Firebase signup/login forms & validation
- `Products`: Product grids, search, filters, details modal
- `Cart`: Cart view, quantity control, remove items
- `Checkout`: Stripe integration/payment flow
- `Order`: Summaries, previous orders
- `Error`: 404 or fallback error UI

---

## 🛠 Tech Stack

| Frontend   | State Management        | Backend              | Styling            | Payment |
|------------|------------------------|----------------------|--------------------|---------|
| React JS   | Redux Toolkit + Persist| Firebase Auth/Firestore| Tailwind CSS + MUI|  Stripe  |

### 📦 Key Packages


- "react": "^18.2.0"
- "firebase": "^10.1.0"
- "@reduxjs/toolkit": "^1.9.5"
- "react-router-dom": "^6.14.2"
- "axios": "^1.4.0"
- "@stripe/react-stripe-js": "^2.2.0"
- "@mui/material": "^5.14.0"
- "tailwindcss": "^3.3.3"
- "framer-motion": "^10.12.22"


---

## 🚀 Getting Started

1. Clone the repo:

   
   git clone https://github.com/Mohamed-Teba/Amazon-Clone-React-Js.git
   

2. Install all dependencies:

   
   npm install
   

3. Start the development server:

   
   npm start
   

4. For Stripe integration:  
   - Use test API keys from your Stripe dashboard.
   - Update `.env` with Firebase and Stripe config.

---

## 🧠 Notes

- Firebase used for Auth, Firestore for products, orders, user info.
- Stripe configured for secure test-mode payments.
- Redux Persist keeps cart/auth after refresh/logout.
- UI tested mobile-first; ultra-responsive and accessible.
- Open-source and ready for pull requests! 🌍

---

## 🤝 Contributors

- Mohamed Teba (Me)
- Youssed  
- Faris
- Ahmed
- Khaled

---

## ⭐ Like It? Star, fork!
