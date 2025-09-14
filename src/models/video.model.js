import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";// pagination for aggregate queries

const videoSchema = new Schema(
  {
    videoFile: {
      type: String, // URL of the video from cloudinary
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnail: {
      type: String, // URL of the image from cloudinary
      required: true,
    },
    duration: {
      type: Number, // in seconds
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true } // adds createdAt, updatedAt
);

export default mongoose.model("Video", videoSchema);
// module.exports = mongoose.model("Video", videoSchema);
Schema.plugin(mongooseAggregatePaginate); 