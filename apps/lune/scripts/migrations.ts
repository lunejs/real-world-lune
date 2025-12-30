import * as path from 'path';

import { LuneMigration } from '@lunejs/core';
import { config } from 'dotenv';

const isProd = process.argv.includes('--production');
const isLocal = process.argv.includes('--local');

if (!isProd && !isLocal) {
  throw new Error('any of --production or --local arg should be included');
}

const env = {
  '.env.local.migration': isLocal,
  '.env.production.migration': isProd,
};

const [envFile] = Object.entries(env)
  .find(([_, value]) => value === true) ?? [];

config({ path: path.resolve(process.cwd(), `./scripts/${envFile}`) });

const luneMigration = new LuneMigration(process.env.DATABASE_URL as string);

luneMigration
  .runMigrations()
  .catch((err) => console.error(err))
  .finally(() => process.exit(0));
