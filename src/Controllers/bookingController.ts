import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../Middleware/auth"; // ✅ import interface
const prisma = new PrismaClient();

// ➤ จองห้อง
export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { roomId, startTime, endTime } = req.body;
    const studentId = req.user?.id; // ✅ ดึงจาก token โดยตรง

    console.log("DEBUG req.user:", req.user);
    console.log("DEBUG req.body:", req.body);

    if (!studentId || !roomId || !startTime || !endTime) {
      res.status(400).json({
        message: "Missing required fields",
        received: { studentId, roomId, startTime, endTime },
      });
      return;
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    // ✅ ตรวจว่านักศึกษามีอยู่จริงไหม
    const student = await prisma.student.findUnique({ where: { id: studentId } });
    if (!student) {
      res.status(404).json({ message: "Student not found" });
      return;
    }

    // ✅ ตรวจว่าห้องมีจริงไหม
    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) {
      res.status(404).json({ message: "Room not found" });
      return;
    }

    // ✅ ตรวจเวลาซ้ำ
    const conflict = await prisma.booking.findFirst({
      where: {
        roomId,
        status: "CONFIRMED",
        OR: [
          {
            startTime: { lt: end },
            endTime: { gt: start },
          },
        ],
      },
    });

    if (conflict) {
      res.status(400).json({ message: "Room already booked in this time range" });
      return;
    }

    // ✅ สร้าง booking
    const booking = await prisma.booking.create({
      data: {
        roomId,
        roomName: room.name,
        roomCapacity: room.capacity,
        startTime: start,
        endTime: end,
        status: "CONFIRMED",
        participants: {
          create: [{ studentId }],
        },
      },
      include: { participants: { include: { student: true } }, room: true },
    });

    res.status(201).json({ message: "Booking created", booking });
  } catch (err: any) {
    console.error("❌ Error in createBooking:", err);
    res.status(500).json({ message: err.message });
  }
};

// ➤ ดู bookings
export const getBookings = async (_req: AuthRequest, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { startTime: "asc" },
      include: { participants: { include: { student: true } }, room: true },
    });
    res.status(200).json(bookings);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// ➤ ยกเลิก booking
export const cancelBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const bookingId = Number(id);

    const exist = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!exist) {
      res.status(404).json({ message: "Booking not found" });
      return;
    }

    // ✅ ลบผู้เข้าร่วมก่อน
    await prisma.bookingParticipant.deleteMany({ where: { bookingId } });

    // ✅ ลบ booking
    const deleted = await prisma.booking.delete({ where: { id: bookingId } });

    res.status(200).json({ message: "Booking deleted", booking: deleted });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const searchAvailableRooms = async (req: AuthRequest, res: Response) => {
  try {
    const { date, startTime, endTime } = req.body;

    if (!date || !startTime || !endTime) {
      return res.status(400).json({
        message: "Missing required fields (date, startTime, endTime)",
      });
    }

    // ✅ รวมวันที่ + เวลา เป็น Date object
    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);

    // ✅ ดึงห้องทั้งหมด
    const rooms = await prisma.room.findMany({
      orderBy: { id: "asc" },
    });

    // ✅ ตรวจสอบว่าแต่ละห้องว่างไหม
    const results = await Promise.all(
      rooms.map(async (room) => {
        const conflict = await prisma.booking.findFirst({
          where: {
            roomId: room.id,
            status: "CONFIRMED",
            OR: [
              { startTime: { lt: end }, endTime: { gt: start } },
            ],
          },
        });

        return {
          id: room.id,
          name: room.name,
          capacity: room.capacity,
          location: room.location,
          status: conflict ? "BOOKED" : "AVAILABLE",
        };
      })
    );

    res.status(200).json({
      message: "Search success",
      rooms: results,
    });
  } catch (err: any) {
    console.error("❌ Error in searchAvailableRooms:", err);
    res.status(500).json({ message: err.message });
  }
};
