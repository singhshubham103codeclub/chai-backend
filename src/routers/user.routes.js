import { Router } from "express";

import { registerUser,
   userLogin,
   userLogout,
   refereshToken,
   ChangePassword,
   CurrenrtUser,
   updateAccountdetails,
   UpdateAvatar,
   UpdateUserCoverImage,
   getUserProfile ,
   getWatchistory
} from "../controllers/user.controllers.js";//Your controller file (user.controllers.js) contains the function registerUser.
// This function defines what should happen when a user hits the /register endpoint
//👉 Without this import, your router won’t know what to do when someone calls /register.

import {upload} from "../middlewares/multer.middleware.js"

// console.log("RegisterUser imported:", registerUser)// to check bug we proparly import it
import { Verify_JWT_Token } from "../middlewares/auth.middleware.js";
const router=Router()////Router() is like a mini Express app just for handling a specific set of routes.

router.route("/register").post(upload.fields([
    // uase middleware to upload image 
    // Middleware (upload.fields) runs BEFORE controller
    // Here, upload.fields(...) runs first and attaches req.files.
    {
        name:"avatar",
        maxCount:1
    },
    {
        name:"coverImage",
        maxCount:1
    }

]),registerUser)

// here write the user userLogin route 
router.route("/userLogin").post(userLogin)  // This line defines a POST route for user login. When a POST request is made to /userLogin, the userLogin controller function will be executed to handle the login logic.

//secured route for user logout
router.route("/logout").post(Verify_JWT_Token,userLogout);// here we use Verify_JWT_Token middleware to protect the logout route, ensuring that only authenticated users can access it. The userLogout controller will handle the actual logout logic after the token is verified.

router.route("/refresh-token").post(refereshToken) // This line defines a post route for refreshing tokens. When a GET request is made to /refresh, the refereshToken controller function will be executed to handle the logic for refreshing the user's authentication token.
router.route("/change-password").post(Verify_JWT_Token,ChangePassword) // This line defines a POST route for changing the user's password. The Verify_JWT_Token middleware ensures that only authenticated users can access this route, and the changePassword controller will handle the logic for updating the user's password in the database.
router.route("/current-user").get(Verify_JWT_Token,CurrenrtUser) // This line defines a GET route for fetching the current user's details. The Verify_JWT_Token middleware ensures that only authenticated users can access this route, and the getCurrentUser controller will handle the logic for retrieving the user's information from the database and sending it back in the response.
router.route("/update-account").patch(Verify_JWT_Token,updateAccountdetails) // This line defines a PUT route for updating the user's account details. The Verify_JWT_Token middleware ensures that only authenticated users can access this route, and the updateAccountdetails controller will handle the logic for updating the user's account information in the database based on the data provided in the request body.
router.route("/update-avatar").patch(Verify_JWT_Token,upload.single("avatar"),UpdateAvatar) // This line defines a PUT route for updating the user's avatar. The Verify_JWT_Token middleware ensures that only authenticated users can access this route, and the upload.single("avatar") middleware handles the file upload for the avatar image. The UpdateAvatar controller will then process the uploaded file and update the user's avatar in the database.
router.route("/update-cover-image").patch(Verify_JWT_Token,upload.single("coverImage"),UpdateUserCoverImage) // This line defines a PUT route for updating the user's cover image. The Verify_JWT_Token middleware ensures that only authenticated users can access this route, and the upload.single("coverImage") middleware handles the file upload for the cover image. The UpdateUserCoverImage controller will then process the uploaded file and update the user's cover image in the database.
router.route("/channel/:username").get(getUserProfile) // This line defines a GET route for fetching a user's channel profile based on their username. When a GET request is made to /channel/:username, the getUserProfile controller function will be executed to handle the logic for retrieving the user's channel information from the database and sending it back in the response.
router.route("/watch-history").get(Verify_JWT_Token,getWatchistory) // This line defines a GET route for fetching the user's watch history. The Verify_JWT_Token middleware ensures that only authenticated users can access this route, and the getWatchistory controller will handle the logic for retrieving the user's watch history

export default router //export default router → make this router available to app.js so your main server can use it.