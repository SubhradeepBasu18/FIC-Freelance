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

const getAllJournals = async(req, res) => {
    try {
        const journals = await journal.find()

        if(!journals) {
            return res.status(404).json({
                message: "Journals not found"
            })
        }

        return res.status(200).json({
            message: "Journals fetched successfully",
            journals
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

        const {title, authors, textContent, isPublic = true} = req.body

        if(!title || !authors || !textContent) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        const newArticle = await article.create({
            title,
            authors,
            textContent,
            isPublic
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

const getAllArticles = async(req, res) => {
    try {
        const articles = await article.find()

        if(!articles) {
            return res.status(404).json({
                message: "Articles not found"
            })
        }

        return res.status(200).json({
            message: "Articles fetched successfully",
            articles
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

const updateArticle = async(req, res) => {
    try {
        const {title, description, textContent, isPublic} = req.body;
        const {id} = req.params;

        const updatedArticle = await article.findByIdAndUpdate(id, {
            title,
            description,
            textContent,
            isPublic
        })

        if(!updatedArticle) {
            return res.status(404).json({
                message: "Article not found"
            })
        }

        return res.status(200).json({
            message: "Article updated successfully",
            article: updatedArticle
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

        const {title, hosts, spotifyLink, isPublic = true} = req.body

        if(!title || !hosts || !spotifyLink) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        const newPodcast = await podcast.create({
            title,
            hosts,
            spotifyLink,
            isPublic
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

const getAllPodcasts = async(req, res) => {
    try {
        const podcasts = await podcast.find()

        if(!podcasts) {
            return res.status(404).json({
                message: "Podcasts not found"
            })
        }

        return res.status(200).json({
            message: "Podcasts fetched successfully",
            podcasts
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

const updatePodcast = async(req, res) => {
    try {
        const {id} = req.params
        const {title, hosts, spotifyLink, isPublic = true} = req.body

        const updatedPodcast = await podcast.findByIdAndUpdate(id, {
            title,
            hosts,
            spotifyLink,
            isPublic
        })

        if(!updatedPodcast) {
            return res.status(404).json({
                message: "Podcast not found"
            })
        }

        return res.status(200).json({
            message: "Podcast updated successfully",
            podcast: updatedPodcast
        })       
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

//newletter
const addNewsletter = async(req, res) => {
    try {
        
        const { title, description } = req.body

        if(!title || !description) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        const fileLocalPath = req?.file?.path
        const fileUrl = await uploadOnCloudinary(fileLocalPath)

        if(!fileUrl) {
            return res.status(400).json({
                message: "File upload failed"
            })
        }

        const newNewsletter = await newsletter.create({
            title,
            description,
            fileUrl
        })

        if(!newNewsletter) {
            return res.status(400).json({
                message: "Newsletter creation failed"
            })
        }

        return res.status(201).json({
            message: "Newsletter added successfully",
            newsletter: newNewsletter
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}   

const deleteNewsletter = async(req, res) => {
    try {
            const {id} = req.params
            const deletedNewsletter = await newsletter.findByIdAndDelete(id)

            if(!deletedNewsletter) {
                return res.status(404).json({
                    message: "Newsletter not found"
                })
            }

            return res.status(200).json({
                message: "Newsletter deleted successfully",
                newsletter: deletedNewsletter
            })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

const getAllNewsletters = async(req, res) => {
    try {
        const newsletters = await newsletter.find()

        if(!newsletters) {
            return res.status(404).json({
                message: "Newsletters not found"
            })
        }

        return res.status(200).json({
            message: "Newsletters fetched successfully",
            newsletters
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}


export {
    addJournal, 
    deleteJournal, 
    addArticle, 
    deleteArticle, 
    addPodcast, 
    deletePodcast, addNewsletter, 
    deleteNewsletter, 
    getAllJournals, 
    getAllArticles, 
    getAllPodcasts, 
    getAllNewsletters,
    updateArticle,
    updatePodcast
}