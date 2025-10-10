import express from "express";
import { createBooking, getBookings, cancelBooking, searchAvailableRooms } from "../Controllers/bookingController";
import { authMiddleware } from "../Middleware/auth";

const router = express.Router();

// ต้อง login ก่อนถึงจะใช้งานได้
router.post("/bookings", authMiddleware, createBooking);
router.get("/bookings", authMiddleware, getBookings);
router.delete("/bookings/:id", authMiddleware, cancelBooking);
router.post("/search", authMiddleware, searchAvailableRooms);


export default router;
