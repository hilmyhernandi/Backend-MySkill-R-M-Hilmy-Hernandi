import mongoose, { Document } from "mongoose";
export interface IArticle extends Document {
  status: "draft" | "published";
  title: string;
  content: string;
  author: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
