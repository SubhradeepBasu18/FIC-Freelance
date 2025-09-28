import express from "express";
import { registerAdmin, loginAdmin } from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/register", registerAdmin); // Use once, then disable
router.post("/login", loginAdmin);

export default router;
