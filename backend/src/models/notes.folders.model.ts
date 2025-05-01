import mongoose, { Schema, Document, Model, ObjectId } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
export interface IFolder extends Document {
    _id: ObjectId;
    folderName: string;
    description: string;
    hex_color: string;
    userId: ObjectId;
    parentFolderId?: ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const folderSchema = new Schema<IFolder>(
    {
        folderName: {
            type: String,
            default: "new folder",
            required: [true, "Folder name is required!"],
            trim: true,
        },
        description: {
            type: String,
            default: "",
            trim: true,
        },
        hex_color: {
            type: String,
            default: "#000000",
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

folderSchema.plugin(mongooseAggregatePaginate);

const FolderModel: Model<IFolder> = mongoose.model<IFolder>(
    "Folder",
    folderSchema,
);
export default FolderModel;
