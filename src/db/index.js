
import mongoose from "mongoose";
// import express from "express";
import {DB_NAME} from "../constant.js";
// import e from "express";
// Load environment variables from a .env file
const connectDB=async()=>{
    try {
        // Attempt to connect to MongoDB
        const conectionInstance=await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log(`/nDatabase connected successfully! at ${conectionInstance.connection.host}`);
        // app.on("error",(error)=>{
        //     console.error("Server setup error:",error);
        //      process.exit(1); // Exit the process with an error code
        // })
        // app.listen(process.env.PORT,()=>{
        //     console.log(`App is listening on port ${process.env.PORT}`);
        // })
    } catch (error) {
        // Catch and log any errors during the database connection
        console.error("MongoDB connection failed:", error);
        process.exit(1); // Exit the process with an error code
    }
}
export default connectDB;