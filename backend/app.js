import createError from 'http-errors';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors'; 
import indexRouter from './routes/index.js';
import pool from './config/config.js';

dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();

// Middlewarez
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use('/index', indexRouter);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404)); 
});

// Error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.error('Error:', err);

  res.status(err.status || 500);
  res.json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
