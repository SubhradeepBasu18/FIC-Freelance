import express from "express";
import { 
  registerSuperAdmin, 
  loginAdmin, 
  addAdmin, 
  removeAdmin,
  handoverSuperAdmin, 
  getAllAdmins,
  getCurrentAdmin,
  logoutAdmin 
} from "../controllers/admin.controller.js";
import { protectAdmin, superAdminOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/register-superadmin", registerSuperAdmin); // only once at setup
router.post("/login", loginAdmin);

// Protected routes (require authentication)
router.get("/current-session", protectAdmin, getCurrentAdmin);
router.post("/logout", protectAdmin, logoutAdmin);

// Superadmin only routes
router.post("/add-admin", protectAdmin, superAdminOnly, addAdmin);
router.delete("/remove-admin/:id", protectAdmin, superAdminOnly, removeAdmin);
router.put("/handover-superadmin", protectAdmin, superAdminOnly, handoverSuperAdmin);
router.get("/get-all-admins", protectAdmin, getAllAdmins);

export default router;
