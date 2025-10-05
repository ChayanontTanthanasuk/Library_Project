"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRooms = exports.createRoom = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// สร้างห้องใหม่
const createRoom = async (req, res) => {
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
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.createRoom = createRoom;
// ดูห้องทั้งหมด
const getRooms = async (_req, res) => {
    try {
        const rooms = await prisma.room.findMany({
            include: { bookings: true }
        });
        res.json(rooms);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getRooms = getRooms;
//# sourceMappingURL=roomController.js.map