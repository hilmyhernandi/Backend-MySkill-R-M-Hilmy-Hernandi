import mongoose, { Schema } from "mongoose";
import { IUser } from "../interfaces/module/users-module.interface";

const UserSchema = new Schema<IUser>({
  _id: { type: Schema.Types.ObjectId, auto: true },
  name: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: () => new Date() },
  updatedAt: { type: Date, default: () => new Date() },
});

UserSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

UserSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

export const UserModel = mongoose.model<IUser>("Users", UserSchema);
