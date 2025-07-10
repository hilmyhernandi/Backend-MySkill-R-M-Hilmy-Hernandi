import { Types } from "mongoose";

export interface IPageView {
  article: Types.ObjectId;
  viewedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
