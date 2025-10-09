import express from "express";
import { addJournal, deleteJournal, addArticle, deleteArticle, addPodcast, deletePodcast, getAllJournals, getAllArticles, getAllPodcasts, getAllNewsletters, updateArticle, updatePodcast, addNewsletter, deleteNewsletter, updateNewsletter, updateJournal } from "../controllers/publication.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { protectAdmin } from "../middlewares/auth.middleware.js";

const protectedPublicationRouter = express.Router();
const publicPublicationRouter = express.Router();

// protected routes
protectedPublicationRouter.post("/add-journal", protectAdmin, upload.single("file"), addJournal);
protectedPublicationRouter.post("/add-article", protectAdmin, addArticle);
protectedPublicationRouter.post("/add-podcast", protectAdmin, addPodcast);
protectedPublicationRouter.post("/add-newsletter", protectAdmin, upload.single("file"), addNewsletter);

protectedPublicationRouter.delete("/delete-journal/:id", protectAdmin, deleteJournal);
protectedPublicationRouter.delete("/delete-article/:id", protectAdmin, deleteArticle);
protectedPublicationRouter.delete("/delete-podcast/:id", protectAdmin, deletePodcast);
protectedPublicationRouter.delete("/delete-newsletter/:id", protectAdmin, deleteNewsletter);

protectedPublicationRouter.put("/update-article/:id", protectAdmin, updateArticle);
protectedPublicationRouter.put("/update-podcast/:id", protectAdmin, updatePodcast);
protectedPublicationRouter.put("/update-newsletter/:id", protectAdmin, updateNewsletter);
protectedPublicationRouter.put("/update-journal/:id", protectAdmin, upload.single("file"), updateJournal);

// public routes
publicPublicationRouter.get("/get-all-journals", getAllJournals);
publicPublicationRouter.get("/get-all-articles", getAllArticles);
publicPublicationRouter.get("/get-all-podcasts", getAllPodcasts);
publicPublicationRouter.get("/get-all-newsletters", getAllNewsletters);


export {protectedPublicationRouter, publicPublicationRouter};
