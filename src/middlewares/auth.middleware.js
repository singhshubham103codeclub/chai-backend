import asyncHandler from "../utils/asyncHandler.js";
import Apierr from "../utils/Apierror.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
export const Verify_JWT_Token = asyncHandler(async (req, res, next) => {
    // Yaha hum check kar rahe hain ki access token cookies me hai ya Authorization header me।
    //     👉 Agar token cookies me mil jata hai, to hum wahi use karte hain।
    // 👉 Agar cookies me nahi milta, to hum Authorization header check karte hain।
    // Authorization header ka format generally aisa hota hai
    // Bearer <token>
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            throw new Apierr(401, "Unauthorized")
        };
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECERET) //here we are verifying the token using the jwt.verify method. We pass the token and the secret key (which is stored in the environment variable ACCESS_TOKEN_SECERET) to verify the token and decode its payload.
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")// 
        if (!user) {
            throw new Apierr(401, "Invalid Access Token")
        }
        req.user = user;// If the token is valid and the user is found, we attach the user object to the request (req.user) so that it can be accessed in subsequent middlewareroute handlers. Finally, we call next() to proceed to the next middleware or route handler.
        next()
    } catch (error) {
        throw new Apierr(401, error?.message || "Invalid Access Token")
    }
});

