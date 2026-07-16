import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// import passport from "passport";
// import { Strategy as GoogleStrategy } from "passport-google-oAuth20";
import { User } from "./models/user.model.js";

const app = express();

app.use(
  cors({
    // credentials:true ke saath origin "*" nahi ho sakta — exact frontend URL chahiye
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
// app.use(passport.initialize());

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "https://aibackend-ocu5.onrender.com/api/v1/user/google/callback",
//       scope: ["profile", "email"],
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         let user = await User.findOne({ email: profile.emails[0].value });

//         if (!user) {
//           user = await User.create({
//             fullName: profile.displayName,
//             email: profile.emails[0].value,
//             googleId: profile.id,
//             avatar: profile.photos?.[0]?.value || "",
//             role: "student", // Google signup default role — profile pe baad mein change ho sakta hai
//           });
//         }

//         return done(null, user);
//       } catch (err) {
//         return done(err, null);
//       }
//     }
//   )
// );

import userRoutes from "./routes/user.route.js";
import connectionRoutes from "./routes/connection.route.js";
import messageRoutes from "./routes/message.route.js";
import resourceRoutes from "./routes/resource.route.js";
import bookingRoutes from "./routes/booking.route.js";
import notificationRoutes from "./routes/notification.route.js";
import adminRoutes from "./routes/admin.route.js";
import { errorHandler } from "./middleware/error.middleware.js";

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/connections", connectionRoutes);
app.use("/api/v1/messages", messageRoutes);
app.use("/api/v1/resources", resourceRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/admin", adminRoutes);

app.use(errorHandler);

export { app };