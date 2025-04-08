import * as dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import { searchRealEstateByNaturalLanguage, searchRealEstateByParams, getMunicipalities, getUrbanPlanning } from './tools/realEstateTools.js';

// サーバーを起動する関数
export function startServer(port: number = 3000): void {
  const app = express();
  const server = createServer(app);

  // MCPサーバー機能を実装
  app.use(express.json());

  // ヘルスチェック用エンドポイント
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  // MCPメタデータエンドポイント
  app.get('/.well-known/mcp', (req, res) => {
    res.json({
      protocol_version: '0.1.0',
      display_name: '不動産情報ライブラリMCP',
      description: '国土交通省の不動産情報ライブラリAPIを使って不動産情報を検索するMCPサーバー',
      tools: [
        searchRealEstateByNaturalLanguage,
        searchRealEstateByParams,
        getMunicipalities,
        getUrbanPlanning
      ]
    });
  });

  // ツール実行エンドポイント
  app.post('/tools/:tool_name', async (req, res) => {
    const { tool_name } = req.params;
    const toolParams = req.body;

    try {
      let result;
      
      switch (tool_name) {
        case 'searchRealEstateByNaturalLanguage':
          result = await searchRealEstateByNaturalLanguage.handler(toolParams);
          break;
        case 'searchRealEstateByParams':
          result = await searchRealEstateByParams.handler(toolParams);
          break;
        case 'getMunicipalities':
          result = await getMunicipalities.handler(toolParams);
          break;
        case 'getUrbanPlanning':
          result = await getUrbanPlanning.handler(toolParams);
          break;
        default:
          return res.status(404).json({ error: `Tool ${tool_name} not found` });
      }
      
      res.json(result);
    } catch (error) {
      console.error(`Error executing tool ${tool_name}:`, error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // サーバー起動
  server.listen(port, () => {
    console.log(`不動産情報ライブラリMCPサーバーが起動しました: http://localhost:${port}`);
    console.log(`MCP情報: http://localhost:${port}/.well-known/mcp`);
  });
} 