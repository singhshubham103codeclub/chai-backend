import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";// pagination for aggregate queries
import mongoose, { Schema } from "mongoose";
const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video"
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true
  }
);
commentSchema.plugin(mongooseAggregatePaginate);
export default mongoose.model("Comment", commentSchema);