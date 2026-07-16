import { Router } from "express";
import {
  sendConnectionRequest,
  respondToConnectionRequest,
  getMyConnections,
  getPendingRequests,
  getSentRequests,
} from "../controllers/connection.controller.js";
import { verifyJWT } from "../middleware/Auth.middleware.js";

const router = Router();

// Sab routes protected hain — login zaroori hai
router.use(verifyJWT);

router.route("/send").post(sendConnectionRequest);
router.route("/:connectionId/respond").patch(respondToConnectionRequest);
router.route("/my-connections").get(getMyConnections);
router.route("/pending").get(getPendingRequests);
router.route("/sent").get(getSentRequests);

export default router;