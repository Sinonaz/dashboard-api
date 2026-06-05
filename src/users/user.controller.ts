import { BaseController } from '../common/base.controller.js';
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/http-error.class.js';
import { ILogger } from '../logger/logger.interface.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types.js';
import 'reflect-metadata';
import { IUserController } from './user.controller.interface.js';
import { UserLoginDto } from './dto/user-login.dto.js';
import { UserRegisterDto } from './dto/user-register.dto.js';
import { UserService } from './user.service.js';
import { ValidateMiddleware } from '../common/validate.middleware.js';
import pkg from 'jsonwebtoken';
const jwt = pkg;
import { IConfigService } from '../config/config.service.interface.js';
import { AuthGuard } from '../common/auth.guard.js';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.UserService) private userService: UserService,
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.ConfigService) private configService: IConfigService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				cb: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				path: '/login',
				method: 'post',
				cb: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				path: '/info',
				method: 'get',
				cb: this.info,
				middlewares: [new AuthGuard()],
			},
		]);
	}

	async login(
		{ body }: Request<unknown, unknown, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const { email, password } = body;
		const result = await this.userService.validate({ email, password });

		if (!result) {
			return next(new HttpError('Invalid credentials', 401));
		}

		const token = await this.signJWT(email, this.configService.get('JWT_SECRET'));
		this.ok(res, { message: 'Login successful', jwt: token });
	}

	async register(
		{ body }: Request<unknown, unknown, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.create(body);

		if (!result) {
			return next(new HttpError('User registration failed', 422));
		}

		this.ok(res, {
			message: 'Register successful',
			user: {
				id: result.id,
				email: result.email,
			},
		});
	}

	async info({ user: email }: Request, res: Response, next: NextFunction): Promise<void> {
		if (!email) {
			return next(new HttpError('User not found', 404));
		}

		const user = await this.userService.getUser(email);

		this.ok(res, { user });
	}

	private async signJWT(email: string, sekret: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			jwt.sign(
				{
					email,
					iat: Math.floor(Date.now() / 1000),
				},
				sekret,
				{
					algorithm: 'HS256',
				},
				(err, token) => {
					if (err) {
						reject(err);
					}

					resolve(token as string);
				},
			);
		});
	}
}
