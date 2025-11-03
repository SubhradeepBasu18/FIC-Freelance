import Sponsor from "../models/sponsor.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const addNewsponsor = async (req, res) => {
    try {
        const {name} = req.body

        // const exisitingsponsor = await Sponsor.findOne({name})
        // if(exisitingsponsor){
        //     return res.status(400).json({message: "sponsor already exists"})
        // }

        if(!name){
            return res.status(400).json({message: "Name is required"})
        }

        const imageLocalPath = req?.file?.path
        if(!imageLocalPath){
            return res.status(400).json({message: "Image is required"})
        }

        const imageUploadedOnCloudinary = await uploadOnCloudinary(imageLocalPath)

        const newsponsor = await Sponsor.create({
            name,
            image: imageUploadedOnCloudinary.secure_url
        })

        return res.status(201).json({message: "sponsor added successfully", newsponsor})
    } catch (error) {
        return res.status(500).json({message: "Internal Server Error", error: error.message})
    }
}

const getAllsponsor = async (req, res) => {
    try {
        const sponsor = await Sponsor.find()
        return res.status(200).json({message: "sponsor fetched successfully", sponsor})
    } catch (error) {
        return res.status(500).json({message: "Internal Server Error", error: error.message})
    }
}

const getsponsorById = async (req, res) => {
    try {
        const {id} = req.params
        const sponsor = await Sponsor.findById(id)
        return res.status(200).json({message: "sponsor fetched successfully", sponsor})
    } catch (error) {
        return res.status(500).json({message: "Internal Server Error", error: error.message})
    }
}

const deletesponsorById = async (req, res) => {
    try {
        const {id} = req.params
        const sponsor = await Sponsor.findByIdAndDelete(id)
        return res.status(200).json({message: "sponsor deleted successfully", sponsor})
    } catch (error) {
        return res.status(500).json({message: "Internal Server Error", error: error.message})
    }
}

const updatesponsorById = async (req, res) => {
    try {
        const {id} = req.params
        const sponsor = await Sponsor.findByIdAndUpdate(id, req.body, {new: true})
        return res.status(200).json({message: "sponsor updated successfully", sponsor})
    } catch (error) {
        return res.status(500).json({message: "Internal Server Error", error: error.message})
    }
}

export {
    addNewsponsor,
    getAllsponsor,
    getsponsorById,
    deletesponsorById,
    updatesponsorById
}
