"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const studentRouter_1 = __importDefault(require("./Routers/studentRouter"));
const roomRouter_1 = __importDefault(require("./Routers/roomRouter"));
const bookingRouter_1 = __importDefault(require("./Routers/bookingRouter"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// ✅ เปิดใช้งาน CORS สำหรับทุก origin (ถ้าอยากจำกัด origin กำหนดได้)
app.use((0, cors_1.default)({
    origin: "*", // หรือ "http://127.0.0.1:5500" ถ้าคุณใช้ VS Code Live Server
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express_1.default.json());
// ✅ Routes
app.use("/api", studentRouter_1.default);
app.use("/api", roomRouter_1.default);
app.use("/api", bookingRouter_1.default);
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map