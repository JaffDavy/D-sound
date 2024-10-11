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

router.get('/api/user', (req, res) => {
    const userId = req.session.userId; // Example of getting the user from session
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    // Query the database to get the user's data
    db.query('SELECT fullname FROM users WHERE id = $1', [userId], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error fetching user' });
      }
  
      if (result.rows.length > 0) {
        res.json({ name: result.rows[0].fullname });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    });
  });
  

export default router;
