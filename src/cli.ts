import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { program } from 'commander';
import { startServer } from './server.js';

// .envファイルの読み込み（存在する場合）
dotenv.config();

// 設定ファイルの型定義
interface McpConfig {
  apiKey?: string;
  port?: string | number;
  [key: string]: any;
}

// mcp.json設定ファイルを読み込む関数
function loadMcpConfig(configPath: string): McpConfig {
  try {
    const configFile = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(configFile);
    return config['realestate-library-mcp'] || {};
  } catch (error) {
    console.error(`設定ファイル ${configPath} の読み込みに失敗しました:`, error);
    return {};
  }
}

// 環境変数からMCP_CONFIG設定があるか確認
let envConfigPath = process.env.MCP_CONFIG;
let configFromEnv: McpConfig = {};

if (envConfigPath) {
  // 相対パスの場合は絶対パスに変換
  if (!path.isAbsolute(envConfigPath)) {
    envConfigPath = path.join(process.cwd(), envConfigPath);
  }
  
  if (fs.existsSync(envConfigPath)) {
    configFromEnv = loadMcpConfig(envConfigPath);
  }
}

program
  .name('realestate-mcp')
  .description('不動産情報ライブラリAPIを使用するMCPサーバー')
  .version('1.0.0')
  .option('-k, --api-key <key>', '不動産情報ライブラリAPIキー')
  .option('-p, --port <number>', 'サーバーのポート番号', '3000')
  .option('-c, --config <path>', 'mcp.json設定ファイルのパス')
  .action((options) => {
    let config: McpConfig = { ...configFromEnv };
    
    // コマンドラインで設定ファイルが指定されていればそれも読み込む
    if (options.config) {
      const configPath = path.isAbsolute(options.config) ? 
        options.config : 
        path.join(process.cwd(), options.config);
        
      if (fs.existsSync(configPath)) {
        config = { ...config, ...loadMcpConfig(configPath) };
      }
    }
    
    // 優先順位: コマンドライン引数 > 設定ファイル > 環境変数
    const apiKey = options.apiKey || config.apiKey || process.env.REINFOLIB_API_KEY;
    const port = parseInt(String(options.port || config.port || process.env.PORT || '3000'), 10);

    if (!apiKey) {
      console.error('エラー: APIキーが指定されていません。');
      console.error('APIキーを指定するには以下のいずれかの方法を使用してください:');
      console.error('1. --api-key オプション');
      console.error('2. mcp.jsonファイル内の設定');
      console.error('3. .env ファイルでREINFOLIB_API_KEYを設定');
      process.exit(1);
    }

    // 環境変数にAPIキーを設定
    process.env.REINFOLIB_API_KEY = apiKey;
    
    // サーバーを起動
    startServer(port);
  });

program.parse(); 