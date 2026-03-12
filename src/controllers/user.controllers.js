import asyncHandler from "../utils/asyncHandler.js"

import Apierr from "../utils/Apierror.js"

import User from "../models/user.model.js"

import Uploadcloudinary from "../utils/fileUploader.js"

import { Apireasponse } from "../utils/Apireasponse.js"

const generetAccessAndrefereshToken = async (userId) => {// This function generates access and refresh tokens for a user based on their user ID.

   try {
      const user = await User.findById(userId)// This line retrieves the user from the database using their user ID. It uses the User model to find the user by their unique identifier (userId).
      const accessToken = user.generateAccessToken();//
      const refereshToken = user.generateRefreshToken();// This line generates a refresh token for the user by calling the generateRefreshToken method on the user object. This method is likely defined in the User model and is responsible for creating a new refresh token that can be used to obtain new access tokens when the current access token expires.
      user.refereshToken = refereshToken// This line assigns the generated refresh token to the refereshToken field of the user object. This allows the application to store the refresh token in the database for later use when the user needs to refresh their access token.
     await user.save({ validateBeforeSave: false })// This line saves the updated user object back to the database. The {validateBeforeSave: false} option is used to skip any validation checks that might be defined in the User model, allowing the refresh token to be saved without triggering any validation errors.
      return { accessToken, refereshToken };// Finally, the function returns an object containing both the access token and the refresh token, which can be used by the client to authenticate subsequent requests and refresh tokens when needed. 
   } catch (error) {
      throw new Apierr(500, "Something went wrong while genereting tocken")

   }
}

const registerUser = asyncHandler(async (req, res) => {
   //get user details from frontend
   //validation- not empaty
   //check user if user already exits: username and email
   //check for image ,chech avatar
   //upload them cloudinary ,avatar
   // create user object-create entry in db
   // remove password and referesh tocken field from response
   // return response
   const { username, email, fullname, password } = req.body
   // console.log("email",email,username,fullname,password)
   // console.log(req.body)// To check body jashon data object
   // console.log(req.files)//to check body file object data
   if (
      [username, email, fullname, password].some((field) => field?.trim() === "")//.some() checks if at least one item in the array matches a condition
      // If even one is empty → it returns true.trim() removes spaces from start and end of a string.
      //?. (optional chaining) makes sure it doesn’t crash if field is null or undefined.

   ) {
      throw new Apierr(400, "All fields are reuired")//// If .some(...) finds at least one empty field → it throws an error.
   };

   const exitedUser = await User.findOne({//This looks in your MongoDB collection (the User model) and tries to find one user that matches the condition.
      $or: [{ username }, { email }]//“Check in the database if a user already exists with the same username OR the same email.”
   })
   if (exitedUser) {
      throw new Apierr(409, "User with email or username already exists")// if yes throw error
   };

   const avatarLocalPath = req.files?.avatar[0]?.path;// here extract  local path from req.files
   const coverImageLocalPath = req.files?.coverImage[0]?.path
   // console.log(avatarLocalPath)

   if (!avatarLocalPath) {
      throw new Apierr(400, "Avatar is required")
   };

   const avatar = await Uploadcloudinary(avatarLocalPath);//upload image on cloudinary using Uploadcloudinary utils methods
   const cover = await Uploadcloudinary(coverImageLocalPath);//after upload Cloudinary’s API responds with an object that contains details about the uploaded file.
   // console.log(avatar)// debug for file successfully uploaded or not on cloudinary
   // console.log(cover)//
   if (!avatar) {
      throw new Apierr(400, "Avatar file is required")
   };

   const user = await User.create({
      fullname,
      avatar: avatar.url,
      coverImage: cover?.url || "",// here extract url from const coverImage after upload Cloudinary’s API responds with an object
      email,
      password,
      username: username.toLowerCase()

   });

   const createdUser = await User.findById(user._id).select(//The select() method tells MongoDB which fields to include/(-)exclude.
      "_-password" - "refereshToken:"//User.findById(user._id).Looks up a user in MongoDB by their _id.finds the user who just registered.
   );

   if (!createdUser) { // this error from my side means server side thats why we throw menualy 
      throw new Apierr(500, "Something went wrong while regestring user")
   };

   return res.status(200).json(
      new Apireasponse(200, createdUser, "user register successfully")
   );


});
const userLogin = asyncHandler(async (req, res) => {
   //req.body se data lelo
   //user ko email or username se and password se login karao 
   // And check user are registerd or not
   // if yes login successfully else user not registerd
   //check password
   //access and refresh token
   // send coockie
   // console.log("inside userlogin controller")
   const { email, username, password } = req.body;
   console.log("email", email, username, password)
   if (!email || !username) {
      throw new Apierr(440, "username or email are required")
   };
   const user = await User.findOne({
      $or: [{ email }, { username }]
   });
   if (!user) {
      throw new Apierr(404, "user not reagiterd")
   };

   const isPasswordValid = await user.commparePassword(password)
   if (!isPasswordValid) {
      throw new Apierr(401, "wrongPassword")
   };
   const { accessToken, refereshToken } = await generetAccessAndrefereshToken(user._id);// here we are calling the function to generate access and referesh token and passing user._id as an argument to it.
   const LogedInUser = await User.findById(user._id).select("-password -refereshToken")// here we are finding the user by their _id and selecting all fields except password and refereshToken to return in the response.
   const option = {
      httpOnly: true,// This means the cookie cannot be accessed via JavaScript, which helps prevent cross-site scripting (XSS) attacks.
      secure: true
   };
   return res// Finally, we return a response to the client with a status code of 200 (OK). We also set two cookies: one for the refresh token and one for the access token. Both cookies are set with the options defined in the option object (httpOnly and secure). The response body contains a JSON object created using the Apireasponse class, which includes the logged-in user's information (excluding password and refresh token), the access token, and the refresh token, along with a success message.
      .status(200)
      .cookie("refereshToken", refereshToken, option)
      .cookie("accessToken", accessToken, option)
      .json(
         new Apireasponse(// yaha pr ham apireasponse class ka use kr rhe hai jisme 4 parameter pass kr rhe hai status code, user data, message jise hamm user ko bhej rahe hai
            200,
            {
               user: LogedInUser,
               accessToken,
               refereshToken
            },
            "user login successfully"
         )
      )
});

