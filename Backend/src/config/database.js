import mongoose from "mongoose";
import { config } from "./config.js";

const connectToDB = async () => {
  try {
    const conn = await mongoose.connect(config.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.log("Database connection error:", err.message);
    throw new Error("DATABASE_CONNECTION_FAILED");
  }
};

export default connectToDB;
