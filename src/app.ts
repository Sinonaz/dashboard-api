import express, { Express } from 'express';
import * as http from 'node:http';
import { UserController } from './users/user.controller.js';
import { ILogger } from './logger/logger.interface.js';
import { inject, injectable } from 'inversify';
import { TYPES } from './types.js';
import 'reflect-metadata';
import { IConfigService } from './config/config.service.interface.js';
import { IExceptionFilter } from './errors/exception.filter.interface.js';
import { PrismaService } from './database/prisma.service.js';
import { AuthMiddleware } from "./common/auth.middleware.js";

@injectable()
export class App {
	app: Express;
	port: number;
	server: http.Server;

	constructor(
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.UserController) private userController: UserController,
		@inject(TYPES.ExceptionFilter) private readonly exceptionFilter: IExceptionFilter,
		@inject(TYPES.ConfigService) private configService: IConfigService,
	) {
		this.app = express();
		this.port = Number(this.configService.get('PORT'));
	}

	useMiddleware(): void {
		const authMiddleware = new AuthMiddleware(this.configService.get('JWT_SECRET'));

		this.app.use(express.json());
		this.app.use(authMiddleware.execute.bind(authMiddleware))
	}

	useRoutes(): void {
		this.app.use('/users', this.userController.router);
	}

	useExceptionFilters(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		await this.prismaService.connect();
		this.useRoutes();
		this.useExceptionFilters();
		this.server = this.app.listen(this.port);

		this.logger.log(`Server running on port ${this.port}`);
	}
}
