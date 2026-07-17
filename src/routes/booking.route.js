import { Router } from "express";
import {
  addAvailableSlot,
  removeAvailableSlot,
  getMentorSlots,
  bookSlot,
  cancelBooking,
  getMyBookings,
} from "../controllers/booking.controller.js";
import { verifyJWT } from "../middleware/Auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/slots").post(addAvailableSlot);
router.route("/slots/:slotId").delete(removeAvailableSlot);
router.route("/mentor/:mentorId/slots").get(getMentorSlots);
router.route("/book").post(bookSlot);
router.route("/:bookingId/cancel").patch(cancelBooking);
router.route("/my-Bookings").get(getMyBookings);

export default router;