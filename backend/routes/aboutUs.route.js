import { addTeamMember, updateTeamMember, deleteTeamMember, getTeamMemberById, getAllTeamMembers } from "../controllers/team.controller.js";
import express from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { protectAdmin } from "../middlewares/auth.middleware.js";

const protectedTeamRouter = express.Router();
const publicTeamRouter = express.Router();

//protected routes
protectedTeamRouter.post("/addTeamMember", upload.single("avatar"), protectAdmin, addTeamMember);
// protectedTeamRouter.put("/updateTeamMember/:id", protectAdmin, updateTeamMember);
protectedTeamRouter.put("/updateTeamMember/:id", upload.single("avatar"), protectAdmin, updateTeamMember);
protectedTeamRouter.delete("/deleteTeamMember/:id", protectAdmin, deleteTeamMember);

//public routes
publicTeamRouter.get("/getTeamMember/:id", getTeamMemberById);
publicTeamRouter.get("/getAllTeamMembers", getAllTeamMembers);

export {protectedTeamRouter, publicTeamRouter};
