import { loadConfig } from "../config/loadConfig.js";
import { AppConfig } from "../config/type.js";
import mongoose, { Schema, Document, Model } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ApiError } from "../utils/ApiError.js";
import { StringValue } from "ms";

// env Configurations
const envConfig: AppConfig = loadConfig();

// Interface for subdocument
export interface FullName {
    firstName: string;
    middleName?: string;
    lastName: string;
}

export interface EmailInfo {
    emailAddress: string;
    isVarified: boolean;
}

// intereface for IUser document
export interface IUser extends Document {
    username: string;
    name: FullName;
    email: EmailInfo;
    password: string;
    avatar: string;
    refreshToken?: string;
    createdAt: Date;
    updatedAt: Date;

    // Virtual
    fullName: string;

    // Instance methods
    isPasswordCorrect(password: string): Promise<boolean>;
    generateAccessToken(): string;
    generateRrefreshToken(): string;
}

// Schema for subSchema
const fullNameSchema = new Schema<FullName>(
    {
        firstName: {
            type: String,
            required: [true, "firstName is required!"],
            trim: true,
        },
        middleName: {
            type: String,
            trim: true,
        },
        lastName: {
            type: String,
            required: [true, "lastName is required!"],
            trim: true,
        },
    },
    { _id: false },
);

const emailSchema = new Schema<EmailInfo>(
    {
        emailAddress: {
            type: String,
            required: [true, "Email is required!"],
            unique: true,
            trim: true,
            lowercase: true,
        },
        isVarified: {
            type: Boolean,
            default: false,
        },
    },
    { _id: false },
);

// Shcema for IUser
const userSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: [true, "username is required!"],
            unique: true,
            trim: true,
            lowercase: true,
            index: true,
        },
        name: {
            type: fullNameSchema,
            required: true,
        },
        email: {
            type: emailSchema,
            required: true,
        },
        password: {
            type: String,
            required: [true, "password is required"],
        },
        avatar: {
            type: String,
            default: "https://www.gravatar.com/avatar/?d=mp",
        },
        refreshToken: {
            type: String,
        },
    },
    { timestamps: true },
);

// Virtual functions
userSchema.virtual("fullName").get(function (this: IUser) {
    const { firstName, middleName, lastName } = this.name;
    return [firstName, middleName, lastName].filter(Boolean).join(" ");
});

// Set functions
userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

// Middleware hash password
userSchema.pre<IUser>(
    "save",
    async function (this: IUser, next: (err?: Error) => void) {
        if (!this.isModified("password")) return next();
        this.password = await bcrypt.hash(this.password, 10);
        next();
    },
);

// checking the password is corect or not
userSchema.methods.isPasswordCorrect = async function (
    this: IUser,
    password: string,
): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};

// methods to genereate Access token using jwt
userSchema.methods.generateAccessToken = function (this: IUser): string {
    const secret_token = envConfig.jwt.access_token_secret;
    const expiry = envConfig.jwt.access_token_expiry;
    if (!secret_token || secret_token.length === 0) {
        throw new ApiError(500, "Missing ACCESS_TOKEN_SECRET in config");
    }
    if (!expiry || expiry.length === 0) {
        throw new ApiError(500, "Missing ACCESS_TOKEN_EXPIRY in config");
    }
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
        },
        secret_token,
        {
            expiresIn: expiry,
        },
    );
};

// methods to generate refresh token using jwt
userSchema.methods.generateRrefreshToken = function (this: IUser): string {
    const secret_token: string = envConfig.jwt.refresh_token_secret;
    const expiry: StringValue = envConfig.jwt.refresh_token_expiry;
    if (!secret_token || secret_token.length === 0) {
        throw new ApiError(500, "Missing REFRESH_TOKEN_SECRET in config");
    }
    if (!expiry || expiry.length === 0) {
        throw new ApiError(500, "Missing REFRESH_TOKEN_EXPIRY in config");
    }
    return jwt.sign(
        {
            _id: this._id,
        },
        secret_token,
        {
            expiresIn: expiry,
        },
    );
};

// creating the User model
const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;
