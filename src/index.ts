import * as dotenv from 'dotenv';
import { startServer } from './server.js';

dotenv.config();

startServer().catch((error) => {
  console.error('サーバーの起動に失敗しました:', error);
  process.exit(1);
});
