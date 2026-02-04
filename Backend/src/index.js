
import express from "express"
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookeParser from "cookie-parser";
import cors from "cors";




dotenv.config(); // Load environment variables from .env file

const app = express(); // Create an Express application

app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cookeParser()); // Middleware to parse cookies
app.use(cors({
    origin: "http://localhost:5173", // Allow requests from this origin
    credentials: true, // Allow cookies to be sent with requests
}))

const PORT = process.env.PORT; 

app.use("/api/auth", authRoutes); 
app.use("/api/message", messageRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});