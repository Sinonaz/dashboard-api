import { UserRegisterDto } from './dto/user-register.dto';
import { UserEntity } from './user.entity';

export interface IUserService {
	create: (dto: UserRegisterDto) => Promise<UserEntity | null>;
	validate: (dto: UserRegisterDto) => boolean;
}
