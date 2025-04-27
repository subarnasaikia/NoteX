import { StringValue } from "ms";

export type AppConfig = {
    server: {
        port: number;
        node_env: string;
        cors_origin: string;
    };
    database: {
        mongodb_uri: string;
    };
    jwt: {
        access_token_secret: string;
        access_token_expiry: StringValue;
        refresh_token_secret: string;
        refresh_token_expiry: StringValue;
    };
    cloudinary: {
        cloudinary_cloud_name: string;
        cloudinary_api_key: string;
        cloudinary_api_secret: string;
    };
};
