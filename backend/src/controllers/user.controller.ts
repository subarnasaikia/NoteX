import { loadConfig } from "../config/loadConfig.js";
import { AppConfig } from "../config/type.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import User, { IUser } from "../models/users.model.js";
import { ObjectId } from "mongoose";
import { Request, Response } from "express";
import { OPTIONS } from "../constants.js";
import jwt, { JwtPayload } from "jsonwebtoken";

const envConfig: AppConfig = loadConfig();

const generateAccessAndRefreshTokens = async (
    userId: ObjectId,
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
                { username: username.toLowerCase().trim() },
                { "email.emailAddress": emailAddress.toLowerCase().trim() },
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

const loginUser = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        const {
            username,
            emailAddress,
            password,
        }: {
            username: string;
            emailAddress: string;
            password: string;
        } = req.body;

        // Validating the data
        if (
            (!username && !emailAddress) ||
            (username.trim() === "" && emailAddress.trim() === "")
        ) {
            throw new ApiError(400, "Username or Email Address are required");
        }
        if (!password || password.trim() === "") {
            throw new ApiError(400, "Password is required");
        }

        const user: IUser | null = await User.findOne({
            $or: [
                { username: username?.toLowerCase().trim() },
                { email: { emailAddress: emailAddress?.toLowerCase().trim() } },
            ],
        });

        if (!user) {
            throw new ApiError(401, "Invalid username or email address");
        }

        const isPasswordCorrect: boolean =
            await user.isPasswordCorrect(password);
        if (!isPasswordCorrect) {
            throw new ApiError(401, "Invalid password");
        }

        // Generating access and refresh tokens
        const { accessToken, refreshToken } =
            await generateAccessAndRefreshTokens(user._id);

        const loginUser: IUser | null = await User.findById(user._id).select(
            "-password -refreshToken -__v",
        );

        if (!loginUser) {
            throw new ApiError(500, "Couldn't login user");
        }

        // set cookies options

        res.status(200)
            .cookie("accessToken", accessToken, OPTIONS)
            .cookie("refreshToken", refreshToken, OPTIONS)
            .json({
                data: new ApiResponse(
                    200,
                    {
                        user: loginUser,
                        accessToken,
                        refreshToken,
                    },
                    "User logged in successfully",
                ),
            });
    },
);

const logoutUser = asyncHandler(async (req: Request, res: Response) => {
    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $unset: {
                refreshToken: 1,
            },
        },
        {
            new: true,
        },
    );

    return res
        .status(200)
        .clearCookie("accessToken", OPTIONS)
        .clearCookie("refreshToken", OPTIONS)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        const incomingRefreshToken: string | undefined =
            req.cookies?.refreshToken || req.body?.refreshToken;
        if (!incomingRefreshToken) {
            throw new ApiError(401, "Refresh token is required");
        }

        try {
            const decodedToken: JwtPayload & { _id: ObjectId } = jwt.verify(
                incomingRefreshToken,
                envConfig.jwt.refresh_token_secret,
            ) as JwtPayload & { _id: ObjectId };

            if (!decodedToken._id) {
                throw new ApiError(401, "Invalid refresh token");
            }

            const user: IUser | null = await User.findById(decodedToken._id);

            if (!user) {
                throw new ApiError(401, "Invalid refresh token");
            }

            if (incomingRefreshToken !== user.refreshToken) {
                throw new ApiError(401, "Invalid refresh token");
            }

            const { accessToken, refreshToken } =
                await generateAccessAndRefreshTokens(user._id);

            res.status(200)
                .cookie("accessToken", accessToken, OPTIONS)
                .cookie("refreshToken", refreshToken, OPTIONS)
                .json(
                    new ApiResponse(
                        200,
                        {
                            accessToken,
                            refreshToken,
                        },
                        "Access token refreshed successfully",
                    ),
                );
        } catch (error: any) {
            throw new ApiError(401, error.message || "Invalid refresh token");
        }
    },
);

export { registerUser, loginUser, logoutUser, refreshAccessToken };
