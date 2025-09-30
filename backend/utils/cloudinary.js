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

export { uploadOnCloudinary };
