import mongoose from "mongoose";


// Album Schema
const albumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  coverImage: {
    type: String, // URL of the cover image for the album (optional)
  },
  createdBy: {
    type: String, // Creator of the album (could be the admin or user)
    required: true,
  },
  mediaItems: [{
    type: String,
  }],
  isPublic: {
    type: Boolean,
    default: true, // Determines if the album is visible to everyone
  }
}, {timestamps: true});

// Album Model
const Album = mongoose.model('Album', albumSchema);

export { Album };
