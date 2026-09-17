import dotenv from "dotenv";

dotenv.config();

const requiredVariables = ["MONGO_URI", "JWT_SECRET"];

export const validateEnvironment = () => {
    const missing = requiredVariables.filter((name) => !process.env[name]);
    if (missing.length) throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
};

export const isDatabaseReady = (mongoose) => mongoose.connection.readyState === 1;
