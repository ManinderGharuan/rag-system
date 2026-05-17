import knex from 'knex';
import knexConfig from '../../db/knexfile.js';
import { env } from './env.js';

const db = knex(knexConfig[env.nodeEnv] || knexConfig.development);

export default db;
