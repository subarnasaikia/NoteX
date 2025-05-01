import mongoose, { Schema, Document, Model, ObjectId } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

export interface IImage extends Document {
    _id: ObjectId;
    imageName: string;
    imageUrl: string; // cloudinary URL
    userId: ObjectId;
    parentFolderId: ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const imageSchema = new Schema<IImage>(
    {
        imageName: {
            type: String,
            required: [true, "Image name is required!"],
            trim: true,
        },
        imageUrl: {
            type: String,
            required: [true, "Image URL is required!"],
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required!"],
        },
        parentFolderId: {
            type: Schema.Types.ObjectId,
            ref: "Folder",
        },
    },
    { timestamps: true },
);

imageSchema.plugin(mongooseAggregatePaginate);

const ImageModel: Model<IImage> = mongoose.model<IImage>("Image", imageSchema);
export default ImageModel;
