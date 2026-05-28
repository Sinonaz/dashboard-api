import { NextFunction, Response, Request, Router } from 'express';

export interface IRoute {
	path: string;
	cb: (req: Request, res: Response, next: NextFunction) => void;
	method: keyof Pick<Router, 'get' | 'post' | 'put' | 'delete' | 'patch'>;
}
