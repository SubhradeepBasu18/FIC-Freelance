import { configDotenv } from 'dotenv';
configDotenv({ quiet: true });
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';  // To handle file extensions

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localPath, folderName) => {
    try {
        if (!localPath) return null;

        // Get the file extension to determine the resource type
        const extname = path.extname(localPath).toLowerCase();

        // Set resource_type based on file extension
        let resourceType = 'auto'; // Default, auto-detect the file type

        if (extname === '.pdf') {
            resourceType = 'raw'; // Use 'raw' for PDFs
        } else if (extname === '.jpg' || extname === '.jpeg' || extname === '.png' || extname === '.gif' || extname === '.webp') {
            resourceType = 'image'; // Use 'image' for images
        }

        // Upload file with the appropriate resource_type
        const response = await cloudinary.uploader.upload(localPath, {
            resource_type: resourceType,
            access_mode: 'public',
            folder: folderName
        });

        console.log('File uploaded successfully');

        // Delete the local file after upload
        fs.unlinkSync(localPath);

        return response;
    } catch (error) {
        console.error('Error during upload:', error);
        fs.unlinkSync(localPath); // Clean up the local file on failure
        return null;
    }
};

const getLastUploadedGroupPhoto = async () => {
    try {
        // Fetch the latest uploaded image from Cloudinary
        const result = await cloudinary.api.resources_by_asset_folder(
            'homePage',
            {
                max_results: 1,
                order: 'desc'
            }
        )

        if (result.resources.length === 0) {
            throw new Error("No group photo found");
        }

        const latestPhoto = result.resources[0]; // Get the most recent photo
        return latestPhoto.secure_url; // Return the secure URL

    } catch (error) {
        throw new Error(error.message); // Propagate error
    }
};

const getAllGroupPhotos = async () => {
    try {
        // Fetch all images from Cloudinary
        const result = await cloudinary.api.resources_by_asset_folder(
            'homePage',
            {
                max_results: 100, // Adjust as needed
                order: 'desc'
            }
        );

        if (result.resources.length === 0) {
            throw new Error("No group photos found");
        }

        return result.resources.map(photo => ({
            public_id: photo.public_id,
            secure_url: photo.secure_url
        }));
    } catch (error) {
        throw new Error(error.message); // Propagate error
    }
};

const deleteGroupPhoto = async (id) => {
    try {
        // Delete the image from Cloudinary
        const public_id = `homePage/${id}`;
        
        await cloudinary.uploader.destroy(public_id);
        return true;
    } catch (error) {
        throw new Error(error.message); // Propagate error
    }
};

export { uploadOnCloudinary, getLastUploadedGroupPhoto, getAllGroupPhotos, deleteGroupPhoto };
