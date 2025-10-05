import { Response } from "express";
import { AuthRequest } from "../Middleware/auth";
export declare const createBooking: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getBookings: (_req: AuthRequest, res: Response) => Promise<void>;
export declare const cancelBooking: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=bookingController.d.ts.map