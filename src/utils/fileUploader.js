import cloudinary{v2 as cloudinary} ,from "cloudinary";
import fs from "fs";
    // Configuration

    cloudinary.config({ 
        cloud_name: 'proccess.env.CLOUDINARY_NAME', 
        api_key: 'proccess.env.CLOUDINARY_API_KEY', 
        api_secret: 'proccess.env.CLOUDINARY_API_SECRET' // Click 'View API Keys' above to copy your API secret
    })
    // Upload image to cloudinary
    const Uploadcloudinary = async (filePath)=>{
        try {
            if(!filePath) return null;
            const reponse=await cloudinary.uploader.upload(filePath,{// upload the image
                resource_type:"auto",// auto detect the file type
                
            })
            console.log("file uploaded to cloudinary successfully",reponse.url);
            return reponse;// return the url of the uploaded image
        } catch (error) {
           fs.unlinkSync(filePath);// remove the file from local uploads folder as the upload  got failed
           console.log("error while uploading file to cloudinary",error);// log the error
           return null; // return null in case of error
        }
    }
    export default Uploadcloudinary;
