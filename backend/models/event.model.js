import mongoose from "mongoose";

const evenSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
    },
    location: {
        type: String,
    },
    registrationUrl: { // Unstop registration link
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["workshop", "conference", "seminar", "competition"],
        required: true
    }
}, {timestamps: true})

export const Event = mongoose.model('Event', evenSchema);