import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import * as dotenv from 'dotenv';
import {
  getRealEstateData,
  getMunicipalitiesData,
  getAppraisalData,
  getRealEstatePricePoints,
  getLandPricePoints,
  getUrbanPlanningDistrictData,
  getLandUseZoneData,
  getLocationOptimizationPlanData,
  getElementarySchoolDistrictData,
  getJuniorHighSchoolDistrictData,
  getSchoolData,
  getChildcareFacilityData,
  getMedicalFacilityData,
  getWelfareFacilityData,
  getPopulationMeshData,
  getFirePreventionZoneData,
  getStationPassengersData,
  getDisasterHazardAreaData,
  getLibraryData,
  getMunicipalOfficeData,
  getNaturalParkData,
  getLargeFilledLandData,
  getLandslidePreventionData,
  getSteepSlopeHazardData,
  getDistrictPlanData,
  getHighDensityUtilizationData,
  getLiquefactionTendencyData,
  getFloodInundationData,
  getStormSurgeInundationData,
  getTsunamiInundationData,
  getSedimentDisasterHazardData,
  getUrbanPlanningRoadData,
  getDensityPopulationData,
  getEmergencyEvacuationSiteData,
  getDisasterHistoryData,
} from './services/realEstateService.js';

dotenv.config();

const xyzSchema = {
  response_format: z.enum(['geojson', 'pbf']).describe('レスポンス形式'),
  z: z.number().int().describe('ズームレベル'),
  x: z.number().int().describe('タイル座標X値'),
  y: z.number().int().describe('タイル座標Y値'),
};

function toJson(data: unknown): string {
  return JSON.stringify(data, null, 2);
}

