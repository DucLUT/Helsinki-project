import express from "express";
import path from 'path';
import {fileURLToPath} from 'url';
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
const app = express();
import { initializeSocket } from "./socket/socket.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import { connectDB } from "./config/db.js";

connectDB();
export const httpServer = createServer(app); 
initializeSocket(httpServer);

const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173", // Allow frontend origin
  credentials: true, // Allow credentials (cookies)
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/ai", aiRoutes);
app.get("/api/running", (req, res) => {
  res.send("API is running...");
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientPath = path.join(__dirname, "../client/dist");
app.use(express.static(clientPath));
app.get("/", (_req, res) => {
  res.sendFile(path.resolve(clientPath, "index.html"));
});

export default app;