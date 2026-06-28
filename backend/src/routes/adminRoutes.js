import { Router } from "express";
import {
  activateUser,
  deleteResult,
  deleteUser,
  getAdminLeaderboard,
  getAllResults,
  getAuditLogs,
  getDashboard,
  getUserById,
  getUsers,
  suspendUser,
  updateUser,
} from "../controllers/adminController.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use(asyncHandler(authMiddleware));
router.use(adminMiddleware);
router.get("/dashboard", asyncHandler(getDashboard));
router.get("/users", asyncHandler(getUsers));
router.get("/users/:id", asyncHandler(getUserById));
router.put("/users/:id", asyncHandler(updateUser));
router.patch("/users/:id/suspend", asyncHandler(suspendUser));
router.patch("/users/:id/activate", asyncHandler(activateUser));
router.delete("/users/:id", asyncHandler(deleteUser));
router.get("/results", asyncHandler(getAllResults));
router.delete("/results/:id", asyncHandler(deleteResult));
router.get("/leaderboard", asyncHandler(getAdminLeaderboard));
router.get("/audit-logs", asyncHandler(getAuditLogs));

export default router;
