// add event
// update event
// delete event
// get event
// get all events

import { Event } from "../models/event.model.js";

const addEvent = async (req, res) => {
    try {
        const { title, description, date, time, location, registrationUrl, type } = req.body;

        if (!title || !description || !date || !time || !location || !registrationUrl || !type) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }
        const event = new Event({
            title,
            description,
            date,
            time,
            location,
            registrationUrl,
            type,
        });
        await event.save();
        return res.status(201).json({
            message: "Event added successfully",
            event,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const updateEvent = async (req, res) => {
    try {
        const { title, description, date, time, location, registrationUrl, type } = req.body;
        const event = await Event.findByIdAndUpdate(req.params.id, {
            title,
            description,
            date,
            time,
            location,
            registrationUrl,
            type,
        });
        return res.status(200).json({
            message: "Event updated successfully",
            event,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            message: "Event deleted successfully",
            event,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const getEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        return res.status(200).json({
            message: "Event fetched successfully",
            event,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find();
        return res.status(200).json({
            message: "Events fetched successfully",
            events,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};


export { addEvent, updateEvent, deleteEvent, getEvent, getAllEvents };