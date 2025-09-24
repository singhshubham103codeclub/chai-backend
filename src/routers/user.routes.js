import { Router } from "express";

import { registerUser } from "../controllers/user.controllers.js";//Your controller file (user.controllers.js) contains the function registerUser.
// This function defines what should happen when a user hits the /register endpoint
//👉 Without this import, your router won’t know what to do when someone calls /register.

import {upload} from "../middlewares/multer.middleware.js"

console.log("RegisterUser imported:", registerUser)// to check bug we proparly import it
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

export default router //export default router → make this router available to app.js so your main server can use it.