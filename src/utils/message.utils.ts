import { errorResponse } from "../error/error";

export const identifierConflict = (
  userNameExists: boolean,
  nameExists: boolean
): void => {
  if (!userNameExists && !nameExists) return;
  const message =
    userNameExists && nameExists
      ? "user already exists with this username and name"
      : userNameExists
      ? "username is already in use"
      : "name is already in use";

  throw new errorResponse(message, 409);
};

export const identifierConflictByUsersId = (
  usersId: string,
  userNameExists: string,
  nameExists: string
): void => {
  if (userNameExists !== usersId && nameExists !== usersId) return;
  const message =
    userNameExists && nameExists
      ? "user already exists with this username and name"
      : userNameExists
      ? "username is already in use"
      : "name is already in use";

  throw new errorResponse(message, 409);
};
