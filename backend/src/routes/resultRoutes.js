import { Router } from "express";
import { getLeaderboard, getMyResults, getSummary, saveResult } from "../controllers/resultController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use(asyncHandler(authMiddleware));
router.post("/", asyncHandler(saveResult));
router.get("/my-results", asyncHandler(getMyResults));
router.get("/summary", asyncHandler(getSummary));
router.get("/leaderboard", asyncHandler(getLeaderboard));

export default router;
