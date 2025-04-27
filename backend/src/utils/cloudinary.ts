import { loadConfig } from "../config/loadConfig.js";
import { AppConfig } from "../config/type.js";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import fs from "fs";

const envConfig: AppConfig = loadConfig();

cloudinary.config({
    cloud_name: envConfig.cloudinary.cloudinary_cloud_name,
    api_key: envConfig.cloudinary.cloudinary_api_key,
    api_secret: envConfig.cloudinary.cloudinary_api_secret,
});

const uploadOnCloudinary = async (
    localTempFilePath: string,
): Promise<UploadApiResponse | null> => {
    try {
        if (!localTempFilePath || localTempFilePath.length === 0) return null;

        const response: UploadApiResponse = await cloudinary.uploader.upload(
            localTempFilePath,
            {
                resource_type: "auto",
            },
        );
        fs.unlinkSync(localTempFilePath);
        return response;
    } catch (error) {
        fs.unlinkSync(localTempFilePath);
        console.error(
            "Something went wrong while uploading on cloudinary: ",
            error,
        );
        return null;
    }
};

export { uploadOnCloudinary };
