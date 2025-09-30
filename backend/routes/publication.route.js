import express from "express";
import { addJournal, deleteJournal, addArticle, deleteArticle, addPodcast, deletePodcast, getAllJournals, getAllArticles, getAllPodcasts, getAllNewsletters } from "../controllers/publication.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { protectAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// protected routes
router.post("/add-journal", protectAdmin, upload.single("file"), addJournal);
router.delete("/delete-journal/:id", protectAdmin, deleteJournal);
router.post("/add-article", protectAdmin, addArticle);
router.delete("/delete-article/:id", protectAdmin, deleteArticle);
router.post("/add-podcast", protectAdmin, addPodcast);
router.delete("/delete-podcast/:id", protectAdmin, deletePodcast);

// public routes
router.get("/get-all-journals", getAllJournals);
router.get("/get-all-articles", getAllArticles);
router.get("/get-all-podcasts", getAllPodcasts);
router.get("/get-all-newsletters", getAllNewsletters);


export default router;
