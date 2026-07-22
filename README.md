# 🎓 MentorSphere (Backend)

Backend API for MentorSphere — a full-stack college mentorship platform that connects students with mentors, alumni, and recruiters for guidance, resource sharing, and placement help.

🌐 Live API:
https://mentorsphere-backend.onrender.com

---

## 🚀 Features

- 🔐 JWT Authentication (Access + Refresh Tokens)
- 👥 Multi-Role Users (Student / Mentor / Recruiter / Admin)
- 🤝 Connection System (Send / Accept / Reject Requests)
- 💬 1:1 Messaging Between Connections
- 📚 Resource Sharing (Public Library + Connection-only Access Control)
- 📅 Mentorship Session Booking with Slot Management
- 🔔 In-app Notifications
- 📄 Avatar & Resume Upload (Cloudinary)
- 🛠️ Admin Dashboard (User Management + Platform Stats)
- 🗄️ MongoDB Database Integration
- 🔒 Protected REST APIs

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- Cloudinary
- Multer
- bcrypt

---

## 📂 Project Structure

```
mentorsphere-backend
│
├── src
│   ├── controllers      # Business logic for APIs
│   ├── db               # MongoDB database connection
│   ├── middleware       # JWT auth, role-based access, file upload
│   ├── models           # Mongoose schemas
│   ├── routes           # Express API routes
│   └── utils            # Helper functions (ApiError, ApiResponse, etc.)
│
├── app.js               # Express app configuration
├── index.js             # Entry point
├── .gitignore
├── package.json
└── README.md
```

## 📌 Main API Endpoints

### Authentication & Profile
```
POST   /api/v1/user/registeruser
POST   /api/v1/user/login
POST   /api/v1/user/logout
POST   /api/v1/user/refresh-token
GET    /api/v1/user/me
GET    /api/v1/user/search
GET    /api/v1/user/:userId
PATCH  /api/v1/user/update-profile
PATCH  /api/v1/user/update-avatar
PATCH  /api/v1/user/update-resume
```

### Connections
```
POST   /api/v1/connections/send
PATCH  /api/v1/connections/:connectionId/respond
GET    /api/v1/connections/my-connections
GET    /api/v1/connections/pending
GET    /api/v1/connections/sent
```

### Messages
```
POST   /api/v1/messages/send
GET    /api/v1/messages/conversations
GET    /api/v1/messages/:userId
PATCH  /api/v1/messages/:userId/read
```

### Resources
```
POST    /api/v1/resources/upload
GET     /api/v1/resources/public
GET     /api/v1/resources/shared
POST    /api/v1/resources/:resourceId/share
GET     /api/v1/resources/:resourceId/download
DELETE  /api/v1/resources/:resourceId
```

### Bookings
```
POST    /api/v1/bookings/slots
DELETE  /api/v1/bookings/slots/:slotId
GET     /api/v1/bookings/mentor/:mentorId/slots
POST    /api/v1/bookings/book
PATCH   /api/v1/bookings/:bookingId/cancel
GET     /api/v1/bookings/my-bookings
```

### Notifications
```
GET    /api/v1/notifications
PATCH  /api/v1/notifications/:notificationId/read
PATCH  /api/v1/notifications/read-all
```

### Admin
```
GET     /api/v1/admin/users
DELETE  /api/v1/admin/users/:userId
GET     /api/v1/admin/stats
```

---

## ⚙️ Environment Variables

Create a `.env` file and add:
```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=https://mentorsphereai-frontend.vercel.app/
NODE_ENV=production
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## ⚙️ Installation

```bash
git clone https://github.com/YOUR_USERNAME/mentorsphere-backend.git
cd mentorsphere-backend
npm install
npm run dev
```

---

## 🌐 Frontend Repository
https://github.com/yashsharma954/mentorsphereai-frontend

---

## 👨‍💻 Author
[Yash Sharma]
LinkedIn:
https://linkedin.com/in/yash-sharma-342b65381
GitHub:
https://github.com/yashsharma954
