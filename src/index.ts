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

