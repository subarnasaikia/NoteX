export type AppConfig = {
    server: {
        port: number;
        cors_origin: string;
    };
    database: {
        mongodb_uri: string;
    };
    jwt: {
        access_token_secret: string;
        access_token_expiry: string;
        refresh_token_secret: string;
        refresh_token_expiry: string;
    };
    cloudinary: {
        cloudinary_cloud_name: string;
        cloudinary_api_key: string;
        cloudinary_api_secret: string;
    };
};
