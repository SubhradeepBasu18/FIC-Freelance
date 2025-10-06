import { Album } from "../models/gallery.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// delete media from album
// update album

const createAlbum = async(req, res) => {
    try {
        
        const { title, isPublic } = req.body
        if(!title ){
            return res.status(400).json({
                message: "Title is required"
            })
        }

        const coverImageLocalImagePath = req?.file?.path
        const coverImagePath = await uploadOnCloudinary(coverImageLocalImagePath)

        const album = await Album.create({
            title,
            coverImage: coverImagePath.url,
            isPublic,
            createdBy: req.admin._id
        })

        return res.status(201).json({
            message: "Album created successfully",
            album
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Something went wrong while creating album"
        })
    }
}

const uploadMediaToAlbum = async(req, res) => {
    try {
        const {albumId} = req.params

        const album = await Album.findById(albumId)
        if(!album) return res.status(400).json({message: "Album not found"})

        const mediaLocalImagePaths = req?.files?.map((file) => file.path)
        
        const mediaPaths = await Promise.all(mediaLocalImagePaths?.map((path) => uploadOnCloudinary(path, album.title)))
        

        await album.updateOne({
            $push: { mediaItems: mediaPaths?.map((path) => path.url) }
        })
        
        return res.status(200).json({
            message: "Media uploaded successfully",
            album
        })
        

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Something went wrong while uploading media to album"
        })       
    }
}

const getAlbumById = async(req, res) => {
    try {
        const {albumId} = req.params

        const album = await Album.findById(albumId)
        if(!album) return res.status(400).json({message: "Album not found"})

        return res.status(200).json({
            message: "Album fetched successfully",
            album
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Something went wrong while fetching album"
        })
    }
}

const getAllAlbums = async(req, res) => {
    try {
        const albums = await Album.find()
        if(!albums) return res.status(400).json({message: "Albums not found"})

        return res.status(200).json({
            message: "Albums fetched successfully",
            albums
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Something went wrong while fetching albums"
        })
    }
}

const deleteAlbum = async(req, res) => {
    try {
        const {albumId} = req.params

        const album = await Album.findByIdAndDelete(albumId)
        if(!album) return res.status(400).json({message: "Album not found"})

        return res.status(200).json({
            message: "Album deleted successfully",
            album
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Something went wrong while deleting album"
        })
    }
}

const deleteMediaFromAlbumByID = async(req, res) => {
    try {
        const {albumId, mediaId} = req.params

        const album = await Album.findById(albumId)
        if(!album) return res.status(400).json({message: "Album not found"})

        const media = await album.updateOne({
            $pull: { mediaItems: mediaId }
        })

        return res.status(200).json({
            message: "Media deleted successfully",
            media
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Something went wrong while deleting media from album"
        })
    }
}

const getAllImages = async(req, res) => {
    try {
        const allImages = await Album.aggregate([
            {$unwind: "$mediaItems"},
            {$project: {mediaItems: 1}}
        ])
        if(!allImages) return res.status(400).json({message: "Images not found"})

        return res.status(200).json({
            message: "Images fetched successfully",
            images: allImages
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Something went wrong while fetching images"
        })
    }
}

export { createAlbum, uploadMediaToAlbum, getAlbumById, getAllAlbums, deleteAlbum, deleteMediaFromAlbumByID, getAllImages }