"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const studentControllers_1 = require("../Controllers/studentControllers");
const router = (0, express_1.Router)();
// สมัครสมาชิก
router.post("/register", studentControllers_1.registerStudent); // done
// ล็อกอิน
router.post("/login", studentControllers_1.loginStudent); // done
exports.default = router;
//# sourceMappingURL=studentRouter.js.map