import mongoose, { Schema, Document, ObjectId, Model } from "mongoose";

interface AnsweredQuestion {
    questionIndex: number; // index of the question in quiz.body
    selectedOption: string;
    isCorrect: boolean;
}

export interface IQuizResult extends Document {
    userId: ObjectId;
    quizId: ObjectId;
    correctCount: number;
    totalQuestions: number;
    answers: AnsweredQuestion[];
    submittedAt: Date;
}

const answeredQuestionSchema = new Schema<AnsweredQuestion>(
    {
        questionIndex: {
            type: Number,
            required: true,
        },
        selectedOption: {
            type: String,
            required: true,
        },
        isCorrect: {
            type: Boolean,
            required: true,
        },
    },
    { _id: false },
);

const quizResultSchema = new Schema<IQuizResult>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        quizId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Quiz",
            required: true,
        },
        correctCount: {
            type: Number,
            required: true,
        },
        totalQuestions: {
            type: Number,
            required: true,
        },
        answers: {
            type: [answeredQuestionSchema],
            required: true,
        },
        submittedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true },
);

const QuizResultModel: Model<IQuizResult> = mongoose.model<IQuizResult>(
    "QuizResult",
    quizResultSchema,
);
export default QuizResultModel;
