import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { loadConfig } from "../config/loadConfig";

export const errorHandler = (
    err: ApiError | Error,
    req: Request,
    res: Response,
    _next: NextFunction,
): void => {
    if (err instanceof ApiError) {
        res.status(err.statusCode).json({
            success: err.success,
            message: err.message,
            errors: err.errors,
            stack:
                loadConfig().server.node_env === "development"
                    ? err.stack
                    : undefined,
        });
    } else {
        res.status(500).json({
            success: false,
            message: err.message || "Internal Server Error",
            errors: [],
            stack:
                loadConfig().server.node_env === "development"
                    ? err.stack
                    : undefined,
        });
    }
};
