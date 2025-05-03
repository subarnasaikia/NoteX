import mongoose, {
    Schema,
    Document,
    AggregatePaginateModel,
    ObjectId,
} from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
export interface IFolder extends Document {
    _id: ObjectId;
    folderName: string;
    description: string;
    hex_color: string;
    userId: ObjectId;
    parentFolderId?: ObjectId | null;
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
            default: null,
            // TODO(subarna): add default value to the root folder.
            // TODO(subarna): add validation to check if the parent folder exists
        },
    },
    { timestamps: true },
);

folderSchema.plugin(aggregatePaginate);

const FolderModel = mongoose.model<IFolder, AggregatePaginateModel<IFolder>>(
    "Folder",
    folderSchema,
);
export default FolderModel;
