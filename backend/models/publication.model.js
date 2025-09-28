import mongoose from "mongoose";

// Journal Schema (for PDFs)
const journalSchema = new mongoose.Schema({
    title: String,
    description: String,
    fileUrl: String,  // Only PDFs for journals
  }, {timestamps: true});
  
  const journal = mongoose.model('Journal', journalSchema);
  
  // Article Schema (for text content)
  const articleSchema = new mongoose.Schema({
    title: String,
    description: String,
    textContent: String,  // Only text for articles
  }, {timestamps: true});
  
  const article = mongoose.model('Article', articleSchema);
  
  // Podcast Schema (for Spotify links)
  const podcastSchema = new mongoose.Schema({
    title: String,
    description: String,
    spotifyLink: String,  // Only Spotify links for podcasts
  }, {timestamps: true});
  
  const podcast = mongoose.model('Podcast', podcastSchema);
  
  // Newsletter Schema (for PDFs)
  const newsletterSchema = new mongoose.Schema({
    title: String,
    description: String,
    fileUrl: String,  // Only PDFs for newsletters
  }, {timestamps: true});
  
  const newsletter = mongoose.model('Newsletter', newsletterSchema);
  
  export { journal, article, podcast, newsletter };