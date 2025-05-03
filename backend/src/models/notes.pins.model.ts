import mongoose, {
    Schema,
    Document,
    ObjectId,
    AggregatePaginateModel,
} from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

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

pinSchema.plugin(aggregatePaginate);
const PinModel = mongoose.model<IPin, AggregatePaginateModel<IPin>>(
    "Pin",
    pinSchema,
);
export default PinModel;
