# Pollify 🎉

Pollify is a real-time polling platform built with **React**, **Express**, **MongoDB**, and **Socket.IO**.  
Create polls, join sessions, and see live results with instant vote updates!

---

## 🚀 Features

- **Google Authentication** (OAuth)
- **Create Polls** with custom options and expiry time
- **Join Polls** as a participant using a session code
- **Real-time Voting** with instant result updates (Socket.IO)
- **Live Results Visualization** (Bar Chart)
- **Poll Expiry Timer** (auto-expire and disables voting)
- **Responsive UI** for desktop and mobile
- **Admin Panel**: View, expire, and delete your polls
- **Prevents Double Voting** (localStorage + server-side checks)
- **Secure API** with JWT authentication

---

## 🖥️ Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Chart.js, React Router, React Toastify
- **Backend:** Express.js, MongoDB, Mongoose, Socket.IO, JWT, Google Auth

---

## Deployment

The app is deployed at: [https://pollify-one.vercel.app](https://pollify-one.vercel.app)

---

## 📦 Project Structure

```
pollify/
  client/      # React frontend
  server/      # Express backend
```

---

## 🛠️ Setup Instructions

### 1. Clone the repository

```sh
git clone https://github.com/ridham1906/pollify.git
cd pollify
```

---

### 2. Setup the Backend

```sh
cd server
cp .env_Example .env
# Fill in your MongoDB URI, Google Client ID, JWT secret, and frontend URL in .env

npm install
npm start
```

- The backend runs on `http://localhost:4000` by default.

---

### 3. Setup the Frontend

```sh
cd ../client
cp .env_Example .env
# Set VITE_SERVER_API to your backend API URL (e.g., http://localhost:4000/api)
# Set VITE_GOOGLE_CLIENT_ID to your Google OAuth client ID

npm install
npm run dev
```

- The frontend runs on `http://localhost:5173` by default.

---

### 4. Usage

- **Create an account** using Google login.
- **Create a poll** and share the session code.
- **Participants** can join using the session code and vote in real-time.
- **See live results** and manage your polls from your dashboard.

---

## 📋 Environment Variables

### Backend (`server/.env`)
```
MONGO_URI=your_mongodb_uri
PORT=4000
GOOGLE_CLIENT_ID=your_google_client_id
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

### Frontend (`client/.env`)
```
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_SERVER_API=http://localhost:4000/api
```

---

## 📸 Walkthrough Video

Watch on Youtube :   [ https://youtu.be/tOaw61t219w ]

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙋‍♂️ Author

- [@ridham1906](https://github.com/ridham1906)

---

**Enjoy real-time polling with Pollify!**
