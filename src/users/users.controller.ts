import { BaseController } from "../common/base.controller";
import { LoggerService } from "../logger/logger.service";
import { NextFunction, Request, Response } from "express";

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
    this.ok(res, { message: "Login successful" });
  }

  register(req: Request, res: Response, next: NextFunction) {
    this.ok(res, { message: "Register successful" });
  }
}
