import app from "./app.js";
import dotenv from "dotenv";
import { httpServer } from "./app.js";
dotenv.config();
const PORT = process.env.PORT || 4000;  
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});