import { addEvent, updateEvent, deleteEvent, getEvent, getAllEvents } from "../controllers/event.controller.js";
import express from "express";
import { protectAdmin } from "../middlewares/auth.middleware.js";

const protectedRouter = express.Router();
const publicRouter = express.Router();

//protected routes
protectedRouter.post("/addEvent", protectAdmin, addEvent);
protectedRouter.put("/updateEvent/:id", protectAdmin, updateEvent);
protectedRouter.delete("/deleteEvent/:id", protectAdmin, deleteEvent);

//public routes
publicRouter.get("/getEvent/:id", getEvent);
publicRouter.get("/getAllEvents", getAllEvents);

export {protectedRouter, publicRouter};
