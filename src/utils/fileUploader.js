import * as cloudinary from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload image to cloudinary
const Uploadcloudinary = async (filePath) => {// console.log("file path in cloudinary", filePath);
    try {
        if(!filePath) return null;
        const reponse = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto",
        });
        console.log("file uploaded to cloudinary successfully", reponse.url);
        fs.unlinkSync(filePath);
        return reponse;
    } catch (error) {
        fs.unlinkSync(filePath);
        console.log("error while uploading file to cloudinary", error);
        return null;
    }
};

export default Uploadcloudinary;
