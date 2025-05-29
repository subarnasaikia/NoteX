import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import ContentModel from "../models/notes.contents.model.js";
import QuizModel from "../models/quiz.model.js";
import { generateQuiz } from "../agent/quiz.js";
import mongoose, { ObjectId } from "mongoose";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import QuizResultModel from "../models/quizResult.model.js";

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
        const generatedQuiz = await generateQuiz(contentText, numQuestions);
        if (!generatedQuiz || !Array.isArray(generatedQuiz.questions)) {
            throw new ApiError(500, "Failed to generate quiz.");
        }

        const quiz = generatedQuiz.questions.map((q) => ({
            question: q.question,
            options: q.options,
            answer: q.answer,
            explanation: q.explanation,
        }));

        const tags = generatedQuiz.tags || [];
        // if (!Array.isArray(tags) || tags.length === 0) {
        //     throw new ApiError(400, "Quiz tags are required.");
        // }

        if (quiz.length === 0) {
            throw new ApiError(500, "Generated quiz is empty.");
        }

        const saveQuiz = await QuizModel.create({
            title: `Quiz for ${content.title}`,
            hex_color: "#000000", // Example color
            body: quiz,
            tags: tags,
            userId: req.user._id,
            isApperared: false,
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

const fetchAllQuizHandler = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (!req.user) {
            throw new ApiError(401, "User not authenticated!");
        }
        const userId: ObjectId = req.user._id;
        const quizzes = await QuizModel.find({ userId }).select("-__v -body");
        // if (!quizzes || quizzes.length === 0) {
        //     throw new ApiError(404, "No quizzes found for this user.");
        // }
        res.status(200).json(
            new ApiResponse(200, quizzes, "Quizzes fetched successfully!"),
        );
    },
);

const submitQuizHandler = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (!req.user) {
            throw new ApiError(401, "User not authenticated!");
        }

        const { quizId, answers } = req.body;

        if (!quizId || !answers || !Array.isArray(answers)) {
            throw new ApiError(400, "Quiz ID and answers are required.");
        }

        if (!mongoose.Types.ObjectId.isValid(quizId)) {
            throw new ApiError(400, "Invalid Quiz ID.");
        }

        const quiz = await QuizModel.findById(quizId);
        if (!quiz) {
            throw new ApiError(404, "Quiz not found.");
        }

        if (answers.length !== quiz.body.length) {
            throw new ApiError(
                400,
                "Number of answers does not match number of questions.",
            );
        }

        let correctCount = 0;
        const answeredQuestions = answers.map((answer, index) => {
            const isCorrect = quiz.body[index].answer === answer;
            if (isCorrect) correctCount++;
            return {
                questionIndex: index,
                selectedOption: answer,
                isCorrect,
            };
        });

        // Save or update the result
        const existingResult = await QuizResultModel.findOne({
            userId: req.user._id,
            quizId: quiz._id,
        });

        // update quiz as appeared
        quiz.isAppeared = true;
        await quiz.save();

        if (existingResult) {
            existingResult.correctCount = correctCount;
            existingResult.answers = answeredQuestions;
            existingResult.totalQuestions = quiz.body.length;
            existingResult.submittedAt = new Date();
            await existingResult.save();
            res.status(200).json(
                new ApiResponse(
                    200,
                    existingResult,
                    "Quiz result updated successfully!",
                ),
            );
        } else {
            const quizResult = await QuizResultModel.create({
                userId: req.user._id,
                quizId: quiz._id,
                correctCount,
                totalQuestions: quiz.body.length,
                answers: answeredQuestions,
                submittedAt: new Date(),
            });

            res.status(201).json(
                new ApiResponse(
                    201,
                    quizResult,
                    "Quiz submitted successfully!",
                ),
            );
        }
    },
);

const fetchResultsHandler = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        if (!req.user) {
            throw new ApiError(401, "User not authenticated!");
        }

        const userId: ObjectId = req.user._id;
        const quizId = req.params.quizId;

        if (!quizId) {
            throw new ApiError(400, "Quiz ID is required.");
        }

        if (!mongoose.Types.ObjectId.isValid(quizId)) {
            throw new ApiError(400, "Invalid Quiz ID.");
        }

        const [quiz, result] = await Promise.all([
            QuizModel.findById(quizId),
            QuizResultModel.findOne({ userId, quizId }).sort({
                submittedAt: -1,
            }),
        ]);

        if (!quiz) {
            throw new ApiError(404, "Quiz not found.");
        }

        if (!result) {
            throw new ApiError(404, "No result found for this quiz.");
        }

        // Merge quiz question details with user answers
        const detailedResults = quiz.body.map((q, index) => {
            const userAnswer = result.answers.find(
                (a) => a.questionIndex === index,
            );
            return {
                questionIndex: index,
                question: q.question,
                options: q.options,
                correctAnswer: q.answer,
                explanation: q.explanation,
                selectedOption: userAnswer?.selectedOption || null,
                isCorrect: userAnswer?.isCorrect || false,
            };
        });

        res.status(200).json(
            new ApiResponse(
                200,
                {
                    quizId: quiz._id,
                    title: quiz.title,
                    hex_color: quiz.hex_color,
                    totalQuestions: quiz.body.length,
                    correctCount: result.correctCount,
                    submittedAt: result.submittedAt,
                    detailedResults,
                },
                "Quiz result fetched successfully.",
            ),
        );
    },
);

export {
    generateQuizHandler,
    fetchQuizzesHandler,
    fetchQuizByIdHandler,
    fetchAllQuizHandler,
    submitQuizHandler,
    fetchResultsHandler,
};
