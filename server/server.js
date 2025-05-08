import app from "./app.js";
import dotenv from "dotenv";
import { httpServer } from "./app.js";
dotenv.config();
const PORT = process.env.PORT || 4000;

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1); // Exit the process to avoid undefined behavior
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

// Bind the server to 0.0.0.0 to listen on all network interfaces
httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});