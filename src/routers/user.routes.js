import { Router } from "express";

import { registerUser } from "../controllers/user.controllers.js";

import {upload} from "../middlewares/multer.middleware.js"

console.log("RegisterUser imported:", registerUser)// to check bug we proparly import it
const router=Router()

router.route("/register").post(upload.fields([
    // uase middleware to upload image 
    // Middleware (upload.fields) runs BEFORE controller
    // Here, upload.fields(...) runs first and attaches req.files.
    {
        name:"avatar",
        maxCount:1
    },
    {
        nmae:"coverImage",
        maxCount:1
    }

]),registerUser)

export default router