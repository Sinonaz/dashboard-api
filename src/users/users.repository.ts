import { inject, injectable } from 'inversify';
import { UserModel } from '../generated/prisma/client.js';
import { UserEntity } from './user.entity.js';
import { IUsersRepository } from './users.repository.interface.js';
import { TYPES } from '../types.js';
import { PrismaService } from '../database/prisma.service.js';

@injectable()
export class UsersRepository implements IUsersRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async create({ email, password, name }: UserEntity): Promise<UserModel> {
		return this.prismaService.client.userModel.create({
			data: {
				email,
				name,
				password,
			},
		});
	}

	async findByEmail(email: string): Promise<UserModel | null> {
		return this.prismaService.client.userModel.findFirst({
			where: {
				email,
			},
		});
	}
}
