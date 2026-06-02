import { UserRegisterDto } from './dto/user-register.dto.js';
import { UserEntity } from './user.entity.js';

export interface IUserService {
	create: (dto: UserRegisterDto) => Promise<UserEntity | null>;
	validate: (dto: UserRegisterDto) => boolean;
}
