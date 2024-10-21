import pkg from 'pg';
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

// Configure the connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

pool
  .connect()
  .then(() => {
    console.log("Connected to the database successfully");
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });

export default pool;
