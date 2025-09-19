// db.ts
import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config(); // load variables from .env
const { Pool } = pkg;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
});

export const query = (text: string, params?: any[]) => pool.query(text, params);