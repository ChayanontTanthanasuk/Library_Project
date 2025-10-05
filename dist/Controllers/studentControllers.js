"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginStudent = exports.registerStudent = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "secret";
// สมัครสมาชิก (Register Student)
const registerStudent = async (req, res) => {
    try {
        const { studentId, name, password } = req.body;
        if (!studentId || !name || !password) {
            res.status(400).json({ message: "studentId, name, and password are required" });
            return;
        }
        // ตรวจว่ามี studentId ซ้ำไหม
        const existing = await prisma.student.findUnique({ where: { studentId } });
        if (existing) {
            res.status(400).json({ message: "Student ID already exists" });
            return;
        }
        // เข้ารหัส password
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // บันทึกข้อมูลนักศึกษาใหม่
        const newStudent = await prisma.student.create({
            data: { studentId, name, password: hashedPassword },
        });
        res.status(201).json({ message: "Register success", student: newStudent });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.registerStudent = registerStudent;
//  เข้าสู่ระบบ (Login Student)
const loginStudent = async (req, res) => {
    try {
        const { studentId, password } = req.body;
        if (!studentId || !password) {
            res.status(400).json({ message: "studentId and password are required" });
            return;
        }
        // ค้นหานักศึกษาจาก studentId
        const student = await prisma.student.findUnique({ where: { studentId } });
        if (!student) {
            res.status(401).json({ message: "Invalid studentId or password" });
            return;
        }
        // ตรวจสอบ password
        const isValid = await bcryptjs_1.default.compare(password, student.password);
        if (!isValid) {
            res.status(401).json({ message: "Invalid studentId or password" });
            return;
        }
        // สร้าง JWT Token
        const token = jsonwebtoken_1.default.sign({ studentId: student.studentId, id: student.id }, JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ message: "Login success", token });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.loginStudent = loginStudent;
//# sourceMappingURL=studentControllers.js.map