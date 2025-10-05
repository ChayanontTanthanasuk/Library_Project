import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// สร้างห้องใหม่
export const createRoom = async (req: Request, res: Response) => {
  try {
    const { name, capacity, location } = req.body;

    if (!name || !capacity) {
      res.status(400).json({ message: "Name and capacity are required" });
      return;
    }

    const room = await prisma.room.create({
      data: { name, capacity, location }
    });

    res.status(201).json({ message: "Room created", room });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// ดูห้องทั้งหมด
export const getRooms = async (_req: Request, res: Response) => {
  try {
    const rooms = await prisma.room.findMany({
      include: { bookings: true }
    });
    res.json(rooms);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
