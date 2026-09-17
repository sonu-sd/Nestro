import dotenv from "dotenv";

dotenv.config();

const baseRequiredVariables = ["MONGO_URI", "JWT_SECRET"];
const productionRequiredVariables = [
    "CORS_ORIGIN",
    "CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_SECRET_KEY",
    "EMAIL_USER",
    "EMAIL_PASS",
    "RAZORPAY_KEY_ID",
    "RAZORPAY_KEY_SECRET",
];

export const validateEnvironment = (environment = process.env) => {
    const requiredVariables = environment.NODE_ENV === "production"
        ? [...baseRequiredVariables, ...productionRequiredVariables]
        : baseRequiredVariables;
    const missing = requiredVariables.filter((name) => !environment[name]);
    if (missing.length) throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
};

export const isDatabaseReady = (mongoose) => mongoose.connection.readyState === 1;
