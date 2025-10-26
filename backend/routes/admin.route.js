import express from "express";
import { 
  registerSuperAdmin, 
  loginAdmin, 
  addAdmin, 
  removeAdmin,
  handoverSuperAdmin, 
  getAllAdmins,
  getCurrentAdmin,
  logoutAdmin,
  resetPassword,
  changeGroupPhoto,
  getLastUploadedGroupPhotoHandler,
  getAllGroupPhotosHandler,
  deleteGroupPhotoHandler
} from "../controllers/admin.controller.js";
import { protectAdmin, superAdminOnly } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

// Public routes
router.post("/register-superadmin", registerSuperAdmin); // only once at setup
router.post("/login", loginAdmin);
router.put("/reset-password", resetPassword);
router.get("/get-last-uploaded-group-photo", getLastUploadedGroupPhotoHandler);

// Protected routes (require authentication)
router.get("/current-session", protectAdmin, getCurrentAdmin);
router.post("/logout", protectAdmin, logoutAdmin);
router.post("/change-group-photo", upload.single("groupPhoto"),protectAdmin, changeGroupPhoto);
router.get("/get-all-group-photos", protectAdmin, getAllGroupPhotosHandler);
router.delete("/delete-group-photo/:id", protectAdmin, deleteGroupPhotoHandler);

// Superadmin only routes
router.post("/add-admin", addAdmin);
router.delete("/remove-admin/:id", protectAdmin, superAdminOnly, removeAdmin);
router.put("/handover-superadmin", protectAdmin, superAdminOnly, handoverSuperAdmin);
router.get("/get-all-admins", protectAdmin, getAllAdmins);


export default router;
