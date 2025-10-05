"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelBooking = exports.getBookings = exports.createBooking = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// ➤ จองห้อง
const createBooking = async (req, res) => {
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
    }
    catch (err) {
        console.error("❌ Error in createBooking:", err);
        res.status(500).json({ message: err.message });
    }
};
exports.createBooking = createBooking;
// ➤ ดู bookings
const getBookings = async (_req, res) => {
    try {
        const bookings = await prisma.booking.findMany({
            orderBy: { startTime: "asc" },
            include: { participants: { include: { student: true } }, room: true },
        });
        res.status(200).json(bookings);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getBookings = getBookings;
// ➤ ยกเลิก booking
const cancelBooking = async (req, res) => {
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
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.cancelBooking = cancelBooking;
//# sourceMappingURL=bookingController.js.map