import mongoose, { Schema, Document, Model, ObjectId } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

export interface IPin extends Document {
    _id: ObjectId;
    type: string;
    pinItemId: ObjectId;
    userId: ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const pinSchema = new Schema<IPin>(
    {
        type: {
            type: String,
            enum: ["Folder", "Content", "Image"],
            required: [true, "Type is required!"],
        },
        pinItemId: {
            type: Schema.Types.ObjectId,
            refPath: "type",
            required: [true, "Pin item ID is required!"],
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required!"],
        },
    },
    { timestamps: true },
);

pinSchema.plugin(mongooseAggregatePaginate);
const PinModel: Model<IPin> = mongoose.model<IPin>("Pin", pinSchema);
export default PinModel;
