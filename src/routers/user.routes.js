import { Router } from "express";

import { userLogin, registerUser , userLogout} from "../controllers/user.controllers.js";//Your controller file (user.controllers.js) contains the function registerUser.
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

export default router //export default router → make this router available to app.js so your main server can use it.