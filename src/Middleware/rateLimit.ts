import rateLimit from "express-rate-limit";

// limit สำหรับ login (กัน brute force)
export const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 นาที
  max: 5,                  // อนุญาต 5 request ต่อ 1 นาที ต่อ IP
  message: {
    message: "Too many login attempts. Please try again after 1 minute."
  },
  standardHeaders: true,   // แสดง rate limit info ใน header
  legacyHeaders: false,    // ปิด X-RateLimit headers เก่า
});

// limit สำหรับการจอง (กัน spam booking)
export const bookingLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 นาที
  max: 10,                 // อนุญาต 10 requests ต่อ 1 นาที ต่อ IP
  message: {
    message: "Too many booking requests. Please slow down."
  },
  standardHeaders: true,
  legacyHeaders: false,
});
