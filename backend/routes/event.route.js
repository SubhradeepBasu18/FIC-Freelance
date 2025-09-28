import { addEvent, updateEvent, deleteEvent, getEvent, getAllEvents } from "../controllers/event.controller.js";
import express from "express";
import { protectAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/addEvent", protectAdmin, addEvent);
router.put("/updateEvent/:id", protectAdmin, updateEvent);
router.delete("/deleteEvent/:id", protectAdmin, deleteEvent);
router.get("/getEvent/:id", getEvent);
router.get("/getAllEvents", getAllEvents);

export default router;
