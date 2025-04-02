import express from "express"
import cors from 'cors'
import cookieParser from "cookie-parser"
const app = express()
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import matchRoutes from "./routes/matchRoutes.js"
import messageRoutes from "./routes/messageRoutes.js"
import {connectDB} from "./config/db.js"

connectDB()

app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/matches", matchRoutes)
app.use("/api/messages", messageRoutes)
app.get("/", (req, res) => {
    res.send("API is running...")
})
export default app
