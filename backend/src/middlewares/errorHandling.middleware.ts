import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { loadConfig } from "../config/loadConfig";

export const errorHandler = (
    err: ApiError | Error,
    req: Request,
    res: Response,
    _next: NextFunction,
): void => {
    const statusCode: number =
        (err instanceof ApiError && err.statusCode) || 500;
    const message: string = err.message || "Interenal Serve Error";
    const errors: string[] = (err instanceof ApiError && err.errors) || [];
    const stack: string | undefined =
        loadConfig().server.node_env === "development" ? err.stack : undefined;
    res.status(statusCode).json({
        success: false,
        message,
        errors,
        stack,
    });
};
