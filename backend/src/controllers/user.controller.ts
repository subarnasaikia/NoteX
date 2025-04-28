import { loadConfig } from "../config/loadConfig.js";
import { AppConfig } from "../config/type.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import User, { IUser } from "../models/users.model.js";
import jwt from "jsonwebtoken";
import mongoose, { ObjectId } from "mongoose";

const generateAccessAndRefreshTokens = async (
    userId: ObjectId | string,
): Promise<{ accessToken: string; refreshToken: string }> => {
    try {
        const user: IUser | null = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        const accessToken = user?.generateAccessToken();
        const refreshToken = user?.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error: unknown) {
        throw new ApiError(
            500,
            "Couldn't generate Access And Refresh Tokens as something went wrong!!! ",
        );
    }
};
