import type { IMiddleware } from './middleware.interface.js';
import type { NextFunction, Request, Response } from 'express';

export class AuthGuard implements IMiddleware {
	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.user) {
			return next();
		}

		res.status(401).send({ message: 'Unauthorized' });
	}
}
