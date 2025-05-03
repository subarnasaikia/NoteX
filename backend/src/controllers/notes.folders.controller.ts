import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import FolderModel, { IFolder } from "../models/notes.folders.model.js";
import { Request, Response } from "express";
import mongoose from "mongoose";

// create new folder
const createFolder = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (!req.user) {
            throw new ApiError(401, "User not authenticated!");
        }
        // TODO(subarna): checking if user's email is verified

        const {
            folderName,
            description,
            hex_color,
            parentFolderId,
        }: {
            folderName: string;
            description: string;
            hex_color: string;
            parentFolderId?: string | null;
        } = req.body;

        if (!folderName) {
            throw new ApiError(400, "Folder name is required!");
        }

        const newFolder: IFolder = await FolderModel.create({
            folderName,
            description,
            hex_color,
            userId: req.user?._id,
            parentFolderId,
        });

        res.status(201).json(
            new ApiResponse(200, newFolder, "Folder created successfully!"),
        );
    },
);

// fetch and read folder
const fetchFolders = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (!req.user) {
            throw new ApiError(401, "User not authenticated!");
        }
        // TODO(subarna): checking if user's email is verified

        const folders: IFolder[] = await FolderModel.find({
            userId: req.user?._id,
        });

        res.status(200).json(
            new ApiResponse(200, folders, "Folders fetched successfully!"),
        );
    },
);

// update folder
const updateFolder = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (!req.user) {
            throw new ApiError(401, "User not authenticated!");
        }
        // TODO(subarna): checking if user's email is verified

        const { folderId } = req.params;

        if (!mongoose.isValidObjectId(folderId)) {
            throw new ApiError(400, "Invalid folder ID!");
        }
        const { folderName, description, hex_color } = req.body;

        if (!folderId) {
            throw new ApiError(400, "Folder ID is required!");
        }

        const updatedFolder: IFolder | null =
            await FolderModel.findByIdAndUpdate(
                folderId,
                {
                    folderName,
                    description,
                    hex_color,
                },
                { new: true },
            );

        if (!updatedFolder) {
            throw new ApiError(404, "Folder not found!");
        }

        res.status(200).json(
            new ApiResponse(200, updatedFolder, "Folder updated successfully!"),
        );
    },
);

// Delete folder
const deleteFolder = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (!req.user) {
            throw new ApiError(401, "User not authenticated!");
        }
        // TODO(subarna): checking if user's email is verified

        const { folderId } = req.params;

        if (!mongoose.isValidObjectId(folderId)) {
            throw new ApiError(400, "Invalid folder ID!");
        }

        const deletedFolder: IFolder | null =
            await FolderModel.findByIdAndDelete(folderId);

        if (!deletedFolder) {
            throw new ApiError(404, "Folder not found!");
        }

        res.status(200).json(
            new ApiResponse(200, deletedFolder, "Folder deleted successfully!"),
        );
    },
);

// fetching using pagination for root directory.
const fetchFoldersWithPagination = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (!req.user) {
            throw new ApiError(401, "User not authenticated!");
        }
        // TODO(subarna): checking if user's email is verified

        const { page = "1", limit = "10" } = req.query as {
            page?: string;
            limit?: string;
        };

        const options = {
            page: Number(page),
            limit: Number(limit),
        };

        const folders = await FolderModel.aggregatePaginate(
            FolderModel.aggregate([
                { $match: { userId: req.user._id } },
                { $sort: { createdAt: -1 } },
            ]),
            options,
        );

        res.status(200).json(
            new ApiResponse(200, folders, "Folders fetched successfully!"),
        );
    },
);

// facthing all contents, images, folders that are inside a folder using folderId
const fetchContentsImagesFoldersInFolder = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (!req.user) {
            throw new ApiError(401, "User not authenticated!");
        }
        // TODO(subarna): checking if user's email is verified

        const { folderId } = req.params;

        if (!mongoose.isValidObjectId(folderId)) {
            throw new ApiError(400, "Invalid folder ID!");
        }

        const contents = await FolderModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(folderId),
                    userId: req.user._id,
                },
            },
            {
                $lookup: {
                    from: "contents",
                    let: { folderId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$parentFolderId", "$$folderId"],
                                },
                            },
                        },
                        {
                            $project: {
                                body: 0,
                            },
                        },
                    ],
                    as: "notes",
                },
            },
            {
                $lookup: {
                    from: "images",
                    localField: "_id",
                    foreignField: "parentFolderId",
                    as: "images",
                },
            },
            {
                $lookup: {
                    from: "folders",
                    localField: "_id",
                    foreignField: "parentFolderId",
                    as: "subFolders",
                },
            },
        ]);

        res.status(200).json(
            new ApiResponse(200, contents, "Contents fetched successfully!"),
        );
    },
);

export {
    createFolder,
    fetchFolders,
    updateFolder,
    deleteFolder,
    fetchFoldersWithPagination,
    fetchContentsImagesFoldersInFolder,
};
