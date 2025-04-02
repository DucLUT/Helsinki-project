import express from "express";  
import { protectRoute } from "../middleware/auth.js";

const router = express.Router();

router.put("/update", protectRoute, async (req, res) => {

})

export default router;