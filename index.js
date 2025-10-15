import express from 'express';
import router from './src/routes/auth.js';
import dotenv from 'dotenv';
import cors from 'cors'
import cokkieParser from 'cookie-parser'
import { connectDB } from './src/lib/db.js';
import messageRouter from './src/routes/message.js';
dotenv.config();
const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(cokkieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
const port = process.env.PORT
app.use("/api/auth",router)
app.use("/api/message",messageRouter)
app.listen(port, () => {
    console.log('Server is running on port:' + port);
    connectDB();
});