//User logout method 

const userLogout = asyncHandler(async (req, res) => {
   // get user from req.user
   // remove referesh token from db
   // remove cookie
   // send response
   const userId = await User.findByIdAndUpdate(
      req.user._id,
      {
         $set: {
            refereshToken: undefined// here we are using the $set operator to update the refereshToken field of the user document in the database to undefined, effectively removing the refresh token from the user's record. This is done as part of the logout process to ensure that the refresh token can no longer be used to obtain new access tokens after the user has logged out.
         }
      },
      {
         new: true
      }
   )
   const option = {
      httpOnly: true,
      secure: true
   };
   res.clearCookie("refereshToken", option)
   res.clearCookie("accessToken", option)
   return res.status(200).json(
      new Apireasponse(200, null, "user logout successfully")
   )
})
// login user ko access token expire hone pr referesh token se new access token generate karna hota hai taki user ko baar baar login na karna pade. Iske liye ham ek refereshToken method banayenge jo client se referesh token lega, usko verify karega, aur agar valid hua to naya access token aur referesh token generate karke client ko bhej dega.
   const refereshToken= asyncHandler(async(req,res)=>{
   // get referesh token from cookie
   // if not token send error
   // verify token
   // if token is valid then generate new access and referesh token
   // update referesh token in db
   // send response with new access and referesh token
   const incomingRefereshToken = req.cookies.refereshToken|| req.cookies.refereshToken;
   if (!incomingRefereshToken) {
      throw new Apierr(401, "you are not authenticated")
   };
   try {
      const decodeToken= jwt.verify(incomingRefereshToken, process.env.REFERESH_TOKEN_SECERET,)
       const user = await User.findById(decodedToken?._id)
       if (!user || user.refereshToken !== incomingRefereshToken) {
         throw new Apierr(401, "you are not authenticated")
       }
       const { accessToken,refereshToken}= await generetAccessAndrefereshToken(user._id)
       const option = {
         httpOnly: true,
         secure: true
      };
      res.cookie("refereshToken", refereshToken, option)
      res.cookie("accessToken", accessToken, option)
      return res.status(200).json(
         new Apireasponse(200, { accessToken, refereshToken }, "token refreshed successfully")
      )
   } catch (error) {
      throw new Apierr(401, error.message || "you are not authenticated")
   }
})
export {
   registerUser,
   userLogin,
   userLogout,
   refereshToken
}
console.log("Controller file loaded, registerUser is:", registerUser)
