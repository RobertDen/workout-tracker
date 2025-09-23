//routes/workout.ts
import { Router, Request, Response, NextFunction } from "express";
import { query } from "../db.js";

const router = Router();

//GET all workouts with user info
router.get("/", async (req: Request , res: Response, next: NextFunction) => {
    try {
        const result = await query(`
            SELECT w.id, u.name AS user_name, u.email AS user_email, w.date, w.duration_minutes, w.calories_burnt
            FROM workouts w
            JOIN users u ON w.user_id = u.id
            ORDER BY w.date DESC
        `);
        res.json(result.rows);
    } catch (err) {
        next(err);
    }
});

//POST create a new workout
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { user_id, date, duration_minutes, calories_burnt } = req.body;

        //Basic validation
        if (!user_id || !date || !duration_minutes || !calories_burnt) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const result = await query(
            `INSERT INTO workouts (user_id, date, duration_minutes, calories_burnt)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [user_id, date, duration_minutes, calories_burnt]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        next(err);
    }
});

//GET a single workout by id
router.get("/:id", async (req: Request, res: Response, next: NextFunction) =>{
    try {
        const { id } = req.params;

        const result = await query(`
            SELECT w.id, u.name AS user_name, u.email AS user_email, w.date, w.duration_minutes, w.calories_burnt
            FROM workouts w
            JOIN users u ON w.user_id = u.id
            WHERE w.id = $1
            `, [id]);

            if (result.rows.length === 0) {
                return res.status(404).json({error: "Workout not found" });
            }

            res.json(result.rows[0]);
    } catch (err) {
        next(err);
    }
});

//PATCH update a workout by id
router.patch("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params
        const { date, duration_minutes, calories_burnt } = req.body;
        
        //Build dynamic query parts
        const fields: string[] = [];
        const values: any[] = [];
        let index = 1;

        if (date !== undefined) {
            fields.push(`date = $${index}`);
            values.push(date);
            index++;
        }
        if (duration_minutes !== undefined) {
            fields.push(`duration_minutes = $${index}`);
            values.push(duration_minutes);
            index++;
        }
        
        if (fields.length === 0) {
            return res.status(400).json({error: "No fields provided for update"});
        }

        const queryText = `
            UPDATE workouts
            SET ${fields.join(", ")}
            WHERE id = $${index}
            RETURNING *
        `;
        values.push(id);

        const result = await query(queryText, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Workout not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        next(err);
    }
});

//DELETE a workout by id
router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const result = await query(
            `DELETE FROM workouts
            WHERE id = $1
            RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error : "Workout not found"});
        }

        res.json({ message: "Workout deleted successfully", workout: result.rows[0] });
    } catch (err) {
        next(err);
    }
});

export { router as workoutsRouter };