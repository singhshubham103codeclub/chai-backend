import mongoose,{Schema} from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,

    },
    fullname:{
        type: String,
        required: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        required: true,
    },
    timestamps: true,// createdAt, updatedAt
    avtar: {
        type: String,// URL of the image from cloudinary
        required:true,
    },
    coverImage: {
        type: String,// URL of the image from cloudinary
        required:false,// not required
    },
    refereshToken: {
        type: String,
    },
    watschHistory:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Video'
        }
    ]
}
)
// Hash the password before saving the user model
userSchema.pre('save',async function (next){// arrow function not used to access 'this'
    if(!this.isModified('password'))return next();// only hash if password is modified or new
    // generate a salt
    // hash the password along with our new salt
    // override the cleartext password with the hashed one
    const salt = await bcrypt.genSalt(10);// default is 10
    this.password = await bcrypt.hash(this.password,salt);// hashed password
    next();// proceed to save
})
// Compare the password
userSchema.methods.commparePassword = async function(candidatePassword){// candidatePassword is the password entered by the user during login
    return await bcrypt.compare(candidatePassword,this.password);// true or false
}
const User = mongoose.model('User', userSchema);
export default User;
