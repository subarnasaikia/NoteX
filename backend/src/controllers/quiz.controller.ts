import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import ContentModel from "../models/notes.contents.model.js";
import QuizModel from "../models/quiz.model.js";
import { generateQuiz } from "../agent/quiz.js";
import mongoose, { ObjectId } from "mongoose";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const generateQuizHandler = asyncHandler(
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
        const quiz = await generateQuiz(contentText, numQuestions);
        if (!quiz || quiz.length === 0) {
            throw new ApiError(500, "Failed to generate quiz.");
        }

        const saveQuiz = await QuizModel.create({
            title: `Quiz for ${content.title}`,
            hex_color: "#000000", // Example color
            body: quiz,
            tags: ["quiz", "generated"],
            userId: req.user._id,
        });

        if (!saveQuiz) {
            throw new ApiError(500, "Failed to save quiz.");
        }

        res.status(201).json(
            new ApiResponse(200, saveQuiz, "Quiz generated successfully!"),
        );
    },
);

// fetching quizes using pagination using aggregation
const fetchQuizzesHandler = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (!req.user) {
            throw new ApiError(401, "User not authenticated!");
        }
        const userId: ObjectId = req.user._id;
        const { page = 1, limit = 10 } = req.query;
        const pageNumber = parseInt(page as string, 10);
        const limitNumber = parseInt(limit as string, 10);
        const skip = (pageNumber - 1) * limitNumber;
        const quizzes = await QuizModel.aggregate([
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
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limitNumber },
        ]);
        const totalQuizzes = await QuizModel.countDocuments({ userId: userId });
        const totalPages = Math.ceil(totalQuizzes / limitNumber);
        const hasNextPage = pageNumber < totalPages;
        const hasPrevPage = pageNumber > 1;
        res.status(200).json(
            new ApiResponse(
                200,
                {
                    quizzes,
                    totalQuizzes,
                    totalPages,
                    hasNextPage,
                    hasPrevPage,
                    currentPage: pageNumber,
                },
                "Quizzes fetched successfully!",
            ),
        );
    },
);

const fetchQuizByIdHandler = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (!req.user) {
            throw new ApiError(401, "User not authenticated!");
        }
        const { quizId } = req.params;
        if (!quizId) {
            throw new ApiError(400, "Quiz ID is required.");
        }
        if (!mongoose.Types.ObjectId.isValid(quizId)) {
            throw new ApiError(400, "Invalid Quiz ID.");
        }
        const quiz = await QuizModel.findById(quizId).select("-__v");
        if (!quiz) {
            throw new ApiError(404, "Quiz not found.");
        }
        res.status(200).json(
            new ApiResponse(200, quiz, "Quiz fetched successfully!"),
        );
    },
);

export { generateQuizHandler, fetchQuizzesHandler, fetchQuizByIdHandler };
