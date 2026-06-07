import type { NextFunction, Response, Request, Router } from 'express';
import type { IMiddleware } from './middleware.interface.js';

export interface IRoute {
	path: string;
	cb: (req: Request, res: Response, next: NextFunction) => void;
	method: keyof Pick<Router, 'get' | 'post' | 'put' | 'delete' | 'patch'>;
	middlewares?: IMiddleware[];
}
