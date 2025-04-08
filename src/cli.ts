import * as dotenv from 'dotenv';
import { program } from 'commander';
import { startServer } from './server.js';

// .envファイルの読み込み（存在する場合）
dotenv.config();

program
  .name('realestate-mcp')
  .description('不動産情報ライブラリAPIを使用するMCPサーバー')
  .version('1.0.0')
  .option('-k, --api-key <key>', '不動産情報ライブラリAPIキー')
  .option('-p, --port <number>', 'サーバーのポート番号', '3000')
  .action((options) => {
    // APIキーの優先順位: コマンドライン引数 -> 環境変数
    const apiKey = options.apiKey || process.env.REINFOLIB_API_KEY;
    const port = parseInt(options.port, 10);

    if (!apiKey) {
      console.error('エラー: APIキーが指定されていません。');
      console.error('APIキーを指定するには、--api-key オプションを使用するか、.env ファイルでREINFOLIB_API_KEYを設定してください。');
      process.exit(1);
    }

    // 環境変数にAPIキーを設定
    process.env.REINFOLIB_API_KEY = apiKey;
    
    // サーバーを起動
    startServer(port);
  });

program.parse(); 