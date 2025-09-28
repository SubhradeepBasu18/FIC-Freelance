import express from "express";
import { registerSuperAdmin, loginAdmin, addAdmin, handoverSuperAdmin } from "../controllers/admin.controller.js";
import { protectAdmin, superAdminOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register-superadmin", registerSuperAdmin); // only once at setup
router.post("/login", loginAdmin);
router.post("/add-admin", protectAdmin, superAdminOnly, addAdmin);
router.put("/handover-superadmin", protectAdmin, superAdminOnly, handoverSuperAdmin);

export default router;
