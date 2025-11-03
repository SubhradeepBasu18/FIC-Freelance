import mongoose from "mongoose";

const sponsorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String, // cloudinary url
        required: true
    }
}, {timestamps: true})

const Sponsor = mongoose.model("Sponsor", sponsorSchema)

export default Sponsor

