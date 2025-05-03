import mongoose, { Schema, Document, ObjectId, Model } from "mongoose";

export interface RivisionBody {
    question: string;
    answer: string;
}

export interface IRevision extends Document {
    _id: ObjectId;
    title: string;
    hex_color: string;
    body: RivisionBody[];
    tags: string[];
    userId: ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const revisionBodySchema = new Schema<RivisionBody>(
    {
        question: {
            type: String,
            required: true,
        },
        answer: {
            type: String,
            required: true,
        },
    },
    { _id: false },
);

const revisionSchema = new Schema<IRevision>(
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
            type: [revisionBodySchema],
            required: true,
        },
        tags: {
            type: [String],
            default: [],
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true },
);
const RevisionModel: Model<IRevision> = mongoose.model<IRevision>(
    "Revision",
    revisionSchema,
);
export default RevisionModel;
