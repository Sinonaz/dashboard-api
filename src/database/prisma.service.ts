import { inject, injectable } from 'inversify';
import { TYPES } from '../types.js';
import type { ILogger } from '../logger/logger.interface.js';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import type { PrismaClient as PrismaClientT } from '../generated/prisma/internal/class.js';
import { PrismaClient } from '../generated/prisma/client.js';

@injectable()
export class PrismaService {
	client: PrismaClientT;

	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
		const adapter = new PrismaBetterSqlite3({
			url: process.env.DATABASE_URL ?? 'file:./dev.db',
		});

		this.client = new PrismaClient({ adapter });
	}

	async connect(): Promise<void> {
		try {
			await this.client.$connect();
			this.logger.log('Connected to database successfully');
		} catch (e) {
			this.logger.error('Error connecting to database', e);
		}
	}

	async disconnect(): Promise<void> {
		await this.client.$disconnect();
	}
}
