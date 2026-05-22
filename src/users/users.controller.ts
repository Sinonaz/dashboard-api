import { BaseController } from "../common/base.controller";
import { LoggerService } from "../logger/logger.service";
import { NextFunction, Request, Response } from "express";
import { HttpError } from "../errors/http-error.class";

export class UsersController extends BaseController {

  constructor(logger: LoggerService) {
    super(logger);
    this.bindRoutes([
      {
        path: "/register",
        method: "post",
        cb: this.register,
      },
      {
        path: "/login",
        method: "post",
        cb: this.login,
      }
    ]);
  }

  login(req: Request, res: Response, next: NextFunction) {
    // this.ok(res, { message: "Login successful" });
    next(new HttpError("Login failed", 401, "LoginController"));
  }

  register(req: Request, res: Response, next: NextFunction) {
    this.ok(res, { message: "Register successful" });
  }
}
