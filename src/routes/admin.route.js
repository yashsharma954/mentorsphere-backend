import { Router } from "express";
import { getAllUsers, deleteUser, getPlatformStats } from "../controllers/admin.controller.js";
import { verifyJWT } from "../middleware/Auth.middleware.js";
import { AuthorizeRoles } from "../middleware/role.middleware.js";

const router = Router();

// Sab admin routes: pehle login check, phir role check
router.use(verifyJWT, AuthorizeRoles("admin"));

router.route("/users").get(getAllUsers);
router.route("/users/:userId").delete(deleteUser);
router.route("/stats").get(getPlatformStats);

export default router;