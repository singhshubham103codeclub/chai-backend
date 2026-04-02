import mongoose, { Schema } from "mongoose";
const PlylistSchema = new Schema(
  {
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
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    videos:[
        {
            type: Schema.Types.ObjectId,
            ref:"Video"
        }
    ]
  },
  {
    timestamps: true
  }
);
export default mongoose.model("Playlist", PlylistSchema);