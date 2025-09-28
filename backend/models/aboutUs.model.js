import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  position: {
    type: String,
    required: true,
    trim: true,
  },
  linkedin: {
    type: String,
    required: true,
  },
  avatar: {
    type: String, // cloudinary url
  }
});

const aboutUsSchema = new mongoose.Schema({
  team: [teamMemberSchema],
});

const AboutUs = mongoose.model('AboutUs', aboutUsSchema);
const TeamMember = mongoose.model('TeamMember', teamMemberSchema);

export {AboutUs, TeamMember};

