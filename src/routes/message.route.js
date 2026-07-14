import { Router } from "express";
import {
  sendMessage,
  getConversation,
  getAllConversations,
  markMessagesAsRead,
} from "../controllers/message.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/send").post(sendMessage);
router.route("/conversations").get(getAllConversations);
router.route("/:userId").get(getConversation);
router.route("/:userId/read").patch(markMessagesAsRead);

export default router;