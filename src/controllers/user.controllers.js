import asyncHandler from  "../utils/asyncHandler.js"

import Apierr from "../utils/Apierror.js"

import User from "../models/user.model.js"

import Uploadcloudinary from "../utils/fileUploader.js"

import { Apireasponse } from "../utils/Apireasponse.js"

const registerUser=asyncHandler(async(req,res)=>{
   //get user details from frontend
   //validation- not empaty
   //check user if user already exits: username and email
   //check for image ,chech avatar
   //upload them cloudinary ,avatar
   // create user object-create entry in db
   // remove password and referesh tocken field from response
   // return response
   const{username,email,fullname,password}=req.body
   // console.log("email",email,username,fullname,password)
   // console.log(req.body)// To check body jashon data object
   // console.log(req.files)//to check body file object data
   if(
      [username,email,fullname,password].some((field)=>field?.trim()==="")//.some() checks if at least one item in the array matches a condition
       // If even one is empty → it returns true.trim() removes spaces from start and end of a string.
       //?. (optional chaining) makes sure it doesn’t crash if field is null or undefined.

   ){
      throw new Apierr(400,"All fields are reuired")//// If .some(...) finds at least one empty field → it throws an error.
   };

   const exitedUser=await User.findOne({//This looks in your MongoDB collection (the User model) and tries to find one user that matches the condition.
      $or: [{username},{email}]//“Check in the database if a user already exists with the same username OR the same email.”
   })
   if(exitedUser){
      throw new Apierr(409,"User with email or username already exists")// if yes throw error
   };

   const avatarLocalPath = req.files?.avatar[0]?.path;// here extract  local path from req.files
   const coverImageLocalPath = req.files?.coverImage[0]?.path
   // console.log(avatarLocalPath)

   if(!avatarLocalPath){
      throw new Apierr(400,"Avatar is required")
   };
   
    const avatar = await Uploadcloudinary( avatarLocalPath );//upload image on cloudinary using Uploadcloudinary utils methods
    const cover = await Uploadcloudinary(coverImageLocalPath);//after upload Cloudinary’s API responds with an object that contains details about the uploaded file.
      // console.log(avatar)// debug for file successfully uploaded or not on cloudinary
      // console.log(cover)//
   if(!avatar){
      throw new Apierr(400,"Avatar file is required")
    };
    
   const user= await User.create({
      fullname,
      avatar:avatar.url,
      coverImage:cover?.url|| "",// here extract url from const coverImage after upload Cloudinary’s API responds with an object
      email,
      password,
      username: username.toLowerCase()

    });

   const createdUser = await User.findById(user._id).select(//The select() method tells MongoDB which fields to include/(-)exclude.
      "_-password" -"refereshToken:"//User.findById(user._id).Looks up a user in MongoDB by their _id.finds the user who just registered.
    );

   if(!createdUser){ // this error from my side means server side thats why we throw menualy 
      throw new Apierr(500,"Something went wrong while regestring user")
    };

   return res.status(200).json(
      new Apireasponse(200,createdUser,"user register successfully")
    );


})
export {registerUser}
console.log("Controller file loaded, registerUser is:", registerUser)
