import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Request, Response } from "express";
import ContentModel, { IContents } from "../models/notes.contents.model.js";
import { semanticSearch } from "../agent/search.js";

// create new content
const createContent = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (!req.user) {
            throw new ApiError(401, "User not authenticated!");
        }
        // TODO(subarna): checking if user's email is verified

        const {
            title,
            hex_color,
            body,
            parentFolderId,
            tags,
        }: {
            title: string;
            hex_color: string;
            body: IContents["body"];
            parentFolderId: string | null;
            tags?: string[];
        } = req.body;

        if (!title) {
            throw new ApiError(400, "Title is required!");
        }

        if (!body) {
            throw new ApiError(400, "Body is required!");
        }
        const newContent: IContents = await ContentModel.create({
            title,
            hex_color,
            body,
            parentFolderId,
            userId: req.user?._id,
            tags,
        });

        const contentBody: IContents | null = await ContentModel.findById(
            newContent._id,
        ).select("-__v -embedding");

        if (!contentBody) {
            throw new ApiError(404, "Can't create content!");
        }

        res.status(201).json(
            new ApiResponse(200, contentBody, "Content created successfully!"),
        );
    },
);

// fetch or read the  contents as page

// fetch content using contentId
const fetchContentUsingId = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (!req.user) {
            throw new ApiError(401, "User not authenticated!");
        }
        // TODO(subarna): checking if user's email is verified

        const { contentId } = req.params;

        if (!contentId) {
            throw new ApiError(400, "Content ID is required!");
        }

        const content: IContents | null = await ContentModel.findOne({
            _id: contentId,
            userId: req.user?._id,
        }).select("-__v -embedding");

        if (!content) {
            throw new ApiError(404, "Content not found!");
        }

        res.status(200).json(
            new ApiResponse(200, content, "Content fetched successfully!"),
        );
    },
);

// update content
const updateContentUsingId = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (!req.user) {
            throw new ApiError(401, "User not authenticated!");
        }
        // TODO(subarna): checking if user's email is verified

        const { contentId } = req.params;

        if (!contentId) {
            throw new ApiError(400, "Content ID is required!");
        }

        const {
            title,
            hex_color,
            body,
            parentFolderId,
            tags,
        }: {
            title: string;
            hex_color: string;
            body: IContents["body"];
            parentFolderId: string;
            tags?: string[];
        } = req.body;

        const content: IContents | null = await ContentModel.findOneAndUpdate(
            {
                _id: contentId,
                userId: req.user?._id,
            },
            {
                title,
                hex_color,
                body,
                parentFolderId,
                tags,
            },
            { new: true },
        ).select("-__v -embedding");

        if (!content) {
            throw new ApiError(404, "Content not found!");
        }

        res.status(200).json(
            new ApiResponse(200, content, "Content updated successfully!"),
        );
    },
);

// delete content
const deleteContentUsingId = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (!req.user) {
            throw new ApiError(401, "User not authenticated!");
        }
        // TODO(subarna): checking if user's email is verified

        const { contentId } = req.params;

        if (!contentId) {
            throw new ApiError(400, "Content ID is required!");
        }

        const content: IContents | null = await ContentModel.findOneAndDelete({
            _id: contentId,
            userId: req.user?._id,
        }).select("-__v -embedding");

        if (!content) {
            throw new ApiError(404, "Content not found!");
        }

        res.status(200).json(
            new ApiResponse(200, {}, "Content deleted successfully!"),
        );
    },
);

// search using vector search from agent/search.ts
const searchContent = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (!req.user) {
            throw new ApiError(401, "User not authenticated!");
        }
        // TODO(subarna): checking if user's email is verified
        const { query } = req.body;
        if (!query) {
            throw new ApiError(400, "Query is required!");
        }
        const results = await semanticSearch(query, 5);
        if (!results) {
            throw new ApiError(404, "No results found!");
        }
        const contents = results.map((result) => {
            return {
                _id: result.metadata._id,
                title: result.metadata.title,
                body: result.pageContent,
                hex_color: result.metadata.hex_color,
                parentFolderId: result.metadata.parentFolderId,
                tags: result.metadata.tags,
            };
        });
        res.status(200).json(
            new ApiResponse(200, contents, "Content fetched successfully!"),
        );
    },
);

export {
    createContent,
    fetchContentUsingId,
    updateContentUsingId,
    deleteContentUsingId,
    searchContent,
};
