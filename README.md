# Trident Leasing — Staff Platform

A React + TypeScript + Vite frontend with an Express + PostgreSQL backend providing JWT-based authentication.

## Architecture

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite |
| Backend API | Express 4, Node.js (ESM) |
| Database | PostgreSQL (via `pg`) |
| Auth | bcrypt password hashing + JWT tokens |

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
# Edit .env — set DATABASE_URL and JWT_SECRET at minimum
```

### 3. Start the API server

The server creates the `users` table automatically on first run.

```bash
npm run dev:server
# API available at http://localhost:3001
```

### 4. Start the Vite dev server

```bash
npm run dev
# Frontend available at http://localhost:5173
# /api requests are proxied to the Express server
```

## API endpoints

| Method | Path | Auth required | Description |
|--------|------|---------------|-------------|
| `POST` | `/api/register` | No | Register a new user |
| `POST` | `/api/login` | No | Login, returns JWT |
| `GET` | `/api/dashboard` | Yes (Bearer JWT) | Returns user info |
| `GET` | `/api/health` | No | Health check |

### Request / response examples

**POST /api/register** and **POST /api/login**
```json
// Request body
{ "email": "user@example.com", "password": "mypassword" }

// 200/201 response
{ "token": "<jwt>", "user": { "id": 1, "email": "user@example.com", "created_at": "..." } }
```

**GET /api/dashboard** — requires `Authorization: Bearer <token>` header
```json
{ "user": { "id": 1, "email": "...", "created_at": "..." }, "message": "Welcome back, user@example.com!" }
```

## Production build

```bash
npm run build   # Compiles TypeScript + bundles frontend to dist/
npm start       # Starts the Express API server
```

Serve the `dist/` folder from Express or a CDN, and point `CLIENT_ORIGIN` to your frontend URL.

---

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
