import mongoose, {
    Schema,
    Document,
    ObjectId,
    AggregatePaginateModel,
} from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

// interface for subdocument
export interface MarkdownContent {
    type: "markdown";
    bodyContent: string;
}

export interface LatexContent {
    type: "latex";
    bodyContent: string;
}

export interface ExcalidrawContent {
    type: "excalidraw";
    bodyContent: any; // store raw JSON exported from Excalidraw
}
export interface DocsContent {
    type: "docs";
    bodyContent: any[]; // could be tiptap/Quill/Slate blocks, or custom format
}

export type ContentBody =
    | MarkdownContent
    | LatexContent
    | ExcalidrawContent
    | DocsContent;

// interface for IContent document
export interface IContents extends Document {
    _id: ObjectId;
    title: string;
    hex_color: string;
    body: ContentBody;
    parentFolderId: ObjectId;
    userId: ObjectId;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

// Discriminated Sub-Schemas for body
const baseBodySchema = new Schema(
    {},
    {
        discriminatorKey: "type",
        _id: false,
    },
);

const markdownBodySchema = new Schema(
    {
        // type: {
        //     type: String,
        //     enum: ["markdown"],
        //     default: "markdown",
        // },
        bodyContent: {
            type: String,
            required: true,
        },
    },
    { _id: false },
);

const latexBodySchema = new Schema(
    {
        // type: {
        //     type: String,
        //     enum: ["latex"],
        //     default: "latex",
        // },
        bodyContent: {
            type: String,
            required: true,
        },
    },
    { _id: false },
);

const excalidrawBodySchema = new Schema(
    {
        // type: {
        //     type: String,
        //     enum: ["excalidraw"],
        //     default: "excalidraw",
        // },
        bodyContent: {
            type: Schema.Types.Mixed,
            required: true,
        },
    },
    { _id: false },
);

const docsBodySchema = new Schema(
    {
        // type: {
        //     type: String,
        //     enum: ["docs"],
        //     default: "docs",
        // },
        bodyContent: {
            type: [Schema.Types.Mixed],
            required: true,
        },
    },
    { _id: false },
);

baseBodySchema.discriminator("markdown", markdownBodySchema);
baseBodySchema.discriminator("latex", latexBodySchema);
baseBodySchema.discriminator("excalidraw", excalidrawBodySchema);
baseBodySchema.discriminator("docs", docsBodySchema);

const contentsSchema = new Schema<IContents>(
    {
        title: {
            type: String,
            default: "new note",
            required: [true, "Title is required!"],
            trim: true,
        },
        hex_color: {
            type: String,
            default: "#ffffff",
        },
        body: {
            type: baseBodySchema,
            required: true,
        },
        parentFolderId: {
            type: Schema.Types.ObjectId,
            ref: "Folder",
            required: [true, "Parent folder ID is required!"],
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required!"],
        },
        tags: {
            type: [String],
            default: [],
        },
    },
    { timestamps: true },
);

contentsSchema.plugin(aggregatePaginate);

const ContentModel = mongoose.model<
    IContents,
    AggregatePaginateModel<IContents>
>("Content", contentsSchema);
export default ContentModel;
