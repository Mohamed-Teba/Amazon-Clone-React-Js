# 🛒 Amazon Clone - E-Commerce Powerhouse (React JS + Tailwind CSS)

Welcome to the **Amazon Clone**, a full-stack e-commerce platform meticulously crafted to replicate the core functionalities of Amazon.com. Built with modern web technologies, this project combines a sleek, responsive UI with robust backend integration for a seamless shopping experience. Powered by **React JS**, **Firebase**, **Stripe**, and styled with **Tailwind CSS** and **Material-UI**, this clone is designed for scalability, performance, and developer-friendly customization.

---

## 🔥 Live Demo

Experience the app in action! Browse products, add to cart, and simulate payments in a fully functional e-commerce environment:
- 👉 [Explore the Live Website](https://mohamed-teba.github.io/Amazon-Clone-React-Js/)  

---

## ✨ Key Features

This Amazon Clone is packed with real-world e-commerce features to provide an authentic shopping experience:

- 🔐 **User Authentication**:
    - Secure sign-up and login using **Firebase Authentication** (Email/Password). Forgot password and profile management included.  
- 🛍 **Product Listings**:
    - Dynamic product catalog with advanced filtering (by category, price, or ratings) and search functionality.
- 🛒 **Shopping Cart**:
    - Add, remove, or update quantities in the cart with real-time updates and total price calculations.
- ❤️ **Wishlist**:
    - Save favorite items for future purchases (feature in active development).
- 💳 **Stripe Payment Gateway**:
    - Secure and seamless checkout flow using **Stripe** in test mode for realistic payment simulation.
- 🧾 **Order History**:
    - View detailed summaries of past orders, including timestamps, items, and totals.
- 🔄 **State Persistence**:
    - Leverage **Redux Persist** to retain cart and authentication state even after page refreshes or logouts.
- 🌐 **Responsive Design**:
    - Fully optimized for mobile, tablet, and desktop using **Tailwind CSS** and **Material-UI** for a polished, accessible UI.
- 🔥 **Firebase Backend**:
    - Robust backend powered by **Firebase Auth** for user management and **Firestore** for storing products, orders, and user data.
- ⚡ **Performance Optimized**:
    - Lazy-loaded components, optimized images, and efficient state management for a blazing-fast user experience.
- 🔍 **Search & Filters**:
    - Search products by name or description and filter by categories, price ranges, or customer ratings.

---

## 🧩 Core Components

The application is modular, built with reusable React components for maintainability and scalability. Below are the primary components:

- **Header**: 
  - Displays the logo, search bar, navigation links, cart preview (with item count), and user authentication status.
  - Sticky navigation ensures seamless access across the app.
- **Footer**: 
  - Includes branding, quick links (e.g., About, Contact, Terms), and social media icons.
  - Responsive and minimalistic design for a clean look.
- **Login/Signup**: 
  - User-friendly forms for registration and login with Firebase Authentication.
  - Includes input validation and error handling for a smooth UX.  
- **Products**: 
  - Dynamic product grid with search, filters, and sorting options.
  - Clicking a product opens a modal with detailed information (images, description, price, reviews).
- **Cart**: 
  - Displays cart items with quantity controls, remove options, and a dynamic total price.
  - Persists data across sessions using Redux Persist.
- **Checkout**: 
  - Multi-step checkout process with address input and Stripe-powered payment integration.
  - Displays order summary before finalizing the purchase.
- **Order History**: 
  - Lists all previous orders with details like order ID, date, items, and total cost.
  - Accessible only to authenticated users.
- **Error Page**: 
  - Custom 404 page and fallback UI for handling errors gracefully.

---

## 📋 Project Management

Track the development progress, tasks, and component details on our **Notion workspace**:  
- 👉 [Notion Project Board](https://www.notion.so/Amazon-Clone-Project-Tracker-1234567890abcdef)  

The Notion board includes:
- Task assignments for each component (Header, Footer, Products, etc.).
- Development timelines and milestones.
- Bug tracking and feature requests.
- Documentation for APIs and configurations.

---

## 🛠 Tech Stack

The Amazon Clone is built with a modern, industry-standard tech stack to ensure performance, scalability, and developer productivity.

| **Category**         | **Technologies**                              |
|----------------------|-----------------------------------------------|
| **Frontend**         | React JS (18.2.0), React Router (6.14.2)      |
| **State Management** | Redux Toolkit (1.9.5), Redux Persist          |
| **Backend**          | Firebase Auth (10.1.0), Firestore             |
| **Styling**          | Tailwind CSS (3.3.3), Material-UI (5.14.0)    |
| **Payments**         | Stripe (stripe/react-stripe-js 2.2.0)        |
| **API Requests**     | Axios (1.4.0)                                 |
| **Animations**       | Framer Motion (10.12.22)                      |

### 📦 Key Dependencies

Here’s a snapshot of the core packages used in the project:

```json
{
  "dependencies": {
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "react-router-dom": "6.14.2",
    "firebase": "10.1.0",
    "@reduxjs/toolkit": "1.9.5",
    "redux-persist": "6.0.0",
    "axios": "1.4.0",
    "@stripe/react-stripe-js": "2.2.0",
    "@stripe/stripe-js": "2.2.0",
    "@mui/material": "5.14.0",
    "@emotion/react": "11.11.1",
    "@emotion/styled": "11.11.0",
    "tailwindcss": "3.3.3",
    "framer-motion": "10.12.22"
  }
}
```

---

## 🚀 Getting Started

Follow these steps to set up and run the Amazon Clone locally on your machine.

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- A **Firebase** project (for Auth and Firestore)
- A **Stripe** account (for test-mode payment integration)

### Installation Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Mohamed-Teba/Amazon-Clone-React-Js.git
   cd Amazon-Clone-React-Js
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   - Create a `.env` file in the project root.
   - Add your Firebase and Stripe configuration:
     ```env
     REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
     REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
     REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
     REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
     REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
     REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
     REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key
     ```

4. **Start the Development Server**:
   ```bash
   npm start
   ```

   The app will run at `http://localhost:3000`.

5. **Stripe Integration**:
   - Obtain test API keys from your [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys).
   - Update the `.env` file with your Stripe public key.
   - Test payments using Stripe’s test card numbers (e.g., `4242 4242 4242 4242`).

6. **Firebase Setup**:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
   - Enable **Authentication** (Email/Password) and **Firestore Database**.
   - Add your Firebase config to the `.env` file.

---

## 🧠 Developer Notes

- **Firebase Backend**: 
  - **Authentication**: Handles user signup, login, and session management.
  - **Firestore**: Stores product data (name, price, description, images), user profiles, and order history.
  - Firestore rules are configured for secure read/write access.
- **Stripe Payments**: 
  - Configured in test mode for safe payment simulation.
  - Supports card payments with real-time validation and error handling.
- **State Management**:
  - **Redux Toolkit** simplifies state management for cart, user, and products.
  - **Redux Persist** ensures cart and auth data persist across sessions.
- **Responsive Design**:
  - Built mobile-first with **Tailwind CSS** for rapid styling.
  - Enhanced with **Material-UI** components for modals, buttons, and forms.
- **Performance**:
  - Lazy-loaded product images and components to reduce initial load time.
  - Optimized API calls with Axios for fetching product data.
- **Accessibility**:
  - Semantic HTML, ARIA labels, and keyboard navigation for inclusive UX.
- **Future Enhancements**:
  - Wishlist feature (in progress).
  - Product reviews and ratings system.
  - Advanced search with autocomplete.

---

## 🤝 Contributing

We welcome contributions to make this project even better! To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Make your changes and commit (`git commit -m "Add YourFeature"`).
4. Push to your branch (`git push origin feature/YourFeature`).
5. Open a Pull Request with a clear description of your changes.

Please ensure your code follows the project’s coding standards and includes tests where applicable. Check the [Notion Project Board](https://www.notion.so/Amazon-Clone-Project-Tracker-1234567890abcdef) for open tasks and feature requests.

### Current Contributors
- **Mohamed Teba** (Lead Developer)
- **Youssef** (Frontend & UI Design)
- **Faris** (Backend Integration)
- **Ahmed** (Payment Gateway Setup)
- **Khaled** (Testing & QA)

---

## 📜 License

This project is licensed under the **MIT License**. Feel free to use, modify, and distribute the code as per the license terms.

---

## ⭐ Show Your Support

If you like this project, please:
- ⭐ **Star** the repository on GitHub!
- 🍴 **Fork** it to create your own version.
- 📢 Share it with your network to spread the word!

Let’s build the ultimate e-commerce experience together! 🚀
