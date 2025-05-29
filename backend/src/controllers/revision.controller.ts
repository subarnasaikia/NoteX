import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import ContentModel from "../models/notes.contents.model.js";
import mongoose from "mongoose";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import RevisionModel from "../models/revision.model.js";
import { generateRevisionPlan } from "../agent/revision.js";

const generateRevisionHandler = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (!req.user) {
            throw new ApiError(401, "User not authenticated!");
        }
        const { contentId, numQuestions = 5 } = req.body;
        if (!contentId) {
            throw new ApiError(400, "Content ID is required.");
        }
        if (!mongoose.Types.ObjectId.isValid(contentId)) {
            throw new ApiError(400, "Invalid Content ID.");
        }
        const content = await ContentModel.findById(contentId);
        if (!content) {
            throw new ApiError(404, "Content not found.");
        }
        const contentText = content.body.bodyContent;
        if (!contentText) {
            throw new ApiError(400, "Content text is required.");
        }
        const revisionPlan = await generateRevisionPlan(
            contentText,
            numQuestions,
        );
        if (!revisionPlan || revisionPlan.length === 0) {
            throw new ApiError(500, "Failed to generate revision plan.");
        }

        const saveRevision = await RevisionModel.create({
            title: `Revision for ${content.title}`,
            hex_color: "#000000", // Example color
            body: revisionPlan,
            tags: ["revision", "generated"],
            userId: req.user?._id,
        });

        if (!saveRevision) {
            throw new ApiError(500, "Failed to save revision.");
        }

        res.status(201).json(
            new ApiResponse(
                200,
                saveRevision,
                "Revision generated successfully!",
            ),
        );
    },
);

const fetchRevisionsHandler = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (!req.user) {
            throw new ApiError(401, "User not authenticated!");
        }
        const userId = req.user._id;
        const { page = 1, limit = 10 } = req.query;
        const pageNumber = parseInt(page as string, 10);
        const limitNumber = parseInt(limit as string, 10);
        const skip = (pageNumber - 1) * Number(limit);
        const revisions = await RevisionModel.aggregate([
            {
                $match: {
                    userId: userId,
                },
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    hex_color: 1,
                    tags: 1,
                    createdAt: 1,
                    updatedAt: 1,
                },
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
            {
                $skip: skip,
            },
            {
                $limit: limitNumber,
            },
        ]);
        const totalRevisions = await RevisionModel.countDocuments({
            userId: userId,
        });
        const totalPages = Math.ceil(totalRevisions / Number(limit));
        const hasNextPage = Number(page) < totalPages;
        const hasPrevPage = Number(page) > 1;
        res.status(200).json(
            new ApiResponse(
                200,
                {
                    revisions,
                    totalRevisions,
                    totalPages,
                    hasNextPage,
                    hasPrevPage,
                    currentPage: Number(page),
                },
                "Revisions fetched successfully!",
            ),
        );
    },
);

const fetchRevisionByIdHandler = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (!req.user) {
            throw new ApiError(401, "User not authenticated!");
        }
        const { revisionId } = req.params;
        if (!revisionId) {
            throw new ApiError(400, "Revision ID is required.");
        }
        if (!mongoose.Types.ObjectId.isValid(revisionId)) {
            throw new ApiError(400, "Invalid Revision ID.");
        }
        const revision =
            await RevisionModel.findById(revisionId).select("-__v");
        if (!revision) {
            throw new ApiError(404, "Revision not found.");
        }
        res.status(200).json(
            new ApiResponse(200, revision, "Revision fetched successfully!"),
        );
    },
);

const fetchAllRevisionsHandler = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (!req.user) {
            throw new ApiError(401, "User not authenticated!");
        }
        const userId = req.user._id;
        const revisions = await RevisionModel.find({ userId: userId })
            .select("-__v")
            .sort({ createdAt: -1 });
        // if (!revisions || revisions.length === 0) {
        //     throw new ApiError(404, "No revisions found for this user.");
        // }
        res.status(200).json(
            new ApiResponse(
                200,
                revisions,
                "All revisions fetched successfully!",
            ),
        );
    },
);

export {
    generateRevisionHandler,
    fetchRevisionsHandler,
    fetchRevisionByIdHandler,
    fetchAllRevisionsHandler,
};
