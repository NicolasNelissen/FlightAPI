# FlightAPI

## Local Setup

**Requirements:**

- Node.js v22 (LTS)
- Docker (for local MongoDB)

### 1. Environment Setup

Copy the example environment file and set your secrets:

```sh
cp .env.example .env.local
```

Edit `.env.local` and set `JWT_SECRET` to a value of your choice.  
If you use a cloud-hosted database, update `MONGODB_URI` accordingly.

❗All tests assume that you are running MongoDB locally

### 2. Install Dependencies

```sh
npm install
```

### 3. Start Local MongoDB (via Docker)

Make sure Docker is running, then:

```sh
npm run start:dev:db
```

This will start a MongoDB instance on `localhost:27017`.

### 4. Run the API in Development Mode

```sh
npm run start:dev
```

---

## Useful Scripts

Your `package.json` includes several helpful scripts:

| Script                 | Description                                                |
| ---------------------- | ---------------------------------------------------------- |
| `npm run build`        | Build the project using NestJS                             |
| `npm run start`        | Start the API                                              |
| `npm run start:dev`    | Start the API in watch mode (auto-reloads on changes)      |
| `npm run start:prod`   | Start the built API (production)                           |
| `npm run start:dev:db` | Start a local MongoDB instance using Docker                |
| `npm run format`       | Format all TypeScript files using Prettier                 |
| `npm run lint`         | Lint and auto-fix code using ESLint                        |
| `npm run test`         | Run all unit tests with Jest                               |
| `npm run test:watch`   | Run tests in watch mode                                    |
| `npm run test:cov`     | Run tests and generate a coverage report                   |
| `npm run test:debug`   | Debug tests with Node.js inspector                         |
| `npm run test:e2e`     | Run end-to-end tests (see `test/jest-e2e.json` for config) |

---

## Code Quality

- **Formatting:**  
  Run `npm run format` to auto-format your codebase with Prettier.

- **Linting:**  
  Run `npm run lint` to check and auto-fix lint issues using ESLint.

- **Testing:**
  - `npm run test` for all unit tests
  - `npm run test:watch` for watch mode
  - `npm run test:cov` for coverage
  - `npm run test:e2e` for end-to-end tests

---

## Node Version

This project requires **Node.js v22 or higher**.  
To enforce this locally, you can create a `.nvmrc` file with the following content:

```
22
```

This helps ensure everyone uses the correct Node.js version.
