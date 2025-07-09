import { Request, Response, NextFunction } from "express";
import usersService from "../service/user.service";
import { errorResponse } from "../error/error";
import { bruteForceProtector } from "../security/brute-force";
import { jwtOptions } from "../security/jwt-manager";
import { PasswordBcrypt } from "../security/password-bcrypt";
import { setCookie, clearCookie } from "../utils/cookie.util";
import { setSession, destroySession } from "../utils/session.util";
import inputValidation from "../validations/auth.validations";
import { identifierConflict } from "../utils/message.utils";
import redisService from "../service/redis.service";

const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let { name, username, password } = req.body;
    const { error } = inputValidation.schemaSignUp.validate(req.body);

    if (error) {
      throw new errorResponse(error.details[0].message, 400);
    }
    const existingName = await usersService.isNameUsed(name);
    const existingUserName = await usersService.isUsernameUsed(username);
    identifierConflict(existingUserName, existingName);

    password = await new PasswordBcrypt().generateHash(password);

    await usersService.create(name, username, password);
    res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    next(error);
  }
};

const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, password } = req.body;
    const { error } = inputValidation.schemaSignIn.validate(req.body);

    if (error) {
      throw new errorResponse(error.details[0].message, 400);
    }

    const attempts = await new bruteForceProtector().checkAttempts(username);
    if (attempts >= 3) {
      throw new errorResponse(
        "too many login attempts, please try again after 15 minutes",
        429
      );
    }

    const users = await usersService.findByUsername(username);
    if (!users) {
      throw new errorResponse("Users not found", 404);
    }

    const validPassword = await new PasswordBcrypt().isPasswordValid(
      password,
      users.password
    );
    if (!validPassword) {
      throw new errorResponse("Invalid password", 401);
    }

    await new bruteForceProtector().resetFailedAttempts(username);

    const token = jwtOptions.generateToken({
      name: users.name,
      userId: users._id.toString(),
    });

    const usersId = users._id.toString();

    setSession(req, usersId, username);

    setCookie(res, "token", token);

    await redisService.setRedisValue(
      `users:${users._id}`,
      { token, username },
      60 * 60 * 24
    );

    res.status(200).json({
      success: true,
      message: "Sign in successful",
      token,
    });
  } catch (error) {
    next(error);
  }
};

const signOut = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await redisService.deleteRedisKey(`users:${req.session.usersId}`);
    await destroySession(req);
    clearCookie(res, "token");
    clearCookie(res, "connect.sid");
    res.status(200).json({
      success: true,
      message: "Sign out successful",
    });
  } catch (error) {
    next(error);
  }
};

export default {
  signUp,
  signIn,
  signOut,
};
