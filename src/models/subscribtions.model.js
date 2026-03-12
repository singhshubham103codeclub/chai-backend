import mongoose,{Schema} from "mongoose";
const subscribtionsSchema = new Schema({
    subscribtion:{
        type:mongoose.Types.ObjectId,
        ref:"users",
        required:true
    },
    channelId:{
        type:mongoose.Types.ObjectId,
        ref:"users",
        required:true
    }
},{timestamps:true})

export default mongoose.model("subscribtions",subscribtionsSchema)  