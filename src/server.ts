import express, { Application } from "express";
import cors from "cors"; 

import studentRoutes from "./Routers/studentRouter";
import roomRoutes from "./Routers/roomRouter";
import bookingRouter from "./Routers/bookingRouter";

const app: Application = express();
const PORT = process.env.PORT || 3000;

// ✅ เปิดใช้งาน CORS สำหรับทุก origin (ถ้าอยากจำกัด origin กำหนดได้)
app.use(
  cors({
    origin: "*", // หรือ "http://127.0.0.1:5500" ถ้าคุณใช้ VS Code Live Server
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// ✅ Routes
app.use("/api", studentRoutes);
app.use("/api", roomRoutes);
app.use("/api", bookingRouter);

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
