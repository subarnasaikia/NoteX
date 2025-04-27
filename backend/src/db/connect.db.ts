import mongoose, { ConnectOptions, Mongoose } from "mongoose";
import { DB_NAME } from "../constants.js";
import { loadConfig } from "../config/loadConfig.js";
import { AppConfig } from "../config/type.js";
import { ApiError } from "../utils/ApiError.js";

const envConfig: AppConfig = loadConfig();

const connectDB = async (): Promise<void> => {
    try {
        const connectionInstance: Mongoose = await mongoose.connect(
            `${envConfig.database.mongodb_uri}/${DB_NAME}`,
            {} as ConnectOptions,
        );

        console.log(
            `MongoDB connected host: ${connectionInstance.connection.host}`,
        );
        console.log(
            `MongoDB connected name: ${connectionInstance.connection.name}`,
        );
    } catch (error: unknown) {
        if (error instanceof Error || error instanceof ApiError) {
            console.error(`MongoDB connection failed: ${error.message}`);
            throw new ApiError(
                500,
                `MongoDB connection failed: ${error.message}`,
            );
        } else {
            console.error("MongoDB connection failed: Unknown error", error);
            throw new ApiError(500, "MongoDB connection failed: Unknown error");
        }
    }
};

export { connectDB };
