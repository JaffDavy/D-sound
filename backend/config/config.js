import mongoose from 'mongoose';
import express from 'express';
import dotenv from 'dotenv';
import loginRouter from '../routes/login.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Connect to MongoDB
const connectToMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
    }
};

export default connectToMongoDB;

// Call the function to connect to MongoDB
connectToMongoDB();

// Use routes
app.use('/login', loginRouter); // Mount your routes correctly

// const PORT = process.env.PORT || 5000; // Ensure the port is set
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });
