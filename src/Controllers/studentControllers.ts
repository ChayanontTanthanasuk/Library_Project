import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "secret";

// สมัครสมาชิก (Register Student)
export const registerStudent = async (req: Request, res: Response) => {
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
    const hashedPassword = await bcrypt.hash(password, 10);

    // บันทึกข้อมูลนักศึกษาใหม่
    const newStudent = await prisma.student.create({
      data: { studentId, name, password: hashedPassword },
    });

    res.status(201).json({ message: "Register success", student: newStudent });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

//  เข้าสู่ระบบ (Login Student)
export const loginStudent = async (req: Request, res: Response) => {
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
    const isValid = await bcrypt.compare(password, student.password);
    if (!isValid) {
      res.status(401).json({ message: "Invalid studentId or password" });
      return;
    }

    // สร้าง JWT Token
    const token = jwt.sign(
      { studentId: student.studentId, id: student.id },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login success", token });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
