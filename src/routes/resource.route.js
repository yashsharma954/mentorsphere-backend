import { Router } from "express";
import {
  uploadResource,
  getPublicResources,
  shareResourceWithUser,
  getSharedResources,
  deleteResource,
  downloadResource,
} from "../controllers/resource.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

// Public library dekhna Login ke bina bhi allow kar sakte ho, chaho to yahan se verifyJWT hata dena
router.route("/public").get(getPublicResources);

router.use(verifyJWT);

router.route("/upload").post(upload.single("file"), uploadResource);
router.route("/shared").get(getSharedResources);
router.route("/:resourceId/share").post(shareResourceWithUser);
router.route("/:resourceId/download").get(downloadResource);
router.route("/:resourceId").delete(deleteResource);

export default router;