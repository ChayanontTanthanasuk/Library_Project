"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingLimiter = exports.loginLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// limit สำหรับ login (กัน brute force)
exports.loginLimiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000, // 1 นาที
    max: 5, // อนุญาต 5 request ต่อ 1 นาที ต่อ IP
    message: {
        message: "Too many login attempts. Please try again after 1 minute."
    },
    standardHeaders: true, // แสดง rate limit info ใน header
    legacyHeaders: false, // ปิด X-RateLimit headers เก่า
});
// limit สำหรับการจอง (กัน spam booking)
exports.bookingLimiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000, // 1 นาที
    max: 10, // อนุญาต 10 requests ต่อ 1 นาที ต่อ IP
    message: {
        message: "Too many booking requests. Please slow down."
    },
    standardHeaders: true,
    legacyHeaders: false,
});
//# sourceMappingURL=rateLimit.js.map