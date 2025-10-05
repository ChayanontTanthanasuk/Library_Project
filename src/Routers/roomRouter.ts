import express from "express";
import { createRoom, getRooms } from "../Controllers/roomController";

const router = express.Router();

router.post("/rooms", createRoom);
router.get("/rooms", getRooms);

export default router;
