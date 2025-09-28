import express from "express";
import { addJournal, deleteJournal, addArticle, deleteArticle, addPodcast, deletePodcast } from "../controllers/publication.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/add-journal", upload.single("file"), addJournal);
router.delete("/delete-journal/:id", deleteJournal);
router.post("/add-article", addArticle);
router.delete("/delete-article/:id", deleteArticle);
router.post("/add-podcast", addPodcast);
router.delete("/delete-podcast/:id", deletePodcast);

export default router;
