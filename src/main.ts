import { App } from './app.js';
import { LoggerService } from './logger/logger.service.js';
import { UserController } from './users/user.controller.js';
import { ExceptionFilter } from './errors/exception.filter.js';
import { ContainerModule, Container } from 'inversify';
import type { ILogger } from './logger/logger.interface.js';
import { TYPES } from './types.js';
import type { IExceptionFilter } from './errors/exception.filter.interface.js';
import type { IUserController } from './users/user.controller.interface.js';
import type { IUserService } from './users/user.service.interface.js';
import { UserService } from './users/user.service.js';
import { ConfigService } from './config/config.service.js';
import type { IConfigService } from './config/config.service.interface.js';
import { PrismaService } from './database/prisma.service.js';
import { UsersRepository } from './users/users.repository.js';
import type { IUsersRepository } from './users/users.repository.interface.js';

function bootstrap(): { app: App; appContainer: Container } {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	app.init();
	return { app, appContainer };
}

export const appBindings = new ContainerModule(({ bind }) => {
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
	bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
	bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter).inSingletonScope();
	bind<IUserController>(TYPES.UserController).to(UserController).inSingletonScope();
	bind<IUserService>(TYPES.UserService).to(UserService).inSingletonScope();
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<IUsersRepository>(TYPES.UsersRepository).to(UsersRepository).inSingletonScope();
	bind<App>(TYPES.Application).to(App).inSingletonScope();
});
export const { app, appContainer } = bootstrap();
