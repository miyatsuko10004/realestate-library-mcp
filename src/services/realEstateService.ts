import axios from 'axios';
import * as dotenv from 'dotenv';
import { RealEstatePrice, RealEstatePriceParams, Prefecture, ApiError } from '../types/api.js';

dotenv.config();

const API_BASE_URL = 'https://www.reinfolib.mlit.go.jp/ex-api/external';
const API_KEY = process.env.REINFOLIB_API_KEY;

// ヘッダーの設定
const headers = {
  'Ocp-Apim-Subscription-Key': API_KEY,
};

/**
 * 不動産価格情報を取得する
 */
export async function getRealEstateData(params: RealEstatePriceParams): Promise<RealEstatePrice[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/PriceData`, {
      headers,
      params,
    });
    return response.data;
  } catch (error) {
    console.error('不動産価格情報の取得に失敗しました:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(`API Error: ${error.response.status} - ${error.response.data.message || '不明なエラー'}`);
    }
    throw new Error('APIとの通信中にエラーが発生しました');
  }
}

/**
 * 都道府県内市区町村一覧を取得する
 */
export async function getPrefectureMunicipalities(prefCode: string): Promise<Prefecture> {
  try {
    const response = await axios.get(`${API_BASE_URL}/PreMuni/${prefCode}`, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error('市区町村一覧の取得に失敗しました:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(`API Error: ${error.response.status} - ${error.response.data.message || '不明なエラー'}`);
    }
    throw new Error('APIとの通信中にエラーが発生しました');
  }
}

/**
 * 都市計画区域/区域区分情報をGeoJSON形式で取得する
 */
export async function getUrbanPlanningArea(zoom: number, x: number, y: number): Promise<any> {
  try {
    const response = await axios.get(`${API_BASE_URL}/XKT025`, {
      headers,
      params: {
        response_format: 'geojson',
        z: zoom,
        x,
        y,
      },
    });
    return response.data;
  } catch (error) {
    console.error('都市計画区域情報の取得に失敗しました:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(`API Error: ${error.response.status} - ${error.response.data.message || '不明なエラー'}`);
    }
    throw new Error('APIとの通信中にエラーが発生しました');
  }
}

/**
 * 自然言語の入力から適切なAPIパラメータを生成する
 */
export function parseNaturalLanguageQuery(query: string): RealEstatePriceParams {
  const params: RealEstatePriceParams = {};
  
  // 都道府県名の抽出
  const prefectureMatch = query.match(/([東西南北]?[京都大阪神奈川愛知道府県]|[^\s]+[都道府県])/);
  if (prefectureMatch) {
    // 実際のAPIでは都道府県コードが必要なため、名前から変換する処理が必要
    // ここでは仮のコード変換（実際の実装では全都道府県のマッピングが必要）
    const prefMap: {[key: string]: string} = {
      '東京都': '13', '大阪府': '27', '愛知県': '23', '神奈川県': '14',
      '北海道': '01', '京都府': '26', '兵庫県': '28', '福岡県': '40'
    };
    const prefName = prefectureMatch[0];
    params.prefecture = prefMap[prefName];
  }
  
  // 市区町村名の抽出
  const cityMatch = query.match(/([^\s]+[市区町村])/);
  if (cityMatch) {
    params.keywords = cityMatch[0];
  }
  
  // 価格範囲の抽出
  const minPriceMatch = query.match(/(\d+)万円以上/);
  if (minPriceMatch) {
    params.minTradePrice = String(Number(minPriceMatch[1]) * 10000);
  }
  
  const maxPriceMatch = query.match(/(\d+)万円以下/);
  if (maxPriceMatch) {
    params.maxTradePrice = String(Number(maxPriceMatch[1]) * 10000);
  }
  
  // 面積の抽出
  const areaMatch = query.match(/(\d+)平方メートル/);
  if (areaMatch) {
    params.area = areaMatch[1];
  }
  
  // 期間の抽出
  const yearMatch = query.match(/(20\d\d)年/);
  if (yearMatch) {
    const year = yearMatch[1];
    params.from = `${year}-1`;
    params.to = `${year}-4`;
  }
  
  // 件数制限の設定（デフォルト）
  params.limit = 10;
  
  return params;
} 