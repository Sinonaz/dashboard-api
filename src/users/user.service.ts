import { IUserService } from './user.service.interface';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserEntity } from './user.entity';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { IConfigService } from '../config/config.service.interface';

@injectable()
export class UserService implements IUserService {
	constructor(@inject(TYPES.ConfigService) private configService: IConfigService) {}

	async create({ name, email, password }: UserRegisterDto): Promise<UserEntity | null> {
		const newUser = new UserEntity(email, name);
		const salt = this.configService.get('SALT');
		await newUser.setPassword(password, Number(salt));

		return newUser;
	}

	validate(dto: UserRegisterDto): boolean {
		return true;
	}
}
