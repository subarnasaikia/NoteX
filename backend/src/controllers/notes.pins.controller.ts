import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Request, Response } from "express";
import PinModel, { IPin } from "../models/notes.pins.model.js";
import { MAX_PIN_LIMIT } from "../constants.js";

// MAX pin limit : 3
// create new pin
const createPin = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (!req.user) {
            throw new ApiError(401, "User not authenticated!");
        }
        // TODO(subarna): checking if user's email is verified

        const { type, pinItemId }: { type: string; pinItemId: string } =
            req.body;

        if (!type) {
            throw new ApiError(400, "Type is required!");
        }

        if (!["Folder", "Content", "Image"].includes(type)) {
            throw new ApiError(400, "Invalid type!");
        }

        if (!pinItemId) {
            throw new ApiError(400, "Pin item ID is required!");
        }

        const existingPins = await PinModel.countDocuments({
            userId: req.user._id,
        });

        if (existingPins >= MAX_PIN_LIMIT) {
            throw new ApiError(
                400,
                `You can only pin up to ${MAX_PIN_LIMIT} items!`,
            );
        }

        const newPin: IPin = await PinModel.create({
            type,
            pinItemId,
            userId: req.user._id,
        });

        res.status(201).json(
            new ApiResponse(200, newPin, "Pin created successfully!"),
        );
    },
);

// delete pin
const deletePin = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (!req.user) {
            throw new ApiError(401, "User not authenticated!");
        }
        // TODO(subarna): checking if user's email is verified

        const { pinId }: { pinId: string } = req.body;

        if (!pinId) {
            throw new ApiError(400, "Pin ID is required!");
        }

        const deletedPin: IPin | null = await PinModel.findOneAndDelete({
            _id: pinId,
            userId: req.user._id,
        });

        if (!deletedPin) {
            throw new ApiError(404, "Pin not found!");
        }

        res.status(200).json(
            new ApiResponse(200, deletedPin, "Pin deleted successfully!"),
        );
    },
);

export { createPin, deletePin };
