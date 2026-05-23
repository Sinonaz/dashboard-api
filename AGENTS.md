# AGENTS.md — dashboard-api

## Commands

| Action | Command |
|--------|---------|
| Build | `npm run build` (=> `tsc`) |
| Run | `npm start` (=> `node ./dist/main.js`) |

No dev/watch, test, lint, format, or typecheck scripts exist. Do not attempt to run them.

## Architecture

- **Express v5** with **manual DI** wired in `src/main.ts:bootstrap()`.
- Port **8000** hardcoded in `src/app.ts`.
- Controllers extend `BaseController`, register routes via `bindRoutes(IRoute[])`.
- Error handling via `ExceptionFilter` (Express error middleware) using `HttpError` class.
- Logger: `tslog` pretty-print wrapper, injected via constructor.

## Project style (from `src/` and `.idea/codeStyles`)

- **2-space indent**, semicolons, double quotes (`"`), spaces within braces.
- Use `nodenext` module resolution (`.js` extensions in relative imports).

## Notable gaps / quirks

- No `express.json()` or `body-parser` middleware — POST `req.body` is `undefined`.
- `experimentalDecorators` / `emitDecoratorMetadata` enabled in tsconfig but **not used**.
- `dist/src/` is a stale build artifact from a prior `rootDir` config — do not edit.
- Only dev dep is `@types/express`; no test framework is installed.
- `.env` / `.env.local` are gitignored but no example file exists.
