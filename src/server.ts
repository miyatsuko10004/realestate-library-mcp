import * as dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import {
  searchRealEstateByNaturalLanguage,
  searchRealEstateByParams,
  getMunicipalities,
  getUrbanPlanningDistrict,
  getAppraisal,
  getRealEstatePricePointData,
  getLandPricePointData,
  getLandUseZone,
  getLocationOptimizationPlan,
  getElementarySchoolDistrict,
  getJuniorHighSchoolDistrict,
  getSchool,
  getChildcareFacility,
  getMedicalFacility,
  getPopulationMesh,
  getStationPassengers,
  getLibrary,
  getDisasterHazardArea,
  getLiquefactionTendency,
} from './tools/realEstateTools.js';

// サーバーを起動する関数
export function startServer(port: number = 3000, host: string = '127.0.0.1'): void {
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
        getUrbanPlanningDistrict,
        getAppraisal,
        getRealEstatePricePointData,
        getLandPricePointData,
        getLandUseZone,
        getLocationOptimizationPlan,
        getElementarySchoolDistrict,
        getJuniorHighSchoolDistrict,
        getSchool,
        getChildcareFacility,
        getMedicalFacility,
        getPopulationMesh,
        getStationPassengers,
        getLibrary,
        getDisasterHazardArea,
        getLiquefactionTendency,
      ],
    });
  });

  // ツール実行エンドポイント
  app.post('/tools/:tool_name', async (req, res) => {
    const { tool_name } = req.params;
    const toolParams = req.body;

    try {
      let result;
      let toolDefinition;

      // 動的にツールを検索して実行
      const allTools = [
        searchRealEstateByNaturalLanguage,
        searchRealEstateByParams,
        getMunicipalities,
        getUrbanPlanningDistrict,
        getAppraisal,
        getRealEstatePricePointData,
        getLandPricePointData,
        getLandUseZone,
        getLocationOptimizationPlan,
        getElementarySchoolDistrict,
        getJuniorHighSchoolDistrict,
        getSchool,
        getChildcareFacility,
        getMedicalFacility,
        getPopulationMesh,
        getStationPassengers,
        getLibrary,
        getDisasterHazardArea,
        getLiquefactionTendency,
      ];

      toolDefinition = allTools.find(tool => tool.name === tool_name);

      if (toolDefinition) {
        result = await toolDefinition.handler(toolParams);
      } else {
        return res.status(404).json({ error: `Tool ${tool_name} not found` });
      }
      
      res.json(result);
    } catch (error) {
      console.error(`Error executing tool ${tool_name}:`, error);
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // サーバー起動
  server.listen(port, host, () => {
    console.log(`不動産情報ライブラリMCPサーバーが起動しました: http://${host}:${port}`);
    console.log(`MCP情報: http://${host}:${port}/.well-known/mcp`);
  });
} 