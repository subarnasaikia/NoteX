import { loadConfig } from "../config/loadConfig.js";
import { AppConfig } from "../config/type.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import User, { IUser } from "../models/users.model.js";
import { Request, Response, NextFunction } from "express";

declare module "express" {
    interface Request {
        user?: IUser;
    }
}

const envConfig: AppConfig = loadConfig();

export const verfiyJWT = asyncHandler(
    async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
        try {
            const token: string | undefined =
                req.cookies?.accessToken ||
                req.header("Authorization")?.replace("Bearer ", "");

            if (!token) {
                throw new ApiError(401, "Token not found");
            }

            const decondedToken: JwtPayload & { _id?: string } = jwt.verify(
                token,
                envConfig.jwt.access_token_secret,
            ) as JwtPayload & { _id?: string };

            const user: IUser | null = await User.findById(
                decondedToken?._id,
            ).select("-password -refreshToken -__v");

            if (!user) {
                throw new ApiError(401, "Invalid token");
            }

            req.user = user;
            next();
        } catch (error: unknown) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new ApiError(401, "Token expired");
            }
            throw new ApiError(
                401,
                (error as string) || "Invalid access token",
            );
        }
    },
);
