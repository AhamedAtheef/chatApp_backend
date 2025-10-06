import express from 'express';
import router from './src/routes/auth.js';
import dotenv from 'dotenv';
import cors from 'cors'
import cokkieParser from 'cookie-parser'
import { connectDB } from './src/lib/db.js';
dotenv.config();
const app = express();

app.use(cors())
app.use(express.json({ limit: "10mb" }));
app.use(cokkieParser())
const port = process.env.PORT
app.use("/api/auth",router)
app.listen(port, () => {
    console.log('Server is running on port:' + port);
    connectDB();
});