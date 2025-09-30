import express from "express";
import { createAlbum, uploadMediaToAlbum, getAlbumById, getAllAlbums, deleteAlbum, deleteMediaFromAlbumByID } from "../controllers/gallery.controller.js";
import { protectAdmin } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

//protected routes
router.post("/create-album", protectAdmin, upload.single("coverImage"), createAlbum);
router.post("/upload-media-to-album/:albumId", protectAdmin, upload.array("media", 10), uploadMediaToAlbum);
router.delete("/delete-album/:albumId",protectAdmin, deleteAlbum);
router.delete("/delete-media-from-album/:albumId/:mediaId",protectAdmin, deleteMediaFromAlbumByID);

//public routes
router.get("/get-album/:albumId", getAlbumById);
router.get("/get-all-albums", getAllAlbums);
export default router;