export async function startServer(): Promise<void> {
  const server = new McpServer({
    name: '不動産情報ライブラリMCP',
    version: '2.0.0',
  });

  // ─── XIT001: 不動産価格（取引価格・成約価格）情報取得 ───────────────────
  server.tool(
    'getRealEstatePrice',
    '不動産価格（取引価格・成約価格）情報を取得します。year/quarterと、area・city・stationのいずれか1つが必須です。',
    {
      year: z.string().describe('取引年 YYYY形式 (取引価格は2005年以降、成約価格は2021年以降)'),
      quarter: z.string().describe('四半期 1～4'),
      area: z.string().optional().describe('都道府県コード 2桁 (例: 13=東京都)。city/stationと排他ではなく組み合わせ可'),
      city: z.string().optional().describe('市区町村コード 5桁'),
      station: z.string().optional().describe('駅コード 6桁'),
      priceClassification: z.string().optional().describe('価格区分 01=取引価格のみ, 02=成約価格のみ, 未指定=両方'),
      language: z.string().optional().describe('出力言語 ja=日本語, en=英語'),
    },
    async (params) => {
      const result = await getRealEstateData(params as any);
      return { content: [{ type: 'text', text: toJson(result) }] };
    }
  );

  // ─── XIT002: 都道府県内市区町村一覧取得 ────────────────────────────────
  server.tool(
    'getMunicipalities',
    '指定した都道府県の市区町村一覧を取得します',
    {
      area: z.string().describe('都道府県コード 2桁 (例: 13=東京都)'),
      language: z.string().optional().describe('出力言語 ja=日本語, en=英語'),
    },
    async (params) => {
      const result = await getMunicipalitiesData(params);
      return { content: [{ type: 'text', text: toJson(result) }] };
    }
  );

  // ─── XCT001: 鑑定評価書情報 ────────────────────────────────────────────
  server.tool(
    'getAppraisal',
    '鑑定評価書情報を取得します。year・area・divisionがすべて必須です。',
    {
      year: z.string().describe('価格時点 YYYY形式 (2022-2026)'),
      area: z.string().describe('都道府県コード 2桁 (複数指定時はカンマ区切り)'),
      division: z.string().describe('用途区分 2桁: 00=住宅地, 03=宅地見込地, 05=商業地, 07=準工業地, 09=工業地, 10=調整区域内宅地, 13=現況林地, 20=林地'),
    },
    async (params) => {
      const result = await getAppraisalData(params);
      return { content: [{ type: 'text', text: toJson(result) }] };
    }
  );

  // ─── XPT001: 不動産価格（取引価格・成約価格）情報のポイント ──────────────
  server.tool(
    'getRealEstatePricePoints',
    '不動産価格（取引価格・成約価格）情報のポイントをXYZタイル座標で取得します。from/toはYYYYN形式（例: 20201）。',
    {
      ...xyzSchema,
      from: z.string().describe('取引時期From YYYYN形式 (例: 20201 = 2020年第1四半期)'),
      to: z.string().describe('取引時期To YYYYN形式 (例: 20204 = 2020年第4四半期)'),
      priceClassification: z.string().optional().describe('価格情報区分 01=取引価格, 02=成約価格'),
      landTypeCode: z.string().optional().describe('種類コード 01/02/07/10/11 カンマ区切りで複数指定可'),
    },
    async (params) => {
      const result = await getRealEstatePricePoints(params as any);
      return { content: [{ type: 'text', text: toJson(result) }] };
    }
  );

  // ─── XPT002: 地価公示・地価調査のポイント ──────────────────────────────
  server.tool(
    'getLandPricePoints',
    '地価公示・地価調査のポイントをXYZタイル座標で取得します。yearは必須です。',
    {
      ...xyzSchema,
      year: z.string().describe('対象年 NNNN形式 (1995-2024)'),
      priceClassification: z.string().optional().describe('地価情報区分 0/1'),
      useCategoryCode: z.string().optional().describe('用途区分 00/03/05/07/09/10/13/20 カンマ区切りで複数指定可'),
    },
    async (params) => {
      const result = await getLandPricePoints(params as any);
      return { content: [{ type: 'text', text: toJson(result) }] };
    }
  );

  // ─── XKT001: 都市計画決定GISデータ（都市計画区域/区域区分） ──────────────
  server.tool(
    'getUrbanPlanningDistrict',
    '都市計画決定GISデータ（都市計画区域/区域区分）をXYZタイル座標で取得します',
    xyzSchema,
    async (params) => {
      const result = await getUrbanPlanningDistrictData(params);
      return { content: [{ type: 'text', text: toJson(result) }] };
    }
  );

  // ─── XKT002: 都市計画決定GISデータ（用途地域） ─────────────────────────
  server.tool(
    'getLandUseZone',
    '都市計画決定GISデータ（用途地域）をXYZタイル座標で取得します',
    xyzSchema,
    async (params) => {
      const result = await getLandUseZoneData(params);
      return { content: [{ type: 'text', text: toJson(result) }] };
    }
  );

  // ─── XKT003: 都市計画決定GISデータ（立地適正化計画） ────────────────────
  server.tool(
    'getLocationOptimizationPlan',
    '都市計画決定GISデータ（立地適正化計画）をXYZタイル座標で取得します',
    xyzSchema,
    async (params) => {
      const result = await getLocationOptimizationPlanData(params);
      return { content: [{ type: 'text', text: toJson(result) }] };
    }
  );

  // ─── XKT004: 国土数値情報（小学校区） ──────────────────────────────────
  server.tool(
    'getElementarySchoolDistrict',
    '国土数値情報（小学校区）をXYZタイル座標で取得します',
    xyzSchema,
    async (params) => {
      const result = await getElementarySchoolDistrictData(params);
      return { content: [{ type: 'text', text: toJson(result) }] };
    }
  );

  // ─── XKT005: 国土数値情報（中学校区） ──────────────────────────────────
  server.tool(
    'getJuniorHighSchoolDistrict',
    '国土数値情報（中学校区）をXYZタイル座標で取得します',
    xyzSchema,
    async (params) => {
      const result = await getJuniorHighSchoolDistrictData(params);
      return { content: [{ type: 'text', text: toJson(result) }] };
    }
  );

  // ─── XKT006: 国土数値情報（学校） ──────────────────────────────────────
  server.tool(
    'getSchool',
    '国土数値情報（学校）をXYZタイル座標で取得します',
    xyzSchema,
    async (params) => {
      const result = await getSchoolData(params);
      return { content: [{ type: 'text', text: toJson(result) }] };
    }
  );

  // ─── XKT007: 国土数値情報（保育園・幼稚園等） ───────────────────────────
  server.tool(
    'getChildcareFacility',
    '国土数値情報（保育園・幼稚園等）をXYZタイル座標で取得します',
    xyzSchema,
    async (params) => {
      const result = await getChildcareFacilityData(params);
      return { content: [{ type: 'text', text: toJson(result) }] };
    }
  );

  // ─── XKT010: 国土数値情報（医療機関） ──────────────────────────────────
  server.tool(
    'getMedicalFacility',
    '国土数値情報（医療機関）をXYZタイル座標で取得します',
    xyzSchema,
    async (params) => {
      const result = await getMedicalFacilityData(params);
      return { content: [{ type: 'text', text: toJson(result) }] };
    }
  );

  // ─── XKT011: 国土数値情報（福祉施設） ──────────────────────────────────
  server.tool(
    'getWelfareFacility',
    '国土数値情報（福祉施設）をXYZタイル座標で取得します',
    {
      ...xyzSchema,
      administrativeAreaCode: z.string().optional().describe('行政区域コード 5桁 (カンマ区切りで複数指定可)'),
      welfareFacilityClassCode: z.string().optional().describe('大分類コード 2桁 (カンマ区切りで複数指定可)'),
      welfareFacilityMiddleClassCode: z.string().optional().describe('中分類コード 4桁 (カンマ区切りで複数指定可)'),
      welfareFacilityMinorClassCode: z.string().optional().describe('小分類コード 6桁 (カンマ区切りで複数指定可)'),
    },
    async (params) => {
      const result = await getWelfareFacilityData(params);
      return { content: [{ type: 'text', text: toJson(result) }] };
    }
  );

  // ─── XKT013: 国土数値情報（将来推計人口250mメッシュ） ────────────────────
  server.tool(
    'getPopulationMesh',
    '国土数値情報（将来推計人口250mメッシュ）をXYZタイル座標で取得します',
    xyzSchema,
    async (params) => {
      const result = await getPopulationMeshData(params);
      return { content: [{ type: 'text', text: toJson(result) }] };
    }
  );

  // ─── XKT014: 都市計画決定GISデータ（防火・準防火地域） ───────────────────
  server.tool(
    'getFirePreventionZone',
    '都市計画決定GISデータ（防火・準防火地域）をXYZタイル座標で取得します',
    xyzSchema,
    async (params) => {
      const result = await getFirePreventionZoneData(params);
      return { content: [{ type: 'text', text: toJson(result) }] };
    }
  );

  // ─── XKT015: 国土数値情報（駅別乗降客数） ──────────────────────────────
  server.tool(
    'getStationPassengers',
    '国土数値情報（駅別乗降客数）をXYZタイル座標で取得します',
    xyzSchema,
    async (params) => {
      const result = await getStationPassengersData(params);
      return { content: [{ type: 'text', text: toJson(result) }] };
    }
  );

  // ─── XKT016: 国土数値情報（災害危険区域） ──────────────────────────────
  server.tool(
    'getDisasterHazardArea',
    '国土数値情報（災害危険区域）をXYZタイル座標で取得します',
    xyzSchema,
    async (params) => {
      const result = await getDisasterHazardAreaData(params);
      return { content: [{ type: 'text', text: toJson(result) }] };
    }
  );

  // ─── XKT017: 国土数値情報（図書館） ────────────────────────────────────
  server.tool(
    'getLibrary',
    '国土数値情報（図書館）をXYZタイル座標で取得します',
    xyzSchema,
    async (params) => {
      const result = await getLibraryData(params);
      return { content: [{ type: 'text', text: toJson(result) }] };
    }
  );

  // ─── XKT018: 国土数値情報（市区町村役場及び集会施設等） ─────────────────
  server.tool(
    'getMunicipalOffice',
    '国土数値情報（市区町村役場及び集会施設等）をXYZタイル座標で取得します',
    xyzSchema,
    async (params) => {
      const result = await getMunicipalOfficeData(params);
      return { content: [{ type: 'text', text: toJson(result) }] };
    }
  );

  // ─── XKT019: 国土数値情報（自然公園地域） ──────────────────────────────
  server.tool(
    'getNaturalPark',
    '国土数値情報（自然公園地域）をXYZタイル座標で取得します',
    {
      ...xyzSchema,
      prefectureCode: z.string().optional().describe('都道府県コード 1～47 (カンマ区切りで複数指定可)'),
      districtCode: z.string().optional().describe('地区コード (カンマ区切りで複数指定可)'),
    },
    async (params) => {
      const result = await getNaturalParkData(params);
      return { content: [{ type: 'text', text: toJson(result) }] };
    }
  );

  // ─── XKT020: 国土数値情報（大規模盛土造成地マップ） ─────────────────────
  server.tool(
    'getLargeFilledLand',
    '国土数値情報（大規模盛土造成地マップ）をXYZタイル座標で取得します',
    xyzSchema,
    async (params) => {
      const result = await getLargeFilledLandData(params);
      return { content: [{ type: 'text', text: toJson(result) }] };
    }
  );

  // ─── XKT021: 国土数値情報（地すべり防止地区） ───────────────────────────
  server.tool(
    'getLandslidePreventionArea',
    '国土数値情報（地すべり防止地区）をXYZタイル座標で取得します',
    {
      ...xyzSchema,
      prefectureCode: z.string().optional().describe('都道府県コード 2桁 (カンマ区切りで複数指定可)'),
      administrativeAreaCode: z.string().optional().describe('行政コード 5桁 (カンマ区切りで複数指定可)'),
    },
    async (params) => {
      const result = await getLandslidePreventionData(params);
      return { content: [{ type: 'text', text: toJson(result) }] };
    }
  );

  // ─── XKT022: 国土数値情報（急傾斜地崩壊危険区域） ─────────────────────
  server.tool(
    'getSteepSlopeHazardArea',
    '国土数値情報（急傾斜地崩壊危険区域）をXYZタイル座標で取得します',
    {
      ...xyzSchema,
      prefectureCode: z.string().optional().describe('都道府県コード 2桁 (カンマ区切りで複数指定可)'),
      administrativeAreaCode: z.string().optional().describe('行政コード 5桁 (カンマ区切りで複数指定可)'),
    },
    async (params) => {
      const result = await getSteepSlopeHazardData(params);
      return { content: [{ type: 'text', text: toJson(result) }] };
    }
  );

  // ─── XKT023: 都市計画決定GISデータ（地区計画） ─────────────────────────
  server.tool(
    'getDistrictPlan',
    '都市計画決定GISデータ（地区計画）をXYZタイル座標で取得します',
    xyzSchema,
    async (params) => {
      const result = await getDistrictPlanData(params);
      return { content: [{ type: 'text', text: toJson(result) }] };
    }
  );

  // ─── XKT024: 都市計画決定GISデータ（高度利用地区） ─────────────────────
  server.tool(
    'getHighDensityUtilizationArea',
    '都市計画決定GISデータ（高度利用地区）をXYZタイル座標で取得します',
    xyzSchema,
    async (params) => {
      const result = await getHighDensityUtilizationData(params);
      return { content: [{ type: 'text', text: toJson(result) }] };
    }
  );

  // ─── XKT025: 地形区分に基づく液状化の発生傾向図 ─────────────────────────
  server.tool(
    'getLiquefactionTendency',
    '国土交通省都市局（地形区分に基づく液状化の発生傾向図）をXYZタイル座標で取得します',
    xyzSchema,
    async (params) => {
      const result = await getLiquefactionTendencyData(params);
      return { content: [{ type: 'text', text: toJson(result) }] };
    }
  );

  // ─── XKT026: 国土数値情報（洪水浸水想定区域（想定最大規模）） ──────────
  server.tool(
    'getFloodInundationArea',
    '国土数値情報（洪水浸水想定区域（想定最大規模））をXYZタイル座標で取得します',
    xyzSchema,
    async (params) => {
      const result = await getFloodInundationData(params);
      return { content: [{ type: 'text', text: toJson(result) }] };
    }
  );

  // ─── XKT027: 国土数値情報（高潮浸水想定区域） ─────────────────────────
  server.tool(
    'getStormSurgeInundationArea',
    '国土数値情報（高潮浸水想定区域）をXYZタイル座標で取得します',
    xyzSchema,
    async (params) => {
      const result = await getStormSurgeInundationData(params);
      return { content: [{ type: 'text', text: toJson(result) }] };
    }
  );

  // ─── XKT028: 国土数値情報（津波浸水想定） ──────────────────────────────
  server.tool(
    'getTsunamiInundationArea',
    '国土数値情報（津波浸水想定）をXYZタイル座標で取得します',
    xyzSchema,
    async (params) => {
      const result = await getTsunamiInundationData(params);
      return { content: [{ type: 'text', text: toJson(result) }] };
    }
  );

  // ─── XKT029: 国土数値情報（土砂災害警戒区域） ─────────────────────────
  server.tool(
    'getSedimentDisasterHazardArea',
    '国土数値情報（土砂災害警戒区域）をXYZタイル座標で取得します',
    xyzSchema,
    async (params) => {
      const result = await getSedimentDisasterHazardData(params);
      return { content: [{ type: 'text', text: toJson(result) }] };
    }
  );

  // ─── XKT030: 都市計画決定GISデータ（都市計画道路） ─────────────────────
  server.tool(
    'getUrbanPlanningRoad',
    '都市計画決定GISデータ（都市計画道路）をXYZタイル座標で取得します',
    xyzSchema,
    async (params) => {
      const result = await getUrbanPlanningRoadData(params);
      return { content: [{ type: 'text', text: toJson(result) }] };
    }
  );

  // ─── XKT031: 国土数値情報（人口集中地区） ──────────────────────────────
  server.tool(
    'getDensityPopulationArea',
    '国土数値情報（人口集中地区）をXYZタイル座標で取得します',
    {
      ...xyzSchema,
      administrativeAreaCode: z.string().optional().describe('行政区域コード 5桁 (カンマ区切りで複数指定可)'),
    },
    async (params) => {
      const result = await getDensityPopulationData(params);
      return { content: [{ type: 'text', text: toJson(result) }] };
    }
  );

  // ─── XGT001: 国土地理院GISデータ（指定緊急避難場所） ────────────────────
  server.tool(
    'getEmergencyEvacuationSite',
    '国土地理院GISデータ（指定緊急避難場所）をXYZタイル座標で取得します',
    xyzSchema,
    async (params) => {
      const result = await getEmergencyEvacuationSiteData(params);
      return { content: [{ type: 'text', text: toJson(result) }] };
    }
  );

  // ─── XST001: 国土調査（災害履歴） ──────────────────────────────────────
  server.tool(
    'getDisasterHistory',
    '国土調査（災害履歴）をXYZタイル座標で取得します',
    {
      ...xyzSchema,
      disastertype_code: z.string().optional().describe('災害種別コード 2桁 (11/12/13/14/21/22/23/24/33/34/37/38, カンマ区切りで複数指定可)'),
    },
    async (params) => {
      const result = await getDisasterHistoryData(params);
      return { content: [{ type: 'text', text: toJson(result) }] };
    }
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);
}
