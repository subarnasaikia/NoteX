import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { loadConfig } from "./config/loadConfig";
import { AppConfig } from "./config/type";

const app = express();
const config: AppConfig = loadConfig();

// Initialize the middlewares

app.use(
    cors({
        origin: config.server.cors_origin,
        credentials: true,
    }),
);
app.use(
    express.json({
        limit: "16kb",
    }),
);
app.use(
    express.urlencoded({
        extended: true,
        limit: "16kb",
    }),
);
app.use(express.static("public"));
app.use(cookieParser());

// Route imoprting and declaring.

// Global errorHandler always be at the end of the file.
app.use(errorHandler);
export { app };
