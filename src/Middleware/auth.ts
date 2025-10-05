import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export interface AuthRequest extends Request {
  user?: { id: number; studentId: string }; // เปลี่ยนจาก userId → id, studentId
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer token"

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; studentId: string };
    req.user = decoded; // เก็บ payload ลง req.user
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};
