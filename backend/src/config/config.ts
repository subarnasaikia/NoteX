import dotenv from "dotenv";

dotenv.config();

interface Config {
    PORT: number;
    CORS_ORIGIN: string;
    MONGODB_URI: string;

    // jwt secret
    ACCESS_TOKEN_SECRET: string;
    ACCESS_TOKEN_EXPIRY: string;
    REFRESH_TOKEN_SECRET: string;
    REFRESH_TOKEN_EXPIRY: string;

    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEy: string;
    CLOUDINARY_API_SECRET: string;
}

const config: Config = {
    PORT: Number(process.env.PORT) || 3000,
    CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
    MONGODB_URI: process.env.MONGODB_URI || "noteX-mongodb-uri",
    ACCESS_TOKEN_SECRET:
        process.env.ACCESS_TOKEN_SECRET || "noteX-access-token-secret",
    ACCESS_TOKEN_EXPIRY:
        process.env.ACCESS_TOKEN_EXPIRY || "noteX-access-token-secret",
    REFRESH_TOKEN_SECRET:
        process.env.REFRESH_TOKEN_SECRET || "noteX-access-token-secret",
    REFRESH_TOKEN_EXPIRY:
        process.env.REFRESH_TOKEN_EXPIRY || "noteX-access-token-secret",

    CLOUDINARY_CLOUD_NAME:
        process.env.CLOUDINARY_CLOUD_NAME || "NoteX-cloudinary",
    CLOUDINARY_API_KEy: process.env.CLOUDINARY_API_KEY || "NoteX",
    CLOUDINARY_API_SECRET:
        process.env.CLOUDINARY_API_SECRET || "noteX-cloudinary-api-secret",
};

export default config;
