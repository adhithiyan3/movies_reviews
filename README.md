# 🎬 CineNote – Movie Review Platform

A full-stack movie review platform built with **Node.js, Express, MongoDB, React, and TailwindCSS**.  
Users can browse movies, post reviews, manage their watchlist, and admins can add new movies.

---

## 🚀 Features

- 👤 User authentication (JWT based)
- 🎥 Browse movies with search & filters
- ⭐ Add reviews & ratings (one per user per movie)
- 📊 Auto-calculated average rating & review count
- 📝 User profile & review history
- 📌 Watchlist (add/remove movies)
- 🔑 Admin-only: add movies manually
- ⚡ REST API + React frontend

---

---

## ⚙️ Backend Setup (server)

### 1. Install dependencies

cd server
npm install

## ⚙️ Backend Setup (server)

### 1. Install dependencies

cd client
npm install

---

## 🔑 Authentication Flow

- **Register** → `POST /api/auth/register`  
- **Login** → `POST /api/auth/login` → returns `{ token }`  
- Store token in **localStorage**  
- Axios automatically attaches token in requests  
  ⚠️ No `Bearer`, just `token` header  

---

## 📡 API Endpoints

### 🎥 Movies
- `GET /api/movies` → list movies (search, pagination, filters)  
- `GET /api/movies/:id` → single movie  
- `POST /api/movies` → add movie (**admin only**)  

### ⭐ Reviews
- `GET /api/movies/:id/reviews` → get reviews  
- `POST /api/movies/:id/reviews` → add/update review (**auth required**)  

### 👤 Users
- `GET /api/users/:id` → get profile  
- `PUT /api/users/:id` → update profile  

### 📌 Watchlist
- `GET /api/users/:id/watchlist` → get watchlist  
- `POST /api/users/:id/watchlist` → add movie  
- `DELETE /api/users/:id/watchlist/:movieId` → remove movie  
---
## 📌 Tech Stack

### 🖥 Backend
- **Node.js** + **Express**
- **MongoDB** with **Mongoose**
- **Zod** for validation
- **JWT** for authentication

### 🎨 Frontend
- **React** (Vite for build tool)
- **TailwindCSS** for styling
- **Axios** for API calls

### 🔑 Authentication
- **JWT** stored in `localStorage`
- Token sent via custom `token` header (⚠️ not Bearer)

### 🗄 Database
- **MongoDB** with **Mongoose ORM**
