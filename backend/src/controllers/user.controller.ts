import { loadConfig } from "../config/loadConfig.js";
import { AppConfig } from "../config/type.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import User, { IUser } from "../models/users.model.js";
import jwt from "jsonwebtoken";
import mongoose, { ObjectId } from "mongoose";
import { Request, Response } from "express";

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
        console.error("Error generating tokens:", error);
        throw new ApiError(
            500,
            "Couldn't generate Access And Refresh Tokens as something went wrong!!! ",
        );
    }
};

const registerUser = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        // fatching the data from body.
        const {
            username,
            firstName,
            middleName,
            lastName,
            emailAddress,
            password,
            confirmPassword,
        }: {
            username: string;
            firstName: string;
            middleName?: string;
            lastName: string;
            emailAddress: string;
            password: string;
            confirmPassword: string;
        } = req.body;

        // Validating the data
        if (
            [
                username,
                firstName,
                lastName,
                emailAddress,
                password,
                confirmPassword,
            ].some((field) => field?.trim() === "")
        ) {
            throw new ApiError(400, "All fields are required");
        }

        if (password !== confirmPassword) {
            throw new ApiError(
                400,
                "Password and Confirm Password do not match",
            );
        }

        const existedUser: IUser | null = await User.findOne({
            $or: [
                { username: username.toLowerCase() },
                { "email.emailAddress": emailAddress.toLowerCase() },
            ],
        });

        if (existedUser) {
            throw new ApiError(400, "Username or Email Address already exists");
        }

        const user: IUser = await User.create({
            username: username.toLowerCase(),
            name: {
                firstName,
                middleName,
                lastName,
            },
            email: {
                emailAddress: emailAddress.toLowerCase(),
            },
            password,
        });

        const createdUser: IUser | null = await User.findById(user._id).select(
            "-password -refreshToken -__v",
        );

        if (!createdUser) {
            throw new ApiError(500, "Couldn't create user");
        }

        res.status(201).json({
            data: new ApiResponse(
                200,
                createdUser,
                "User created successfully",
            ),
        });
    },
);

export { registerUser };
