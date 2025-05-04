import express from "express";  
import { protectRoute } from "../middleware/auth.js";
import { practiceConversation, generatePickupLine } from "../controllers/aiController.js";


const router = express.Router();

router.post("/practice", protectRoute, practiceConversation);
router.post("/pickup-line", protectRoute, generatePickupLine);
export default router;
