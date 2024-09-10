import mongoose from "mongoose";
import { ENV_VARS } from "./envVars.js";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(ENV_VARS.MONGO_URI);
    console.log("🚀MongoDB Connected", conn.connection.host);
  } catch (error) {
    console.log("🚀error=", error.message);
    process.exit(1); // 0=success, 1=error
  }
};
