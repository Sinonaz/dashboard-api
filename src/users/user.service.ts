import { IUserService } from './user.service.interface.js';
import { UserRegisterDto } from './dto/user-register.dto.js';
import { UserEntity } from './user.entity.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types.js';
import { IConfigService } from '../config/config.service.interface.js';
import { IUsersRepository } from './users.repository.interface.js';
import { UserModel } from '../generated/prisma/client.js';
import { UserLoginDto } from './dto/user-login.dto.js';

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UsersRepository) private usersRepository: IUsersRepository,
	) {}

	async create({ name, email, password }: UserRegisterDto): Promise<UserModel | null> {
		const newUser = new UserEntity(email, name);
		const salt = this.configService.get('SALT');
		await newUser.setPassword(password, Number(salt));
		const existedUser = await this.usersRepository.findByEmail(email);

		if (existedUser) {
			return null;
		}

		return this.usersRepository.create(newUser);
	}

	async validate({ email, password }: UserLoginDto): Promise<boolean> {
		const existedUser = await this.usersRepository.findByEmail(email);

		if (!existedUser) {
			return false;
		}

		const newUser = new UserEntity(existedUser.email, existedUser.name, existedUser.password);

		return newUser.checkPassword(password);
	}

	async getUser(email: string): Promise<UserModel | null> {
		return this.usersRepository.findByEmail(email);
	}
}
