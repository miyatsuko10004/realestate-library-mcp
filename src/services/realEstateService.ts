import axios from 'axios';
import * as dotenv from 'dotenv';
import {
  RealEstatePriceParams,
  MunicipalitiesParams,
  AppraisalParams,
  RealEstatePricePointParams,
  LandPricePointParams,
  XYZParams,
  WelfareFacilityParams,
  NaturalParkParams,
  SlopeDisasterParams,
  DensityPopulationParams,
  DisasterHistoryParams,
} from '../types/api.js';

dotenv.config();

const API_BASE_URL = 'https://www.reinfolib.mlit.go.jp/ex-api/external';

function getHeaders() {
  return {
    'Ocp-Apim-Subscription-Key': process.env.REINFOLIB_API_KEY,
  };
}

async function callApi(endpoint: string, params: object = {}): Promise<any> {
  try {
    const response = await axios.get(`${API_BASE_URL}/${endpoint}`, {
      headers: getHeaders(),
      params,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(`API Error ${error.response.status}: ${JSON.stringify(error.response.data)}`);
    }
    throw error;
  }
}

// XIT001: 不動産価格（取引価格・成約価格）情報取得
export async function getRealEstateData(params: RealEstatePriceParams): Promise<any> {
  return callApi('XIT001', params);
}

// XIT002: 都道府県内市区町村一覧取得
export async function getMunicipalitiesData(params: MunicipalitiesParams): Promise<any> {
  return callApi('XIT002', params);
}

// XCT001: 鑑定評価書情報
export async function getAppraisalData(params: AppraisalParams): Promise<any> {
  return callApi('XCT001', params);
}

// XPT001: 不動産価格ポイント
export async function getRealEstatePricePoints(params: RealEstatePricePointParams): Promise<any> {
  return callApi('XPT001', params);
}

// XPT002: 地価公示・地価調査ポイント
export async function getLandPricePoints(params: LandPricePointParams): Promise<any> {
  return callApi('XPT002', params);
}

// XKT001: 都市計画決定GISデータ（都市計画区域/区域区分）
export async function getUrbanPlanningDistrictData(params: XYZParams): Promise<any> {
  return callApi('XKT001', params);
}

// XKT002: 都市計画決定GISデータ（用途地域）
export async function getLandUseZoneData(params: XYZParams): Promise<any> {
  return callApi('XKT002', params);
}

// XKT003: 都市計画決定GISデータ（立地適正化計画）
export async function getLocationOptimizationPlanData(params: XYZParams): Promise<any> {
  return callApi('XKT003', params);
}

// XKT004: 国土数値情報（小学校区）
export async function getElementarySchoolDistrictData(params: XYZParams): Promise<any> {
  return callApi('XKT004', params);
}

// XKT005: 国土数値情報（中学校区）
export async function getJuniorHighSchoolDistrictData(params: XYZParams): Promise<any> {
  return callApi('XKT005', params);
}

// XKT006: 国土数値情報（学校）
export async function getSchoolData(params: XYZParams): Promise<any> {
  return callApi('XKT006', params);
}

// XKT007: 国土数値情報（保育園・幼稚園等）
export async function getChildcareFacilityData(params: XYZParams): Promise<any> {
  return callApi('XKT007', params);
}

// XKT010: 国土数値情報（医療機関）
export async function getMedicalFacilityData(params: XYZParams): Promise<any> {
  return callApi('XKT010', params);
}

// XKT011: 国土数値情報（福祉施設）
export async function getWelfareFacilityData(params: WelfareFacilityParams): Promise<any> {
  return callApi('XKT011', params);
}

// XKT013: 国土数値情報（将来推計人口250mメッシュ）
export async function getPopulationMeshData(params: XYZParams): Promise<any> {
  return callApi('XKT013', params);
}

// XKT014: 都市計画決定GISデータ（防火・準防火地域）
export async function getFirePreventionZoneData(params: XYZParams): Promise<any> {
  return callApi('XKT014', params);
}

// XKT015: 国土数値情報（駅別乗降客数）
export async function getStationPassengersData(params: XYZParams): Promise<any> {
  return callApi('XKT015', params);
}

// XKT016: 国土数値情報（災害危険区域）
export async function getDisasterHazardAreaData(params: XYZParams): Promise<any> {
  return callApi('XKT016', params);
}

// XKT017: 国土数値情報（図書館）
export async function getLibraryData(params: XYZParams): Promise<any> {
  return callApi('XKT017', params);
}

// XKT018: 国土数値情報（市区町村役場及び集会施設等）
export async function getMunicipalOfficeData(params: XYZParams): Promise<any> {
  return callApi('XKT018', params);
}

// XKT019: 国土数値情報（自然公園地域）
export async function getNaturalParkData(params: NaturalParkParams): Promise<any> {
  return callApi('XKT019', params);
}

// XKT020: 国土数値情報（大規模盛土造成地マップ）
export async function getLargeFilledLandData(params: XYZParams): Promise<any> {
  return callApi('XKT020', params);
}

// XKT021: 国土数値情報（地すべり防止地区）
export async function getLandslidePreventionData(params: SlopeDisasterParams): Promise<any> {
  return callApi('XKT021', params);
}

// XKT022: 国土数値情報（急傾斜地崩壊危険区域）
export async function getSteepSlopeHazardData(params: SlopeDisasterParams): Promise<any> {
  return callApi('XKT022', params);
}

// XKT023: 都市計画決定GISデータ（地区計画）
export async function getDistrictPlanData(params: XYZParams): Promise<any> {
  return callApi('XKT023', params);
}

// XKT024: 都市計画決定GISデータ（高度利用地区）
export async function getHighDensityUtilizationData(params: XYZParams): Promise<any> {
  return callApi('XKT024', params);
}

// XKT025: 国土交通省都市局（地形区分に基づく液状化の発生傾向図）
export async function getLiquefactionTendencyData(params: XYZParams): Promise<any> {
  return callApi('XKT025', params);
}

// XKT026: 国土数値情報（洪水浸水想定区域（想定最大規模））
export async function getFloodInundationData(params: XYZParams): Promise<any> {
  return callApi('XKT026', params);
}

// XKT027: 国土数値情報（高潮浸水想定区域）
export async function getStormSurgeInundationData(params: XYZParams): Promise<any> {
  return callApi('XKT027', params);
}

// XKT028: 国土数値情報（津波浸水想定）
export async function getTsunamiInundationData(params: XYZParams): Promise<any> {
  return callApi('XKT028', params);
}

// XKT029: 国土数値情報（土砂災害警戒区域）
export async function getSedimentDisasterHazardData(params: XYZParams): Promise<any> {
  return callApi('XKT029', params);
}

// XKT030: 都市計画決定GISデータ（都市計画道路）
export async function getUrbanPlanningRoadData(params: XYZParams): Promise<any> {
  return callApi('XKT030', params);
}

// XKT031: 国土数値情報（人口集中地区）
export async function getDensityPopulationData(params: DensityPopulationParams): Promise<any> {
  return callApi('XKT031', params);
}

// XGT001: 国土地理院GISデータ（指定緊急避難場所）
export async function getEmergencyEvacuationSiteData(params: XYZParams): Promise<any> {
  return callApi('XGT001', params);
}

// XST001: 国土調査（災害履歴）
export async function getDisasterHistoryData(params: DisasterHistoryParams): Promise<any> {
  return callApi('XST001', params);
}
