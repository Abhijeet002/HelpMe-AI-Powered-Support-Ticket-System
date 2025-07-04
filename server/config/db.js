import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();    

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        console.log("Please check your MongoDB URI and ensure the database is running.");
        console.error(error.stack);
        // Exit the process with failure
        process.exit(1);
    }
}
export { connectDB };