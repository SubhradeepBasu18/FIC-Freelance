import express from "express";
import { addNewsponsor, getAllsponsor, getsponsorById, deletesponsorById, updatesponsorById } from "../controllers/sponsor.controller.js";
import { protectAdmin } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const publicsponsorRouter = express.Router()
const protectedsponsorRouter = express.Router()


publicsponsorRouter.get("/", getAllsponsor)
publicsponsorRouter.get("/:id", getsponsorById)

protectedsponsorRouter.post("/", protectAdmin, upload.single("image"), addNewsponsor)
protectedsponsorRouter.delete("/:id", protectAdmin, deletesponsorById)
protectedsponsorRouter.put("/:id", protectAdmin, updatesponsorById) // need to look while integrating

export {publicsponsorRouter, protectedsponsorRouter}
