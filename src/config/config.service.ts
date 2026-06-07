import { config } from 'dotenv';
import type { DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import type { IConfigService } from './config.service.interface.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types.js';
import type { ILogger } from '../logger/logger.interface.js';

@injectable()
export class ConfigService implements IConfigService {
	private readonly config: DotenvParseOutput;

	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
		const result: DotenvConfigOutput = config();

		if (result.error) {
			this.logger.error('Cannot load .env file');
		} else {
			this.logger.log('Loaded .env file');
			this.config = result.parsed as DotenvParseOutput;
		}
	}

	get(key: string): string {
		return this.config[key];
	}
}
