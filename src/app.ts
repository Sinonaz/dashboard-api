import express, { Express } from "express";
import * as http from "node:http";
import { LoggerService } from "./logger/logger.service";

export class App {
  app: Express;
  port: number;
  server: http.Server;
  logger: LoggerService;

  constructor(logger: LoggerService) {
    this.app = express();
    this.port = 8000;
    this.logger = logger;
  }

  useRoutes() {

  }

  public async init() {
    this.useRoutes();
    this.server = this.app.listen(this.port);

    this.logger.log(`Server running on port ${ this.port }`);
  }
}
