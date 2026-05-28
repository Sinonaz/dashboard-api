import { IUserService } from './user.service.interface';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserEntity } from './user.entity';
import { injectable } from 'inversify';

@injectable()
export class UserService implements IUserService {
	async create({ name, email, password }: UserRegisterDto): Promise<UserEntity | null> {
		const newUser = new UserEntity(email, name);
		await newUser.setPassword(password);

		return newUser;
	}

	validate(dto: UserRegisterDto): boolean {
		return true;
	}
}
