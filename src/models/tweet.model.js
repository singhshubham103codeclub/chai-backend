import mongoose, { Schema } from "mongoose";
const TweetSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    owner:{
        type: Schema.Types.ObjectId, 
        ref: "User",
        required: true,
    },
    })