import { Router, Response } from 'express';
import { IRoute } from './route.interface';
import { ILogger } from '../logger/logger.interface';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export abstract class BaseController {
	private readonly _router: Router;

	protected constructor(private logger: ILogger) {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	public created(res: Response): Response<any, Record<string, any>> {
		return res.status(201).send();
	}

	public send<T>(res: Response, code: number, message: T): Response<any, Record<string, any>> {
		return res.type('application/json').status(code).send(message);
	}

	public ok<T>(res: Response, message: T): Response<any, Record<string, any>> {
		return this.send<T>(res, 200, message);
	}

	protected bindRoutes(routes: IRoute[]): void {
		for (const route of routes) {
			const handler = route.cb.bind(this);
			const middleware = route.middlewares?.map((middleware) =>
				middleware.execute.bind(middleware),
			);
			const pipeline = middleware ? [...middleware, handler] : [handler];
			this.router[route.method](route.path, ...pipeline);
			this.logger.log(`Route [${route.method}] ${route.path}`);
		}
	}
}
