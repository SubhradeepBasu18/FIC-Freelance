import express from "express";
import { addJournal, deleteJournal, addArticle, deleteArticle, addPodcast, deletePodcast, getAllJournals, getAllArticles, getAllPodcasts, getAllNewsletters, updateArticle, updatePodcast } from "../controllers/publication.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { protectAdmin } from "../middlewares/auth.middleware.js";

const protectedPublicationRouter = express.Router();
const publicPublicationRouter = express.Router();

// protected routes
protectedPublicationRouter.post("/add-journal", protectAdmin, upload.single("file"), addJournal);
protectedPublicationRouter.delete("/delete-journal/:id", protectAdmin, deleteJournal);
protectedPublicationRouter.post("/add-article", protectAdmin, addArticle);
protectedPublicationRouter.delete("/delete-article/:id", protectAdmin, deleteArticle);
protectedPublicationRouter.post("/add-podcast", protectAdmin, addPodcast);
protectedPublicationRouter.delete("/delete-podcast/:id", protectAdmin, deletePodcast);
protectedPublicationRouter.put("/update-article/:id", protectAdmin, updateArticle);
protectedPublicationRouter.put("/update-podcast/:id", protectAdmin, updatePodcast);

// public routes
publicPublicationRouter.get("/get-all-journals", getAllJournals);
publicPublicationRouter.get("/get-all-articles", getAllArticles);
publicPublicationRouter.get("/get-all-podcasts", getAllPodcasts);
publicPublicationRouter.get("/get-all-newsletters", getAllNewsletters);


export {protectedPublicationRouter, publicPublicationRouter};
