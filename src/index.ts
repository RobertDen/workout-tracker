import express from "express";
import cors from "cors";
import { query } from "./db.js";

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

//GET all users
app.get("/users", async (req, res) => {
    try {
        const result = await query("SELECT * FROM users");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

//GET all workouts with user info
app.get("/workouts", async (req, res) => {
    try {
        const result = await query(`
            SELECT w.id, u.name AS user_name, u.email AS user_email, w.date, w.duration_minutes, w.calories_burnt
            FROM workouts w
            JOIN users u ON w.user_id = u.id
            ORDER BY w.date DESC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

//POST create a new workout
app.post("/workouts", async (req, res) => {
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
        console.error(err);
        res.status(500).send("Server error");
    }
});

//GET a single workout by id
app.get("/workouts/:id", async (req, res) =>{
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
        console.error(err);
        res.status(500).send("Server error");
    }
});

//PATCH update a workout by id
app.patch("/workouts/:id", async (req, res) => {
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
        console.error(err);
        res.status(500).send("Server error");
    }
});

//DELETE a workout by id
app.delete("/workouts/:id", async (req, res) => {
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
        console.error(err);
        res.status(500).send("Server error");
    }
});

//Simple test route
app.get("/", (req, res) => {
    res.send("Hello, Workout Tracker is running!");
});

app.get("/ping", (req, res) => {
    res.send({message: "pong"});
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

