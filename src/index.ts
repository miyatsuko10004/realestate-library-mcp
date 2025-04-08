import * as dotenv from 'dotenv';
import { startServer } from './server.js';

// .envファイルからの環境変数読み込み
dotenv.config();

// デフォルトのポート
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// サーバーを起動
startServer(port); 