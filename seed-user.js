import dotenv from "dotenv";
import mongoose from "mongoose";
import { DB_NAME } from "./src/constant.js";

dotenv.config();

const connectDB = async () => {
    try {
        const conectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log(`\nDatabase connected successfully! at ${conectionInstance.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
}

connectDB().then(async () => {
    const { default: User } = await import("./src/models/user.model.js");

    const user = await User.findOne({ username: "testuser" });
    if (user) {
        console.log("User already seeded. Resetting email and password.");
        user.email = "test@gmail.com";
        user.password = "123456";
        await user.save({ validateBeforeSave: false });
        console.log("User updated.");
        process.exit(0);
    }

    await User.create({
        username: "testuser",
        email: "test@gmail.com",
        fullname: "Test User",
        password: "123456",
        avatar: "https://example.com/avatar.png",
        coverImage: "https://example.com/cover.png"
    });
    console.log("Seeded user test@gmail.com");
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
