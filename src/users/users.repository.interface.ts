import type { UserModel } from '../generated/prisma/client.js';
import type { UserEntity } from './user.entity.js';

export interface IUsersRepository {
	create: (user: UserEntity) => Promise<UserModel>;
	findByEmail: (email: string) => Promise<UserModel | null>;
}
