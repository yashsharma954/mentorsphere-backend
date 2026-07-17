import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { User } from "./models/user.model.js";

const app = express();

app.use(
  cors({
    // credentials:true ke saath origin "*" nahi ho sakta — exact frontend URL chahiye
    origin: "https://mentorsphereai-frontend.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "authorization"],
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());


import userRoutes from "./routes/user.route.js";
import connectionRoutes from "./routes/connection.route.js";
import messageRoutes from "./routes/message.route.js";
import resourceRoutes from "./routes/resource.route.js";
import bookingRoutes from "./routes/booking.route.js";
import notificationRoutes from "./routes/notification.route.js";
import adminRoutes from "./routes/admin.route.js";
import { errorHandler } from "./middleware/error.middleware.js";

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/Connections", connectionRoutes);
app.use("/api/v1/Messages", messageRoutes);
app.use("/api/v1/Resources", resourceRoutes);
app.use("/api/v1/Bookings", bookingRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/admin", adminRoutes);

app.use(errorHandler);

export { app };