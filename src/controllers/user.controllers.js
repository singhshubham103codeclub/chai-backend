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
//// register function is responsible for handling the user registration process. It takes the user details from the request body, validates them, checks if a user with the same username or email already exists, uploads the avatar and cover image to Cloudinary, creates a new user in the database, and returns a response with the created user's information (excluding password and refresh token) along with a success message.
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

// Yaha pr ham change password, get current user, update account details, update avatar, update cover image, get user profile, get watch history ke controllers define karenge. Ye controllers user ke related functionalities ko handle karenge jaise ki password change karna, current user ki details fetch karna, account details update karna, avatar aur cover image update karna, user profile fetch karna, aur watch history fetch karna.

   const ChangePassword = asyncHandler(async(req,res)=>{
      // get user from req.user
      // get old password and new password from req.body
      // check old password is correct or not
      // if not correct send error
      // if correct update new password in db
      // send response
      const user = await User.findById(req.user?._id)
      const { oldPassword, newPassword } = req.body
      const isPasswordcorrect = await user.commparePassword(oldPassword)
      if(!isppasswordcorrect){
         throw new Apierr(404,"old password is incorrect")}
         user.password = newPassword
         await user.save({ validateBeforeSave: false }) 
         return res.status(200).json(
            new Apireasponse(200, null, "password changed successfully")
         )
      })
      const CurrenrtUser = asyncHandler(async(req,res)=>{
         // get user from req.user
         // send response with user data
         const user = await User.findById(req.user?._id).select("-password -refereshToken")
         if(!user){
            throw new Apierr(404,"user not found")
         }
         return res.status(200).json(
            new Apireasponse(200, user, "current user fetched successfully")
         )
      })
      const updateAccountdetails = asyncHandler(async(req,res)=>{
         // get user from req.user
         // get update data from req.body and req.files
         // if files upload them on cloudinary and get url
         // update user details in db
         // send response with updated user data
         const {email, fullname } = req.body
         if(!!email || !fullname){
            throw new Apierr(400,"all fields are required")
         }
         const user = await User.findByIdAndUpdate(req.user?._id,
            {
               $set:{
                  email,
                  fullname
               }
            },
           {new:true}// this option ensures that the updated user document is returned after the update operation is completed. Without this option, the method would return the original document before the update was applied.
         ).select("-password")
         return res.status(200).json(
            new Apireasponse(200, user, "account details updated successfully")
         )
      }) 
      // Here we are defining a function called updateAccountdetails that is wrapped with asyncHandler to handle asynchronous operations and errors. This function is responsible for updating the account details of the currently authenticated user. It retrieves the user's email and fullname from the request body, checks if they are provided, and then updates the user's details in the database using findByIdAndUpdate. Finally, it returns a response with the updated user data.
      const UpdateAvatar = asyncHandler(async(req,res)=>{
      const AvatarLocalPath = req.file?.path;
      if(!AvatarLocalPath){
            throw new Apierr(400,"avatar file is missing")
      }
      const avatar= await Uploadcloudinary(AvatarLocalPath)
      if(!avatar){
         throw new Apierr(500,"something went wrong while uploading avatar")
      }
      //TODO: delete previous avatar from cloudinary
      const user= await User.findById(req.user?._id)
      if(!user?.avatar){
         const PublicId = user.avatar.split("/").pop().split(".")[0]// here we are extracting the public ID of the previous avatar from the user's avatar URL. The split("/") method is used to split the URL into an array of segments, and then we take the last segment (the filename) using pop(). Finally, we split the filename by "." to separate the name from the extension and take the first part (the name) as the public ID.
         await DeleteFromCloudinary(PublicId)
      }
      await User.findByIdAndUpdate(req.user?._id,
         {
            $set:{
               avatar:avatar.url
            }
         },
         {new:true}
      ).select("-password")   
      return res.status(200).json(
         new Apireasponse(200, avatar.url, "avatar updated successfully")
      )
   })
   // The UpdateAvatar function is an asynchronous function that handles the process of updating a user's avatar. It first checks if the avatar file is present in the request, and if not, it throws an error. If the file is present, it uploads the avatar to Cloudinary using the Uploadcloudinary utility function. If the upload is successful, it updates the user's avatar URL in the database using findByIdAndUpdate and returns a response with the new avatar URL. If any step fails, it throws an appropriate error message.
   const UpdateUserCoverImage = asyncHandler(async(req,res)=>{
      const CoverImageLocalPath = req.file?.path;
      if(!CoverImageLocalPath){
            throw new Apierr(400,"cover image file is missing")
      }
      const coverImage= await Uploadcloudinary(CoverImageLocalPath)
      if(!coverImage){
         throw new Apierr(500,"something went wrong while uploading cover image")
      }
      //TODO: delete previous cover image from cloudinary
      const user= await User.findById(req.user?._id)
      if(!user?.coverImage){
         const PublicId = user.coverImage.split("/").pop().split(".")[0]// here we are extracting the public ID of the previous cover image from the user's cover image URL. The split("/") method is used to split the URL into an array of segments, and then we take the last segment (the filename) using pop(). Finally, we split the filename by "." to separate the name from the extension and take the first part (the name) as the public ID.
         await DeleteFromCloudinary(PublicId)// here we are calling the DeleteFromCloudinary function and passing the extracted public ID to delete the previous cover image from Cloudinary before updating it with the new one.
      }
      await User.findByIdAndUpdate(req.user?._id,
         {
            $set:{
               coverImage:coverImage.url
            }
         },
         {new:true}
      ).select("-password")   
      return res.status(200).json(
         new Apireasponse(200, coverImage.url, "cover image updated successfully")
      )
   })
   const getUserProfile=asyncHandler(async(req,res)=>{
      const {Username}=req.params
      if(!Username){
         throw new Apierr(400,"user is missing")
      }
      //ye function user profile ko fetch karne ke liye hai. Yaha pr ham aggregate pipeline ka use kar rhe hai jisme ham pehle user ko match kar rhe hai username se, fir uske subscribers aur subscribed channels ko lookup stage ke through join kar rhe hai, fir $addFields stage me ham subscription counts aur issubscribed field ko add kar rhe hai, aur finally $project stage me ham required fields ko select kar rhe hai jise ham response me bhejna chahte hai.
      const channel=await User.aggregate([{
         // match kya karta hai ki database me se user ko find karta hai jiska username req.params se match karta hai. Yaha pr ham username ko lowercase me convert kar rhe hai taki case sensitivity ka issue na aaye. Agar aisa user milta hai jiska username req.params se match karta hai to usko aage ke pipeline me bhejta hai, warna usko ignore kar deta hai.
         $match:{
            username:Username?.toLowerCase()
         }
         
      },
      // lookup stage ka use karke ham subscribtions collection se data ko join kar rhe hai. Yaha pr ham from me subscribtions collection ka naam de rhe hai, localField me _id de rhe hai jo ki users collection ka field hai, foreignField me channel de rhe hai jo ki subscribtions collection ka field hai, aur as me subscribers de rhe hai jisme join hone ke baad subscribers ka data store hoga.
      {
         $lookup:{
            from:"subscribtions",
            localField:"_id",
            foreignField:"channel",
            as:"subscribers"
         }
      },
      {
         $lookup:{
            from:"subscribtions",
            localField:"_id",
            foreignField:"subscribtion",
            as:"subscribedChannels"
         }
      },
      {
         // Adding fields to include subscription counts
         $addFields:{
            Subscribscount:{
               $size:"$subscribers"
            },
            //$size ka use karke ham subscribers array ke size ko count kar rhe hai aur usko Subscribscount field me store kar rhe hai. Isse hame pata chalega ki us user ke kitne subscribers hai.
            channelsuubscribed:{
               $size:"$subscribedChannels" 
            },
            Issubscribed:{
               $cond:{
                  if:{$in:[req.user?._id,"subscribers.subscribtion"]},
                  then: true,
                  else:false
               }
            }
         }
      },
      {
         $project:{
            username:1,
            fullname:1,
            subscribers:1,
            subscribedChannels:1,
            avatar:1,
            coverImage:1,
            Issubscribed:1,
            email:1
         }
      }
   ])

   if(!channel?.length){
      throw new Apierr(404,"channel not found")
   }return res.status(200).json(
      new Apireasponse(200, channel[0], "channel details fetched successfully")
   )

   })
    // yaha pr hamne $project stage ka use karke unhi fields ko select kiya hai jise ham response me bhejna chahte hai. Yaha pr ham username, fullname, subscribers, subscribedChannels, avatar, coverImage, Issubscribed, aur email fields ko select kar rhe hai. Isse hame user profile ke liye required information mil jayegi jo ham client ko bhejna chahte hai.

   const getWatchistory= asyncHandler(async(req,res)=>{
      const user =await User.aggregate([
         {
            // Match the user by their ID
            $match:{
               _id:new mongoose.Types.ObjectId(req.user?._id)//yaha par ham $match stage ka use karke user ko unke _id se match kar rhe hai. Yaha pr ham new mongoose.Types.ObjectId(req.user?._id) ka use karke req.user._id ko ObjectId me convert kar rhe hai taki wo MongoDB ke _id field ke format me match ho sake. Agar aisa user milta hai jiska _id req.user._id se match karta hai to usko aage ke pipeline me bhejta hai, warna usko ignore kar deta hai.
            }
         },
         // Lookup stage to join the videos collection based on the watchHistory field
         {
            $lookup:{
               from:"videos",
               localField:"watchHistory",
               foreignField:"_id",
               as:"watchHistory",
               // yaha par ham $lookup stage ka use karke videos collection se data ko join kar rhe hai. Yaha pr ham from me videos collection ka naam de rhe hai, localField me watchHistory de rhe hai jo ki users collection ka field hai, foreignField me _id de rhe hai jo ki videos collection ka field hai, aur as me watchHistory de rhe hai jisme join hone ke baad watch history ke videos ka data store hoga.
               // Iske alawa ham pipeline ka use karke videos collection ke andar bhi ek aur lookup stage define kar rhe hai jisme ham video ke owner ka data users collection se join kar rhe hai taki hame watch history me videos ke sath unke owner ke details bhi mil jaye.
               pipeline:[
                  {
                     $lookup:{
                        from:"users",
                        localField:"owner",
                        foreignField:"_id",
                        as:"ownerDetails",
                        pipeline:[
                           {
                              $project:{
                                 username:1,
                                 fullname:1,
                                 avatar:1
                              }
                           }
                        ]
                     }
                  }
               ]
            }
         },
         // Adding a field to include owner details in the watch history videos
         {
            $addFields:{
               owner:{
                  $first:"$ownerDetails"
               }
            }
         }
      ])
      return res.status(200).json(
         new Apireasponse(200, user[0]?.watchHistory || [], "watch history fetched successfully")
      )
   })
export {
   registerUser,
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
}
console.log("Controller file loaded, registerUser is:", registerUser)
