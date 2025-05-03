import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Request, Response } from "express";
import ImageModel, { IImage } from "../models/notes.images.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// create new image using multer and cloudinary
const createImage = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (!req.user) {
            throw new ApiError(401, "User not authenticated!");
        }

        // TODO(subarna): checking if user's email is verified
        const { parentFolderId } = req.body;
        const filePath = req.file?.path;

        if (!filePath) {
            throw new ApiError(400, "File is required!");
        }

        const fileUploadPaths = await uploadOnCloudinary(filePath);
        if (!fileUploadPaths) {
            throw new ApiError(500, "Failed to upload image to cloudinary!");
        }

        const image: IImage = await ImageModel.create({
            userId: req.user._id,
            imageUrl: fileUploadPaths?.url,
            parentFolderId,
            imageName: filePath.split("/").pop() || "",
        });

        res.status(201).json(
            new ApiResponse(200, image, "Image created successfully!"),
        );
    },
);

// delete image from cloudinary and database
const deleteImage = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (!req.user) {
            throw new ApiError(401, "User not authenticated!");
        }

        const { imageId } = req.params;

        if (!imageId) {
            throw new ApiError(400, "Image ID is required!");
        }

        const image: IImage | null = await ImageModel.findById(imageId);

        if (!image) {
            throw new ApiError(404, "Image not found!");
        }

        // TODO(subarna): delete image from cloudinary

        await image.deleteOne();

        res.status(200).json(
            new ApiResponse(200, {}, "Image deleted successfully!"),
        );
    },
);

export { createImage, deleteImage };
