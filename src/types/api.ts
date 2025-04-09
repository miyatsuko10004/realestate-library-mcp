// 不動産価格情報のレスポンスの型定義
export interface RealEstatePrice {
  ID: string;
  Prefecture: string;
  Municipality: string;
  DistrictName: string;
  TradePrice: string;
  PricePerSquareMeter: string;
  Area: string;
  LandShape: string;
  Frontage: string;
  TotalFloorArea: string;
  BuildingYear: string;
  Structure: string;
  Type: string;
  UseType: string;
  Purpose: string;
  Direction: string;
  Classification: string;
  Breadth: string;
  CityPlanning: string;
  Period: string;
  Renovation: string;
  Remarks: string;
}

// 都道府県内市区町村一覧のレスポンスの型定義
export interface Municipality {
  id: string;
  name: string;
}

export interface Prefecture {
  id: string;
  name: string;
  municipalities: Municipality[];
}

// 都市計画区域/区域区分のレスポンスの型定義
export interface UrbanPlanningArea {
  id: string;
  name: string;
  type: string;
  prefecture: string;
  municipality: string;
  geometry: any; // GeoJSONのジオメトリ
}

// エラーレスポンスの型定義
export interface ApiError {
  code: string;
  message: string;
}

// APIパラメータ型定義
export interface RealEstatePriceParams {
  from?: string; // 検索期間（開始）YYYY-Q[1-4] 例: 2020-1
  to?: string; // 検索期間（終了）YYYY-Q[1-4]
  city?: string; // 市区町村コード
  prefecture?: string; // 都道府県コード
  area?: string; // 面積
  minTradePrice?: string; // 最低取引価格
  maxTradePrice?: string; // 最高取引価格
  minPricePerSquareMeter?: string; // 最低㎡単価
  maxPricePerSquareMeter?: string; // 最高㎡単価
  keywords?: string; // キーワード（住所など）
  limit?: number; // 取得件数制限
}

// 鑑定評価書情報APIのパラメータ型定義
export interface AppraisalParams {
  id?: string; // 鑑定評価書ID
  prefecture?: string; // 都道府県コード
  city?: string; // 市区町村コード
  keywords?: string; // キーワード
  limit?: number; // 取得件数制限
}

// 不動産価格情報ポイントAPIの共通パラメータ
export interface PointApiParams {
  response_format: 'geojson' | 'pbf'; // レスポンス形式
  z: number; // ズームレベル
  x: number; // タイル座標X
  y: number; // タイル座標Y
}

// 地価公示・地価調査APIのパラメータ
export interface LandPriceParams extends PointApiParams {
  type?: string; // 情報種別
  prefecture?: string; // 都道府県コード
  city?: string; // 市区町村コード
  year?: string; // 年度
}

// 都市計画決定GISデータAPIの共通パラメータ
export interface UrbanPlanningParams extends PointApiParams {
  year?: string; // 年度
}

// 国土数値情報APIの共通パラメータ
export interface NationalLandInfoParams extends PointApiParams {
  year?: string; // 年度
}

// 人口メッシュAPIのパラメータ
export interface PopulationMeshParams extends PointApiParams {
  year?: string; // 予測年
  type?: string; // 人口タイプ（総人口、年少人口など）
}

// 駅別乗降客数APIのパラメータ
export interface StationPassengersParams extends PointApiParams {
  company_type?: string; // 事業者種別
  year?: string; // 年度
}

// 液状化発生傾向図APIのパラメータ
export interface LiquefactionParams extends PointApiParams {
  // 基本パラメータのみ
} 