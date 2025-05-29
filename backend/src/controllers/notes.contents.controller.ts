import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Request, Response } from "express";
import ContentModel, { IContents } from "../models/notes.contents.model.js";
// import { semanticSearch } from "../agent/search.js";
import User from "../models/users.model.js";
import { embedContent } from "../agent/embeddings.js";
// import { Types, ObjectId } from "mongoose";
import { ObjectId } from "mongodb";

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

// fetch or read the  contents

const fetchAllContents = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (!req.user) {
            throw new ApiError(401, "User not authenticated!");
        }
        // TODO(subarna): checking if user's email is verified
        const contents: IContents[] = await ContentModel.find({
            userId: req.user?._id,
        })
            .select("-__v -embedding")
            .sort({ createdAt: -1 });
        // if (!contents || contents.length === 0) {
        //     throw new ApiError(404, "No contents found!");
        // }
        res.status(200).json(
            new ApiResponse(200, contents, "Contents fetched successfully!"),
        );
    },
);

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
        // const results = await semanticSearch(query, 5);
        const queryVector = await embedContent(query);
        const results = await ContentModel.aggregate([
            {
                $vectorSearch: {
                    index: "vector_index",
                    path: "embedding",
                    queryVector: queryVector,
                    numCandidates: 50,
                    limit: 5,
                    // filter: {
                    //     userId: userId, // Filter by authenticated user's ID
                    // },
                },
            },
        ]);

        if (!results) {
            throw new ApiError(404, "No results found!");
        }
        // console.log(results);
        const contents = results.map((result) => {
            return {
                _id: result._id,
                userId: result.userId,
                title: result.title,
                body: result.body,
                hex_color: result.hex_color,
                parentFolderId: result.parentFolderId,
                tags: result.tags,
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
    fetchAllContents,
};
