import { Router } from "express";
// import passport from "passport";
import {
  Registeruser,
  Loginuser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  updateUserprofile,
  changeCurrentPassword,
  updateAvatar,
  updateResume,
  searchMentors,
  getUserById,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const router = Router();

// Public routes
router.route("/Registeruser").post(Registeruser);
router.route("/Login").post(Loginuser);
router.route("/refresh-token").post(refreshAccessToken);

// Google Oauth
// router.get("/google", passport.authenticate("google", { scope: ["Profile", "email"] }));
// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     failureRedirect: "/auth?error=google_failed",
//     session: false,
//   }),
//   async (req, res) => {
//     try {
//       if (!req.user) {
//         return res.redirect("/auth?error=user_not_found");
//       }

//       const accessToken = req.user.generateAccessToken();

//       res.redirect(
//         `https://aifrontend-ce3u.vercel.app/auth?token=${accessToken}&userId=${req.user._id}`
//       );
//     } catch (error) {
//       console.error("Google Callback Error:", error);
//       res.redirect("/auth?error=server_error");
//     }
//   }
// );

// Protected routes — verifyJWT ke peeche
router.route("/me").get(verifyJWT, async (req, res) => {
  return res.json(new ApiResponse(200, req.user, "User Profile fetched successfully"));
});
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/update-Profile").patch(verifyJWT, updateUserprofile);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/update-avatar").patch(verifyJWT, upload.single("avatar"), updateAvatar);
router.route("/update-resume").patch(verifyJWT, upload.single("resume"), updateResume);
router.route("/search").get(verifyJWT, searchMentors);

// IMPORTANT: yeh route sabse aakhir mein hona chahiye — warna yeh /search, /me
// jaise literal paths ko bhi ":userId" samajh sakta hai
router.route("/:userId").get(verifyJWT, getUserById);

export default router;