import { Request, Response, NextFunction } from "express";
import usersService from "../service/user.service";
import { errorResponse } from "../error/error";
import inputValidation from "../validations/usersValidations";
import {
  identifierConflict,
  identifierConflictByUsersId,
} from "../utils/message.utils";
import { PasswordBcrypt } from "../security/password-bcrypt";
import redisService from "../service/redis.service";
import { updateSession, destroySession } from "../utils/session.util";
import { clearCookie } from "../utils/cookie.util";

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { name, username, password } = req.body;
    const { error } = inputValidation.schemaCreateUsers.validate(req.body);
    if (error) {
      throw new errorResponse(error.details[0].message, 400);
    }
    const existingName = await usersService.isNameUsed(name);
    const existingUserName = await usersService.isUsernameUsed(username);
    identifierConflict(existingUserName, existingName);
    password = await new PasswordBcrypt().generateHash(password);
    const user = await usersService.create(name, username, password);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, username } = req.body;
    const usersId: string = req.session.usersId!;
    const { error } = inputValidation.schemaUpdate.validate(req.body);
    if (error) {
      throw new errorResponse(error.details[0].message, 400);
    }

    const redisData = await redisService.getRedisValue(`users:${usersId}`);

    if (!redisData) {
      throw new errorResponse(
        "user does not have access, failed to update profile",
        403
      );
    }

    const userByName = await usersService.findByName(name);
    const userByUsername = await usersService.findByUsername(username);

    if (userByName && userByUsername) {
      identifierConflictByUsersId(
        usersId,
        userByName!._id.toString(),
        userByUsername!._id.toString()
      );
    }

    await usersService.update(usersId, name, username);
    updateSession(req, usersId, username);
    await redisService.updateRedisValues(`users:${usersId}`, { username });
    res.status(200).json({
      success: true,
      message: "users profile updated successfully",
      data: {
        name,
        username,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const usersId = req.session.usersId;
    if (!usersId) {
      throw new errorResponse(
        "user does not have access, failed to delete profile",
        403
      );
    }

    const isUsersId = await redisService.getRedisValue(`user:${usersId}`);
    if (!isUsersId) {
      throw new errorResponse(
        "user does not have access, failed to delete profile",
        403
      );
    }

    await usersService.deleteUser(usersId);
    await redisService.deleteRedisKey(`users:${usersId}`);
    await destroySession(req);
    clearCookie(res, "token");
    clearCookie(res, "connect.sid");

    res.status(200).json({
      success: true,
      message: "users deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export default {
  create,
  updateUserProfile,
  deleteUser,
};
