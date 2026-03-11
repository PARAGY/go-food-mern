import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoURI = "mongodb+srv://goFood:Parag7382@cluster0.zboswnp.mongodb.net/goFoodmern?retryWrites=true&w=majority&appName=Cluster0";
    await mongoose.connect(mongoURI);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
