import mongoose from "mongoose";

// Journal Schema (for PDFs)
const journalSchema = new mongoose.Schema({
    title: String,
    authors: String,
    fileUrl: String,  // Only PDFs for journals
    isPublic: Boolean
  }, {timestamps: true});
  
  const journal = mongoose.model('Journal', journalSchema);
  
  // Article Schema (for text content)
  const articleSchema = new mongoose.Schema({
    title: String,
    authors: String,
    textContent: String,
    fileUrl: String,
    isPublic: Boolean
  }, {timestamps: true});
  
  const article = mongoose.model('Article', articleSchema);
  
  // Podcast Schema (for Spotify links)
  const podcastSchema = new mongoose.Schema({
    title: String,
    hosts: String,
    spotifyLink: String,  // Only Spotify links for podcasts
    isPublic: Boolean
  }, {timestamps: true});
  
  const podcast = mongoose.model('Podcast', podcastSchema);
  
  // Newsletter Schema (for PDFs)
  const newsletterSchema = new mongoose.Schema({
    title: String,
    authors: String,
    fileUrl: String,  // Only PDFs for newsletters
    isPublic: Boolean
  }, {timestamps: true});
  
  const newsletter = mongoose.model('Newsletter', newsletterSchema);
  
  export { journal, article, podcast, newsletter };