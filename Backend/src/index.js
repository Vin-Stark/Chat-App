
import express from "express"
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookeParser from "cookie-parser";



dotenv.config();

const app = express();

app.use(express.json());
app.use(cookeParser());

const PORT = process.env.PORT;

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});