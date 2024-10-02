import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/config.js";
import loginValidation from "../utils/loginValidation.js";
import express from "express";

const router = express.Router(); // Initialize the router

// Login route
router.post("/login", loginValidation, async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );
        const user = result.rows[0];
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                expiresIn: "1h",
            });
            res.json({ token });
        } else {
            res.status(400).json({ error: "Invalid credentials" });
        }
    } catch (err) {
        next(err);
    }
});

export default router;
