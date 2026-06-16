import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import * as dotenv from 'dotenv';
import {
  getRealEstateData,
  getPrefectureMunicipalities,
  getUrbanPlanningArea,
  parseNaturalLanguageQuery,
  getAppraisalData,
  getRealEstatePricePoints,
  getLandPricePoints,
  getLandUseZoneData,
  getLocationOptimizationPlanData,
  getElementarySchoolDistrictData,
  getJuniorHighSchoolDistrictData,
  getSchoolData,
  getChildcareFacilityData,
  getMedicalFacilityData,
  getPopulationMeshData,
  getStationPassengersData,
  getLibraryData,
  getDisasterHazardAreaData,
  getLiquefactionTendencyData,
} from './services/realEstateService.js';

dotenv.config();

const xyzSchema = {
  response_format: z.enum(['geojson', 'pbf']).describe('レスポンス形式'),
  z: z.number().describe('ズームレベル'),
  x: z.number().describe('タイル座標のX値'),
  y: z.number().describe('タイル座標のY値'),
};

const xyzYearSchema = {
  ...xyzSchema,
  year: z.string().optional().describe('年度（YYYY形式）'),
};

export async function startServer(): Promise<void> {
  const server = new McpServer({
    name: '不動産情報ライブラリMCP',
    version: '1.0.2',
  });

  server.tool(
    'searchRealEstateByNaturalLanguage',
    '自然言語による検索クエリから不動産情報を検索します。例: 「東京都新宿区の2022年の物件情報を5件取得」',
    { query: z.string().describe('検索したい不動産情報を自然言語で指定してください') },
    async ({ query }) => {
      const params = parseNaturalLanguageQuery(query);
      const results = await getRealEstateData(params);
      return {
        content: [{ type: 'text', text: JSON.stringify({ count: results.length, query, parameters: params, results }, null, 2) }],
      };
    }
  );

  server.tool(
    'searchRealEstateByParams',
    '特定のパラメータを指定して不動産情報を検索します',
    {
      prefecture: z.string().optional().describe('都道府県コード (例: 13 = 東京都)'),
      city: z.string().optional().describe('市区町村コード'),
      from: z.string().optional().describe('検索期間（開始）YYYY-Q[1-4] 例: 2020-1'),
      to: z.string().optional().describe('検索期間（終了）YYYY-Q[1-4] 例: 2020-4'),
      minTradePrice: z.string().optional().describe('最低取引価格（円）'),
      maxTradePrice: z.string().optional().describe('最高取引価格（円）'),
      area: z.string().optional().describe('面積（平方メートル）'),
      keywords: z.string().optional().describe('キーワード（地区名、住所など）'),
      limit: z.number().optional().describe('取得件数制限'),
    },
    async (params) => {
      if (Object.keys(params).length === 0) {
        throw new Error('少なくとも1つのパラメータを指定してください');
      }
      const results = await getRealEstateData(params);
      return {
        content: [{ type: 'text', text: JSON.stringify({ count: results.length, parameters: params, results }, null, 2) }],
      };
    }
  );

  server.tool(
    'getMunicipalities',
    '指定した都道府県の市区町村一覧を取得します',
    { prefectureCode: z.string().describe('都道府県コード (例: 13 = 東京都)') },
    async ({ prefectureCode }) => {
      const result = await getPrefectureMunicipalities(prefectureCode);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    'getUrbanPlanningDistrict',
    '都市計画決定GISデータ（都市計画区域/区域区分）をXYZタイル座標で取得します',
    xyzSchema,
    async ({ z: zoom, x, y }) => {
      const result = await getUrbanPlanningArea(zoom, x, y);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    'getAppraisal',
    '鑑定評価書情報を検索します',
    {
      id: z.string().optional().describe('鑑定評価書ID'),
      prefecture: z.string().optional().describe('都道府県コード'),
      city: z.string().optional().describe('市区町村コード'),
      keywords: z.string().optional().describe('キーワード'),
      limit: z.number().optional().describe('取得件数制限'),
    },
    async (params) => {
      const result = await getAppraisalData(params);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    'getRealEstatePricePointData',
    '不動産価格（取引価格・成約価格）情報のポイント（点）をXYZタイル座標で取得します',
    xyzSchema,
    async (params) => {
      const result = await getRealEstatePricePoints(params);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    'getLandPricePointData',
    '地価公示・地価調査のポイント（点）をXYZタイル座標で取得します',
    {
      ...xyzSchema,
      type: z.string().optional().describe('情報種別'),
      prefecture: z.string().optional().describe('都道府県コード'),
      city: z.string().optional().describe('市区町村コード'),
      year: z.string().optional().describe('年度（YYYY形式）'),
    },
    async (params) => {
      const result = await getLandPricePoints(params);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    'getLandUseZone',
    '都市計画決定GISデータ（用途地域）をXYZタイル座標で取得します',
    xyzYearSchema,
    async (params) => {
      const result = await getLandUseZoneData(params);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    'getLocationOptimizationPlan',
    '都市計画決定GISデータ（立地適正化計画）をXYZタイル座標で取得します',
    xyzYearSchema,
    async (params) => {
      const result = await getLocationOptimizationPlanData(params);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    'getElementarySchoolDistrict',
    '国土数値情報（小学校区）をXYZタイル座標で取得します',
    xyzYearSchema,
    async (params) => {
      const result = await getElementarySchoolDistrictData(params);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    'getJuniorHighSchoolDistrict',
    '国土数値情報（中学校区）をXYZタイル座標で取得します',
    xyzYearSchema,
    async (params) => {
      const result = await getJuniorHighSchoolDistrictData(params);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    'getSchool',
    '国土数値情報（学校）をXYZタイル座標で取得します',
    xyzYearSchema,
    async (params) => {
      const result = await getSchoolData(params);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    'getChildcareFacility',
    '国土数値情報（保育園・幼稚園等）をXYZタイル座標で取得します',
    xyzYearSchema,
    async (params) => {
      const result = await getChildcareFacilityData(params);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    'getMedicalFacility',
    '国土数値情報（医療機関）をXYZタイル座標で取得します',
    xyzYearSchema,
    async (params) => {
      const result = await getMedicalFacilityData(params);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    'getPopulationMesh',
    '国土数値情報（将来推計人口250mメッシュ）をXYZタイル座標で取得します',
    {
      ...xyzSchema,
      year: z.string().optional().describe('予測年（YYYY形式）'),
      type: z.string().optional().describe('人口タイプ'),
    },
    async (params) => {
      const result = await getPopulationMeshData(params);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    'getStationPassengers',
    '国土数値情報（駅別乗降客数）をXYZタイル座標で取得します',
    {
      ...xyzSchema,
      company_type: z.string().optional().describe('事業者種別'),
      year: z.string().optional().describe('年度（YYYY形式）'),
    },
    async (params) => {
      const result = await getStationPassengersData(params);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    'getLibrary',
    '国土数値情報（図書館）をXYZタイル座標で取得します',
    xyzYearSchema,
    async (params) => {
      const result = await getLibraryData(params);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    'getDisasterHazardArea',
    '国土数値情報（災害危険区域）をXYZタイル座標で取得します',
    xyzYearSchema,
    async (params) => {
      const result = await getDisasterHazardAreaData(params);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    'getLiquefactionTendency',
    '国土交通省都市局（地形区分に基づく液状化の発生傾向図）をXYZタイル座標で取得します',
    xyzSchema,
    async (params) => {
      const result = await getLiquefactionTendencyData(params);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);
}
