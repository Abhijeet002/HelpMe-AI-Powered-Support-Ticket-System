// index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import replyRoutes from './routes/replyRoutes.js';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();
app.use(cookieParser());
app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/replies', replyRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Ticket API');
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
