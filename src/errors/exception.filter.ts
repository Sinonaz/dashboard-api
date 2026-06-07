import type { NextFunction, Request, Response } from 'express';
import type { IExceptionFilter } from './exception.filter.interface.js';
import { HttpError } from './http-error.class.js';
import { inject, injectable } from 'inversify';
import type { ILogger } from '../logger/logger.interface.js';
import { TYPES } from '../types.js';
import 'reflect-metadata';

@injectable()
export class ExceptionFilter implements IExceptionFilter {
	constructor(@inject(TYPES.ILogger) private logger: ILogger) {}

	catch(err: Error | HttpError, req: Request, res: Response, next: NextFunction): void {
		if (err instanceof HttpError) {
			this.logger.error(`[${err.context}] Error ${err.statusCode}: ${err.message}`);
			res.status(err.statusCode).send({ message: err.message });
		} else {
			this.logger.error(`Unknown error: ${err.message}`);
			res.status(500).send({ message: err.message });
		}
	}
}
