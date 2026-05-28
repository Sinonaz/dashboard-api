import { BaseController } from '../common/base.controller';
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/http-error.class';
import { ILogger } from '../logger/logger.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import 'reflect-metadata';
import { IUserController } from './user.controller.interface';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				cb: this.register,
			},
			{
				path: '/login',
				method: 'post',
				cb: this.login,
			},
		]);
	}

	login(req: Request, res: Response, next: NextFunction): void {
		// this.ok(res, { message: "Login successful" });
		next(new HttpError('Login failed', 401, 'LoginController'));
	}

	register(req: Request, res: Response, next: NextFunction): void {
		this.ok(res, { message: 'Register successful' });
	}
}
