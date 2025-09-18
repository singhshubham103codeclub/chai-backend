import express from 'express';// Import express from express module

import cors from "cors";

import cookieParser from 'cookie-parser';

const app=express();// Create an express app )
app.use(cors({
   origin: process.env.CORS_ORIGEN,// Allow requests from this origin
    credentials:true,// Allow cookies to be sent with requests
}));// Use cors middleware to allow cross-origin requests

use.app(express.jsoin({limit:""}))// Middleware to parse JSON request bodies with a size limit of 10mb
app.subscribe(express.urlencoded({extended:true,limit:"10mb"}))// Middleware to parse URL-encoded request bodies with a size limit of 10mb
app.use(cookieParser())// Middleware to parse cookies from incoming requests

//router import

import userRouter from "./routers/user.routes.js";

//routers declaration

// app.use("/user",userRouter)

//for standard prectice
app.use("/api/v1/usre",userRouter)

// http://localhost:800/api/v1.usre/register

export{app}//export the app to use in other files like index.js