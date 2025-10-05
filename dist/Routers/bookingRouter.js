"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bookingController_1 = require("../Controllers/bookingController");
const auth_1 = require("../Middleware/auth");
const router = express_1.default.Router();
// ต้อง login ก่อนถึงจะใช้งานได้
router.post("/bookings", auth_1.authMiddleware, bookingController_1.createBooking);
router.get("/bookings", auth_1.authMiddleware, bookingController_1.getBookings);
router.delete("/bookings/:id", auth_1.authMiddleware, bookingController_1.cancelBooking);
exports.default = router;
//# sourceMappingURL=bookingRouter.js.map