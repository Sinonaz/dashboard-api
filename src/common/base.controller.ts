import { Router, Response } from "express";
import { IRoute } from "./route.interface";
import { ILogger } from "../logger/logger.interface";
import { injectable } from "inversify";
import "reflect-metadata";

@injectable()
export abstract class BaseController {
  private readonly _router: Router;

  protected constructor(private logger: ILogger) {
    this._router = Router();
  }

  get router(): Router {
    return this._router;
  }

  public created(res: Response) {
    return res.status(201).send();
  }

  public send<T>(res: Response, code: number, message: T) {
    return res.type("application/json").status(code).send(message);
  }

  public ok<T>(res: Response, message: T) {
    return this.send<T>(res, 200, message);
  }

  protected bindRoutes(routes: IRoute[]) {
    for (const route of routes) {
      this.router[route.method](route.path, route.cb.bind(this));
      this.logger.log(`Route [${ route.method }] ${ route.path }`);
    }
  }
}
