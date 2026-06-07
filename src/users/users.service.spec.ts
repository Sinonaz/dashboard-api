import 'reflect-metadata';
import { Container } from 'inversify';
import type { IConfigService } from '../config/config.service.interface.js';
import type { IUsersRepository } from './users.repository.interface.js';
import type { IUserService } from './user.service.interface.js';
import { TYPES } from '../types.js';
import { UserService } from './user.service.js';
import { jest, beforeAll, describe, it, expect } from '@jest/globals';
import type { UserEntity } from './user.entity.js';
import type { UserModel } from '../generated/prisma/client.js';

const ConfigServiceMock: IConfigService = {
	get: jest.fn<() => string>(),
};
const UsersRepositoryMock: IUsersRepository = {
	create: jest.fn<() => Promise<UserModel>>(),
	findByEmail: jest.fn<() => Promise<UserModel | null>>(),
};

const container = new Container();
let configService: IConfigService;
let usersRepository: IUsersRepository;
let userService: IUserService;
let createdUser: UserModel | null;

beforeAll(() => {
	container.bind<IUserService>(TYPES.UserService).to(UserService);
	container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
	container.bind<IUsersRepository>(TYPES.UsersRepository).toConstantValue(UsersRepositoryMock);

	configService = container.get<IConfigService>(TYPES.ConfigService);
	usersRepository = container.get<IUsersRepository>(TYPES.UsersRepository);
	userService = container.get<IUserService>(TYPES.UserService);
});

describe('User Service', () => {
	it('should createUser', async () => {
		configService.get = jest.fn<() => string>().mockReturnValueOnce('1');
		usersRepository.create = jest
			.fn<(user: UserEntity) => Promise<UserModel>>()
			.mockImplementationOnce((user: UserEntity): Promise<UserModel> => {
				return Promise.resolve({
					id: 1,
					name: user.name,
					email: user.email,
					password: user.password,
				});
			});

		createdUser = await userService.create({
			email: 'test@example.com',
			password: '1',
			name: 'Test User',
		});

		expect(createdUser?.id).toEqual(1);
		expect(createdUser?.password).not.toEqual('1');
	});

	it('should validate user with correct pass', async () => {
		usersRepository.findByEmail = jest
			.fn<() => Promise<UserModel | null>>()
			.mockReturnValueOnce(Promise.resolve(createdUser));

		const isValid = await userService.validate({
			email: 'test@example.com',
			password: '1',
		});
		expect(isValid).toBeTruthy();
	});

	it('should validate user with incorrect pass', async () => {
		usersRepository.findByEmail = jest
			.fn<() => Promise<UserModel | null>>()
			.mockReturnValueOnce(Promise.resolve(createdUser));

		const isValid = await userService.validate({
			email: 'test@example.com',
			password: 'wrong',
		});
		expect(isValid).toBeFalsy();
	});

	it('should validate user with wrong credentials', async () => {
		usersRepository.findByEmail = jest
			.fn<() => Promise<UserModel | null>>()
			.mockReturnValueOnce(Promise.resolve(null));

		const isValid = await userService.validate({
			email: 'test@example.com',
			password: '1',
		});
		expect(isValid).toBeFalsy();
	});
});
