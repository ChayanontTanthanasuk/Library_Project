"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const roomController_1 = require("../Controllers/roomController");
const router = express_1.default.Router();
router.post("/rooms", roomController_1.createRoom);
router.get("/rooms", roomController_1.getRooms);
exports.default = router;
//# sourceMappingURL=roomRouter.js.map