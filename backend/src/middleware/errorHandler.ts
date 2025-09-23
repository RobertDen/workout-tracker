//middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    console.error("Error:", err);

    // If the error already has a status and message, use them
    const status = err.status || 500;
    const message = err.message || "Server error";

    res.status(status).json({ error: message });
}
