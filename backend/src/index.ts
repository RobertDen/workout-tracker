import express from "express";
import cors from "cors";
import { query } from "./db.js";
import { usersRouter } from "./routes/users.js";
import { workoutsRouter } from "./routes/workouts.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { Router, Request, Response, NextFunction } from "express";

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

//Routes
app.use("/users", usersRouter);
app.use("/workouts", workoutsRouter);

//Simple test route
app.get("/", (req, res) => {
    res.send("Hello, Workout Tracker is running!");
});

app.get("/ping", (req, res) => {
    res.send({message: "pong"});
});

app.get("/error-test", (req: Request , res: Response, next: NextFunction) =>{
    const err = new Error("This is a test error");
    (err as any).status = 418;
    next(err);
})

//Error handling middleware - MUST be after all routes
app.use(errorHandler);

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

