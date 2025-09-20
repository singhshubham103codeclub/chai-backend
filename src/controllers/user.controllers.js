import asyncHandler from  "../utils/asyncHandler.js"


const registerUser=asyncHandler(async(req,res)=>{
   //get user details from frontend
   //validation- not empaty
   //check user if user already exits: username and email
   //check for image ,chech avatar
   //upload them cloudinary ,avatar
   // create user object-create entry in db
   // remove password and referesh tocken field from response
   // return response
   res.status(200).json({
      message:"ok"
   })
})
export {registerUser}
console.log("Controller file loaded, registerUser is:", registerUser)
