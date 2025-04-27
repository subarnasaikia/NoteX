import { loadConfig } from "./config/loadConfig.js";
import { AppConfig } from "./config/type.js";
import { app } from "./app.js";
import { connectDB } from "./db/connect.db.js";

const config: AppConfig = loadConfig();

connectDB()
    .then(() => {
        app.on("error", (error: unknown) => {
            console.error("server error: ", error);
            process.exit(1);
        });
        app.listen(config.server.port, () => {
            console.log(`Server is running on port ${config.server.port}`);
        });
    })
    .catch((error) => {
        console.log("Error connecting to the database", error);
        process.exit(1);
    });
