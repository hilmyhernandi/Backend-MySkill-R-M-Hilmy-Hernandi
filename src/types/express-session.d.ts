import "express-session";

declare module "express-session" {
  interface SessionData {
    usersId: string;
    username: string;
  }
}
