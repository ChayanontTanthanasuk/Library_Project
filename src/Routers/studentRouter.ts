import { Router } from "express";
import { registerStudent, loginStudent } from "../Controllers/studentControllers";

const router = Router();

// สมัครสมาชิก
router.post("/register", registerStudent); // done

// ล็อกอิน
router.post("/login", loginStudent); // done

export default router;
