import { loadConfig } from "./config/loadConfig";
import { app } from "./app";
import { AppConfig } from "./config/type";

const config: AppConfig = loadConfig();

app.listen(config.server.port, () => {
    console.log(`Server running on port : ${config.server.port}`);
});
