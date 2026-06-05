import { UserModel } from '../generated/prisma/client.js';
import { UserRegisterDto } from './dto/user-register.dto.js';
import { UserEntity } from './user.entity.js';

export interface IUserService {
	create: (dto: UserRegisterDto) => Promise<UserModel | null>;
	validate: (dto: UserRegisterDto) => Promise<boolean>;
	getUser: (email: string) => Promise<UserModel | null>;
}
