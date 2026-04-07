import asyncHandler from "../utils/asyncHandler";
import Comment from "../models/comment.model.js";
import Apierr from "../utils/Apierror.js";
import { Apireasponse } from "../utils/Apireasponse.js";
import mongoose from "mongoose";
import Video from "../models/video.model.js";
import videoModel from "../models/video.model.js";
const createomment=asyncHandler(async(req,res)=>{
    const {Comment,VideoId}=req.body
    const userId= req.user._Id
    if(!userId){
        throw new Apierr(401,"Unauthorized")
    }
    if(!Comment||Comment.trim()===""){
        throw new Apierr(400,"Comment is required")
    }
    if(!VideoId){
        throw new Apierr(400,"videoId is required")
    }
    if(!mongoose.type.ObjectId.isValid(VideoId)){
        throw new Apierr(400,"video Id is invalid")
    }
    const IsvideoExists=await Video.exists({_Id:VideoId})
    if(!IsvideoExists){
        return res.status(404).json(new Apireasponse(404,"Video not found"))   
    }
    const comment=await Comment.create({
        content:Comment.trim(),
        Video:VideoId,
        owner:userId
    })
    const populatedcomment=await Comment.findById(comment._Id).populate("owner","Avatar").lean()
    return res.status(200).json(new Apireasponse(200,"Comment created successfully",populatedcomment))
})
const getComments=asyncHandler(async(req,res)=>{
    const {VideoId}=req.params
    if(!VideoId){
        throw new Apierr(400,"videoId is required")
    }
    if(!mongoose.type.ObjectId.isValid(VideoId)){
        throw new Apierr(400,"video Id is invalid")
    }
    const IsvideoExists=await Video.exists({_Id:VideoId})
    if(!IsvideoExists){
        return res.status(404).json(new Apireasponse(404,"Video not found"))   
    }
    const comments=await Comment.find({Video:VideoId}).populate("owner","Avatar").lean()
    return res.status(200).json(new Apireasponse(200,"Comments retrieved successfully",comments))
})
export {createomment,
    getComments};
