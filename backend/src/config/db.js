import mongoose from "mongoose";
import { getAtlasConnectionUri } from "./atlas-connection.js";

const connectDb = async () => {
  try {
    const connectionUri = await getAtlasConnectionUri(process.env.MONGO_URI);
    if (connectionUri !== process.env.MONGO_URI) {
      console.log("Using Windows DNS fallback for Atlas SRV records.");
    }
    await mongoose.connect(connectionUri, { serverSelectionTimeoutMS: 10000 });
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("Database connection error:", error.message);
    throw error;
  }
};

export default connectDb;
