import express from "express";
import { createAlbum, uploadMediaToAlbum, getAlbumById, getAllAlbums, deleteAlbum, deleteMediaFromAlbumByID, getAllImages } from "../controllers/gallery.controller.js";
import { protectAdmin } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const protectedGalleryRouter = express.Router();
const publicGalleryRouter = express.Router();

//protected routes
protectedGalleryRouter.post("/create-album", protectAdmin, upload.single("coverImage"), createAlbum);
protectedGalleryRouter.post("/upload-media-to-album/:albumId", protectAdmin, upload.array("media", 10), uploadMediaToAlbum);
protectedGalleryRouter.delete("/delete-album/:albumId",protectAdmin, deleteAlbum);
protectedGalleryRouter.delete("/delete-media-from-album/:albumId/:mediaId",protectAdmin, deleteMediaFromAlbumByID);

//public routes
publicGalleryRouter.get("/get-album/:albumId", getAlbumById);
publicGalleryRouter.get("/get-all-albums", getAllAlbums);
publicGalleryRouter.get("/get-all-images", getAllImages);
export {protectedGalleryRouter, publicGalleryRouter};