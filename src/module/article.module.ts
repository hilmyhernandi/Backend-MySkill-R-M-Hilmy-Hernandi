import mongoose, { Schema } from "mongoose";
import { IArticle } from "../interfaces/module/article-module.interface";

const articleSchema = new Schema<IArticle>({
  status: {
    type: String,
    enum: ["draft", "published"],
    default: "draft",
  },
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true, trim: true },
  author: { type: Schema.Types.ObjectId, ref: "users", required: true },
  createdAt: { type: Date, default: () => new Date() },
  updatedAt: { type: Date, default: () => new Date() },
});

articleSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

articleSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

export const articleModel = mongoose.model<IArticle>("Article", articleSchema);
