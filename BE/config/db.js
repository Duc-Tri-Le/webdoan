import mongoose from "mongoose";

const mongooseURl = "mongodb+srv://triduc2k3:ncYtwkfZXAvYgl8y@cluster0.ce37x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
    try {
        await mongoose.connect(mongooseURl);
        console.log("DB connected");
    } catch (error) {
        console.error("DB connection error:", error);
    }
};

export { connectDB };
