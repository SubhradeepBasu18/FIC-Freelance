import { addTeamMember, updateTeamMember, deleteTeamMember, getTeamMemberById, getAllTeamMembers } from "../controllers/team.controller.js";
import express from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { protectAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

//protected routes
router.post("/addTeamMember", upload.single("avatar"), protectAdmin, addTeamMember);
router.put("/updateTeamMember/:id", protectAdmin, updateTeamMember);
router.delete("/deleteTeamMember/:id", protectAdmin, deleteTeamMember);

//public routes
router.get("/getTeamMember/:id", getTeamMemberById);
router.get("/getAllTeamMembers", getAllTeamMembers);

export default router;
