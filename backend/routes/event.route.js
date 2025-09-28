import { addEvent, updateEvent, deleteEvent, getEvent, getAllEvents } from "../controllers/event.controller.js";
import express from "express";

const router = express.Router();

router.post("/addEvent", addEvent);
router.put("/updateEvent/:id", updateEvent);
router.delete("/deleteEvent/:id", deleteEvent);
router.get("/getEvent/:id", getEvent);
router.get("/getAllEvents", getAllEvents);

export default router;
