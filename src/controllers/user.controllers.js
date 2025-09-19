import {asyncHandler} from  "../utils/asyncHandler.js"


const registerUser=asyncHandler(async(req,rep)=>{
   //get user details from frontend
   //validation- not empaty
   //check user if user already exits: username and email
   //check for image ,chech avatar
   //upload them cloudinary ,avatar
   // create user object-create entry in db
   // remove password and referesh tocken field from response
   // return response
})
export {registerUser}