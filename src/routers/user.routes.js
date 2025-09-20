import { Router } from "express";

import { registerUser } from "../controllers/user.controllers.js";
console.log("RegisterUser imported:", registerUser)
const router=Router()

router.route("/register").post(registerUser)

export default router