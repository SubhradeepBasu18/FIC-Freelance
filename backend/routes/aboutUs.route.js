import { addTeamMember, updateTeamMember, deleteTeamMember, getTeamMemberById, getAllTeamMembers } from "../controllers/team.controller.js";
import express from "express";
import { upload } from "../middlewares/multer.middleware.js";


const router = express.Router();

router.post("/addTeamMember", upload.single("avatar"), addTeamMember);
router.put("/updateTeamMember/:id", updateTeamMember);
router.delete("/deleteTeamMember/:id", deleteTeamMember);
router.get("/getTeamMember/:id", getTeamMemberById);
router.get("/getAllTeamMembers", getAllTeamMembers);

export default router;
