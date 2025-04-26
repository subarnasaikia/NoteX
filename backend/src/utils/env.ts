export type Environment = {
    PORT: number;
    NODE_ENV: string;
    CORS_ORIGIN: string;
    MONGODB_URI: string;
    ACCESS_TOKEN_SECRET: string;
    ACCESS_TOKEN_EXPIRY: string;
    REFRESH_TOKEN_SECRET: string;
    REFRESH_TOKEN_EXPIRY: string;
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
    EXAMPLE_TYPE: boolean;
};

export const getEnv = <K extends keyof Environment>(
    key: K,
    fallback?: Environment[K],
): Environment[K] => {
    const value = process.env[key] as Environment[K] | undefined;
    if (value === undefined) {
        if (fallback === false || fallback === "" || fallback === 0) {
            return fallback;
        }
        if (fallback) {
            return fallback;
        }
        throw new Error(`Missing evvironment variable: ${key}.`);
    }
    return value;
};
