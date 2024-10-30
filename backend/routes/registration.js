import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import registrationValidation from "../utils/registrationValidation.js";
import User from "../models/User.js";

dotenv.config();

const router = express.Router();
router.use(bodyParser.json());

// Register a new user
router.post("/registration", registrationValidation, async (req, res, next) => {
    console.log("Register route hit");
    const { username, password, email } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(401).json({ error: "User already exists, please login" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the new user
        const newUser = new User({
            username,
            password: hashedPassword,
            email,
        });
        
        const savedUser = await newUser.save();
        savedUser.password = undefined; 

        res.status(201).json({
            message: "Registration successful",
            user: savedUser,
        });
    } catch (err) {
        next(err);
    }
});

export default router;
