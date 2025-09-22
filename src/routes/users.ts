// routes/users.ts
import { Router, Request, Response, NextFunction } from "express";
import { query } from "../db.js";

const router = Router();

//GET all users
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await query("SELECT * FROM users");
        res.json(result.rows);
    } catch (err) {
        next(err);
    }
});

export { router as usersRouter };