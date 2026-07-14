import { Router } from "express";
import { getAllUsers, deleteUser, getPlatformStats } from "../controllers/admin.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = Router();

// Sab admin routes: pehle login check, phir role check
router.use(verifyJWT, authorizeRoles("admin"));

router.route("/users").get(getAllUsers);
router.route("/users/:userId").delete(deleteUser);
router.route("/stats").get(getPlatformStats);

export default router;