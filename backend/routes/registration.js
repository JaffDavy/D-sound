import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import pool from "../config/config.js";
import registrationValidation from "../utils/registrationValidation.js";

dotenv.config();

const router = express.Router();
router.use(bodyParser.json());

// Register a new user
router.post("/registration", registrationValidation, async (req, res, next) => {
    console.log("Register route hit");
    const { username, password, email } = req.body;

    try {
        // Check if the user already exists
        const userCheckQuery = "SELECT * FROM users WHERE email = $1";
        const existingUsers = await pool.query(userCheckQuery, [email]);

        if (existingUsers.rows.length > 0) {
            return res.status(401).json({ error: "User already exists, please login" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const createdAt = new Date();

        const result = await pool.query(
            "INSERT INTO users (username, password, email, created_at) VALUES ($1, $2, $3, $4) RETURNING *",
            [username, hashedPassword, email, createdAt]
        );

        const user = result.rows[0];
        delete user.password;

        res.status(201).json({
            message: "Registration successful",
            user,
        });
    } catch (err) {
        next(err);
    }
});

export default router;
