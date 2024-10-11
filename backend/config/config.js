import pkg from 'pg'; // Import the 'pg' module as a default import
const { Pool } = pkg; // Destructure Pool from the imported package
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// Configure the connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Use DATABASE_URL if available
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false, // Conditional SSL for Render
});

// Test the connection
pool
  .connect()
  .then(() => {
    console.log("Connected to the database successfully");
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });

export default pool;
