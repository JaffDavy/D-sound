import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import express from "express";
import loginValidation from "../utils/loginValidation.js";
import User from "../models/User.js"

const router = express.Router();

// Login route
router.post("/login", loginValidation, async (req, res, next) => {

  const { email, password } = req.body;
  try {
      // Find the user by email in MongoDB
      const user = await User.findOne({ email });
      
      if (!user) {
          return res.status(400).json({ error: "User not found" });
      }

      // Validate password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
          return res.status(400).json({ error: "Invalid credentials" });
      }

      // Generate JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1h",
      });
      return res.json({ token });
  } catch (err) {
      console.error("Login error:", err); // Log error for debugging
      next(err);
  }
});


// Route to get user data
router.get('/api/user', async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]; // Assuming token is passed in the Authorization header
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("username"); // Change as needed
        if (user) {
            res.json({ name: user.username }); // Change as needed
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error fetching user' });
    }
});

export default router;
