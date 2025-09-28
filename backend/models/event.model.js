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
    date: {
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
}, {timestamps: true})

export const Event = mongoose.model('Event', evenSchema);