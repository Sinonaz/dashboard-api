import { IMiddleware } from './middleware.interface.js';
import { NextFunction, Request, Response } from 'express';
import pkg from 'jsonwebtoken';
const { verify } = pkg;

export class AuthMiddleware implements IMiddleware {
	constructor(private readonly secret: string) {}

	async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
		if (!req.headers.authorization) {
			return next();
		}

		const token = req.headers.authorization?.split(' ')[1];
		if (!token) {
			return next();
		}

		verify(token, this.secret, (err, decoded) => {
			if (err) {
				return next();
			} else if (decoded && typeof decoded === 'object' && 'email' in decoded) {
				req.user = decoded.email;
			}
		});
		next();
	}
}
