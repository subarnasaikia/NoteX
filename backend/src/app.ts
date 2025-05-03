import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import { loadConfig } from "./config/loadConfig.js";
import { AppConfig } from "./config/type.js";

const app: Application = express();
const envConfig: AppConfig = loadConfig();

// Initialize the middlewares

app.use(
    cors({
        origin: envConfig.server.cors_origin,
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
import userRouter from "./routes/user.route.js";
import notesFolderRouter from "./routes/notes.folders.route.js";
import notesContentRouter from "./routes/notes.contents.route.js";
import notespinRouter from "./routes/notes.pins.route.js";
import notesImageRouter from "./routes/notes.images.route.js";

// routes declariation
app.use("/api/v1/user", userRouter);
app.use("/api/v1/notes/folders", notesFolderRouter);
app.use("/api/v1/notes/contents", notesContentRouter);
app.use("/api/v1/notes/pins", notespinRouter);
app.use("/api/v1/notes/images", notesImageRouter);

// Global errorHandler always be at the end of the file.
app.use(errorHandler);
export { app };
