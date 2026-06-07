import type { UserModel } from '../generated/prisma/client.js';
import type { UserRegisterDto } from './dto/user-register.dto.js';

export interface IUserService {
	create: (dto: UserRegisterDto) => Promise<UserModel | null>;
	validate: (dto: UserRegisterDto) => Promise<boolean>;
	getUser: (email: string) => Promise<UserModel | null>;
}
