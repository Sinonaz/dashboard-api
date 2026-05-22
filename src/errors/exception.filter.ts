import { NextFunction, Request, Response } from "express";
import { LoggerService } from "../logger/logger.service";
import { IExceptionFilter } from "./exception.filter.interface";
import { HttpError } from "./http-error.class";

export class ExceptionFilter implements IExceptionFilter {
  logger: LoggerService;

  constructor(logger: LoggerService) {
    this.logger = logger;
  }

  catch(err: Error | HttpError, req: Request, res: Response, next: NextFunction) {
    if (err instanceof HttpError) {
      this.logger.error(`[${ err.context }] Error ${ err.statusCode }: ${ err.message }`);
      res.status(err.statusCode).send({ message: err.message });
    } else {
      this.logger.error(`Unknown error: ${ err.message }`);
      res.status(500).send({ message: err.message });
    }

  }
}
