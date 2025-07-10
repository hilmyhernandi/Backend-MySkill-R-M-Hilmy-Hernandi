import { Schema, model } from "mongoose";
import { IPageView } from "../interfaces/module/page-view-module.interface";

const pageViewSchema = new Schema<IPageView>({
  article: { type: Schema.Types.ObjectId, ref: "Article", required: true },
  viewedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: () => new Date() },
  updatedAt: { type: Date, default: () => new Date() },
});

export const pageViewModel = model<IPageView>("PageView", pageViewSchema);
