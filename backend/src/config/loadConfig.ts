import dotenv from "dotenv";
import { getEnv } from "../utils/env.js";
import { AppConfig } from "./type.js";

dotenv.config();

export const loadConfig = (): AppConfig => {
    return {
        server: {
            port: Number(getEnv("PORT", 3000)),
            node_env: getEnv("NODE_ENV", "development"),
            cors_origin: getEnv("CORS_ORIGIN"),
        },
        database: {
            mongodb_uri: getEnv("MONGODB_URI"),
        },
        jwt: {
            access_token_secret: getEnv("ACCESS_TOKEN_SECRET"),
            access_token_expiry: getEnv("ACCESS_TOKEN_EXPIRY"),
            refresh_token_secret: getEnv("REFRESH_TOKEN_SECRET"),
            refresh_token_expiry: getEnv("REFRESH_TOKEN_EXPIRY"),
        },
        cloudinary: {
            cloudinary_cloud_name: getEnv("CLOUDINARY_CLOUD_NAME"),
            cloudinary_api_key: getEnv("CLOUDINARY_API_KEY"),
            cloudinary_api_secret: getEnv("CLOUDINARY_API_SECRET"),
        },
    };
};
