import { Router } from "express";
import { registerStudent, loginStudent, getStudent } from "../Controllers/studentControllers";

const router = Router();

// สมัครสมาชิก
router.post("/register", registerStudent); // done

// ล็อกอิน
router.post("/login", loginStudent); // done

// ดึง student id
router.get("/student", getStudent); // done


export default router;
