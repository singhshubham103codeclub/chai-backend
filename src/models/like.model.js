import mongoose, { Schema } from "mongoose";
const likeSchema = new Schema(
  {
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
    isLike: {
      type: Boolean, // true for like, false for dislike
      required: true,
    },
    tweetby:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    comment:{
        type: Schema.Types.ObjectId,
        ref: "Comment",
    }
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Like", likeSchema);