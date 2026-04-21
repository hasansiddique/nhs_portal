/**
 * Vercel Serverless Function entry (Node). Catch-all under `/api/*` so `/api/trpc`, `/api/auth/*`, etc. work.
 * Run `pnpm run vercel-build` (or `nx build api`) before deploy so `dist/apps/api` exists.
 */
import fs from 'fs';
import path from 'path';
import serverless from 'serverless-http';

function loadCreateApp(): () => import('express').Express {
  const candidates = [
    path.join(__dirname, 'dist/apps/api/app.js'),
    path.join(__dirname, '../dist/apps/api/app.js'),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      return require(p).createApp;
    }
  }
  throw new Error(
    `createApp not found. Build the API first (nx build api). Tried: ${candidates.join(' | ')}`
  );
}

const app = loadCreateApp()();
export default serverless(app);
