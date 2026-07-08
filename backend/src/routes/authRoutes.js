import { Router } from "express";
import { login, logout, me, register, updateProfile } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));
router.get("/me", asyncHandler(authMiddleware), me);
router.put("/profile", asyncHandler(authMiddleware), asyncHandler(updateProfile));
router.post("/logout", asyncHandler(authMiddleware), asyncHandler(logout));

export default router;
