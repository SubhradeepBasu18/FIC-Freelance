import { journal, article, podcast, newsletter } from "../models/publication.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

//Journal Controller
const addJournal = async(req, res) => {
    try {
        
        const {title, description} = req.body

        if(!title || !description) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        const journalFilePath = req?.file?.path
        const journalFileURL = await uploadOnCloudinary(journalFilePath)

        if(!journalFileURL) {
            return res.status(400).json({
                message: "File upload failed"
            })
        }

        const newJournal = await journal.create({
            title,
            description,
            fileUrl: journalFileURL.url
        })

        if(!newJournal) {
            return res.status(400).json({
                message: "Journal creation failed"
            })
        }

        return res.status(201).json({
            message: "Journal added successfully",
            journal: newJournal
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

const deleteJournal = async(req, res) => {
    try {
        
        const {id} = req.params
        const deletedJournal = await journal.findByIdAndDelete(id)

        if(!deletedJournal) {
            return res.status(404).json({
                message: "Journal not found"
            })
        }

        return res.status(200).json({
            message: "Journal deleted successfully",
            journal: deletedJournal
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

//Article Controller
const addArticle = async(req, res) => {
    try {

        const {title, description, textContent} = req.body

        if(!title || !description || !textContent) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        const newArticle = await article.create({
            title,
            description,
            textContent
        })

        if(!newArticle) {
            return res.status(400).json({
                message: "Article creation failed"
            })
        }

        return res.status(201).json({
            message: "Article added successfully",
            article: newArticle
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

const deleteArticle = async(req, res) => {
    try {
        
        const {id} = req.params
        const deletedArticle = await article.findByIdAndDelete(id)

        if(!deletedArticle) {
            return res.status(404).json({
                message: "Article not found"
            })
        }

        return res.status(200).json({
            message: "Article deleted successfully",
            article: deletedArticle
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

//Podcast Controller
const addPodcast = async(req, res) => {
    try {

        const {title, description, spotifyLink} = req.body

        if(!title || !description || !spotifyLink) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        const newPodcast = await podcast.create({
            title,
            description,
            spotifyLink
        })

        if(!newPodcast) {
            return res.status(400).json({
                message: "Podcast creation failed"
            })
        }

        return res.status(201).json({
            message: "Podcast added successfully",
            podcast: newPodcast
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

const deletePodcast = async(req, res) => {
    try {
        
        const {id} = req.params
        const deletedPodcast = await podcast.findByIdAndDelete(id)

        if(!deletedPodcast) {
            return res.status(404).json({
                message: "Podcast not found"
            })
        }

        return res.status(200).json({
            message: "Podcast deleted successfully",
            podcast: deletedPodcast
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}



export {addJournal, deleteJournal, addArticle, deleteArticle, addPodcast, deletePodcast}