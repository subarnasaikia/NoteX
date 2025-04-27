import { loadConfig } from "./config/loadConfig.js";
import { app } from "./app.js";
import { AppConfig } from "./config/type.js";

const config: AppConfig = loadConfig();

app.listen(config.server.port, () => {
    console.log(`Server running on port : ${config.server.port}`);
});
