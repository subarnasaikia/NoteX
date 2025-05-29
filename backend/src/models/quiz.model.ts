import mongoose, { Schema, Document, ObjectId, Model } from "mongoose";

export interface QuizBody {
    question: string;
    options: string[];
    answer: string;
    explanation: string;
}

export interface IQuiz extends Document {
    _id: ObjectId;
    title: string;
    hex_color: string;
    body: QuizBody[];
    tags: string[];
    isApperared?: boolean;
    userId: ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const quizBodySchema = new Schema<QuizBody>(
    {
        question: {
            type: String,
            required: true,
        },
        options: {
            type: [String],
            required: true,
        },
        answer: {
            type: String,
            required: true,
        },
        explanation: {
            type: String,
            required: true,
        },
    },
    { _id: false },
);

const quizSchema = new Schema<IQuiz>(
    {
        title: {
            type: String,
            required: true,
        },
        hex_color: {
            type: String,
            required: true,
        },
        body: {
            type: [quizBodySchema],
            required: true,
        },
        tags: {
            type: [String],
            default: [],
        },
        isApperared: {
            type: Boolean,
            default: false,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true },
);

const QuizModel: Model<IQuiz> = mongoose.model<IQuiz>("Quiz", quizSchema);
export default QuizModel;
