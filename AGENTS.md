# AGENTS.md — dashboard-api

## Commands

| Action | Command |
|--------|---------|
| Build | `npm run build` (=> `tsc`) |
| Run (prod) | `npm start` (=> `node ./dist/main.js`) |
| Dev | `npm run dev` (=> `nodemon --exec tsx ./src/main.ts`) |
| Dev + debug | `npm run dev:inspect` (=> `nodemon` + `tsx --inspect=localhost:9229`) |
| Lint | `npm run lint` (=> `eslint ./src`) |
| Lint fix | `npm run lint:fix` (=> `eslint ./src --fix`) |
| Prisma generate | `npm run generate` (=> `prisma generate`) |

No test, format, or typecheck scripts exist. Do not attempt to run them.

## Architecture

- **Express v5** with **InversifyJS** DI container wired in `src/main.ts:bootstrap()`.
  - Bindings defined in `appBindings` (`ContainerModule`), all singletons.
  - Decorators (`@injectable()`, `@inject()`) used throughout — requires `reflect-metadata` import.
- Symbol-based tokens in `src/types.ts` (e.g. `TYPES.Application`, `TYPES.ILogger`).
- Port read from `ConfigService` (`configService.get('PORT')`) — not hardcoded.
- Controllers extend `BaseController`, register routes via `bindRoutes(IRoute[])`.
- Error handling via `ExceptionFilter` (Express error middleware) using `HttpError` class.
- Logger: `tslog` pretty-print wrapper (`LoggerService`), injected via constructor.
- **Prisma** (SQLite) for persistence — managed by `PrismaService` (singleton, `connect()` on init).
- **JWT auth** via `AuthMiddleware` — verifies Bearer token on every request, sets `req.user`.
- Request validation via `ValidateMiddleware` using `class-validator` decorators on DTOs.

### Directory map

```
src/
  main.ts           — bootstrap(), DI container setup
  app.ts            — Express app, middleware/routes/filters wiring
  types.ts          — DI token symbols
  common/           — BaseController, AuthMiddleware, ValidateMiddleware, IRoute, IMiddleware
  config/           — ConfigService (reads .env via dotenv)
  database/         — PrismaService
  errors/           — HttpError, ExceptionFilter
  http/             — .http files for manual endpoint testing
  logger/           — ILogger, LoggerService (tslog wrapper)
  users/            — UserController, UserService, UsersRepository, UserEntity, DTOs
  generated/prisma/ — Prisma client output (gitignored)
prisma/
  schema.prisma     — UserModel (id, email, password, name), SQLite datasource
```

## Project style (from `.prettierrc` / `eslint.config.mjs`)

- **Tabs** for indentation, semicolons, **single quotes** (`'`), spaces within braces.
- `printWidth: 100`, trailing commas (`all`).
- Use `nodenext` module resolution (`.js` extensions in relative imports).
- ESLint enforces Prettier formatting + TypeScript recommended rules.

## Notable gaps / quirks

- `experimentalDecorators` / `emitDecoratorMetadata` enabled in tsconfig — **used** by Inversify decorators.
- `.env` / `.env.local` are gitignored but no example file exists.
- `dist/src/` is a stale build artifact from a prior `rootDir` config — do not edit. Current `rootDir` is `./src`.
- Prisma client output goes to `src/generated/prisma/` (gitignored) — must run `npm run generate` after schema changes.
- SQLite database file `dev.db` is gitignored.
- No migration or seed scripts defined.
