// require('dotenv').config({path:'./env'});
// second method
import dotenv from "dotenv";
import{DB_NAME} from "./constant.js"
import connectDB from "./db/index.js";
dotenv.config({path:"./.env"})// Load environment variables from a .env file





connectDB();















// This file sets up a basic Node.js server with Express and Mongoose.
// It connects to a MongoDB database and then starts the server.

// Import necessary modules
// const express = require('express');
// import mongoose from "mongoose";
// import { DB_NAME } from "../constant";
// require('dotenv').config(); // Load environment variables from a .env file

// Create the Express app
// const app = express();

// Set up constants using environment variables
// const DB_NAME = process.env.DB_NAME;

// Define an asynchronous function to connect to the database and start the server
// const connectDBAndStartServer = async () => {
//   try {
    // Attempt to connect to MongoDB
    // await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    // console.log("Database connected successfully!");

    // Handle any errors that occur after the server is started
    // app.on("error", (error) => {
    //   console.error("Server setup error:", error);
    //   throw error;
    // });

    // Start the server and listen on the specified port
    // app.listen(process.env.PORT, () => {
    //   console.log(`App is listening on port ${PORT}`);npm
    // });
  // } catch (error) {
    // Catch and log any errors during the database connection
    // console.error("MongoDB connection failed:", error);
    // process.exit(1); // Exit the process with an error code
  // }
// };

// Call the function to start the application
// connectDBAndStartServer();
