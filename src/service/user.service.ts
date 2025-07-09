import { UserModel } from "../module/users.module";
import { IUser } from "../interfaces/module/users-module.interface";

const create = async (
  name: string,
  username: string,
  password: string
): Promise<IUser> => {
  const user = new UserModel({
    name,
    username,
    password,
  });

  return await user.save();
};

const isNameUsed = async (name: string): Promise<boolean> => {
  const user = await UserModel.findOne({ name });
  return !!user;
};

const isUsernameUsed = async (username: string): Promise<boolean> => {
  const user = await UserModel.findOne({ username });
  return !!user;
};

const findByName = async (name: string): Promise<IUser | null> => {
  return await UserModel.findOne({ name });
};

const findByUsername = async (username: string): Promise<IUser | null> => {
  return await UserModel.findOne({ username });
};

const update = async (
  userId: string,
  name: string,
  username: string
): Promise<IUser | null> => {
  return await UserModel.findByIdAndUpdate(
    userId,
    { name, username },
    { new: true }
  );
};

const deleteUser = async (userId: string): Promise<IUser | null> => {
  return await UserModel.findByIdAndDelete(userId);
};

export default {
  create,
  isNameUsed,
  isUsernameUsed,
  findByName,
  findByUsername,
  update,
  deleteUser,
};
