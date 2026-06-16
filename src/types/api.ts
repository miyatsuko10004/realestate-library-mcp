// XIT001: 不動産価格（取引価格・成約価格）情報取得
export interface RealEstatePriceParams {
  year: string;                  // YYYY (必須)
  quarter: string;               // 1-4 (必須)
  area?: string;                 // 都道府県コード2桁 (area/city/stationのいずれか必須)
  city?: string;                 // 市区町村コード5桁
  station?: string;              // 駅コード6桁
  priceClassification?: string;  // 01=取引価格のみ, 02=成約価格のみ
  language?: string;             // ja/en
}

// XIT002: 都道府県内市区町村一覧取得
export interface MunicipalitiesParams {
  area: string;                  // 都道府県コード2桁 (必須)
  language?: string;             // ja/en
}

// XCT001: 鑑定評価書情報
export interface AppraisalParams {
  year: string;                  // YYYY (必須, 2022-2026)
  area: string;                  // 都道府県コード2桁 (必須)
  division: string;              // 用途区分2桁 (必須)
}

// XPT001: 不動産価格ポイント
export interface RealEstatePricePointParams {
  response_format: 'geojson' | 'pbf';
  z: number;
  x: number;
  y: number;
  from: string;                  // 取引時期From YYYYN形式 (必須)
  to: string;                    // 取引時期To YYYYN形式 (必須)
  priceClassification?: string;  // 01=取引価格, 02=成約価格
  landTypeCode?: string;         // 種類コード (01/02/07/10/11, カンマ区切り)
}

// XPT002: 地価公示・地価調査ポイント
export interface LandPricePointParams {
  response_format: 'geojson' | 'pbf';
  z: number;
  x: number;
  y: number;
  year: string;                  // NNNN (必須, 1995-2024)
  priceClassification?: string;  // 0/1
  useCategoryCode?: string;      // 用途区分 (00/03/05/07/09/10/13/20, カンマ区切り)
}

// 基本XYZタイルパラメータ (XKT系共通)
export interface XYZParams {
  response_format: 'geojson' | 'pbf';
  z: number;
  x: number;
  y: number;
}

// XKT011: 福祉施設
export interface WelfareFacilityParams extends XYZParams {
  administrativeAreaCode?: string;           // 行政区域コード5桁
  welfareFacilityClassCode?: string;         // 大分類コード2桁
  welfareFacilityMiddleClassCode?: string;   // 中分類コード4桁
  welfareFacilityMinorClassCode?: string;    // 小分類コード6桁
}

// XKT019: 自然公園地域
export interface NaturalParkParams extends XYZParams {
  prefectureCode?: string;       // 都道府県コード
  districtCode?: string;         // 地区コード
}

// XKT021, XKT022: 地すべり防止地区・急傾斜地崩壊危険区域
export interface SlopeDisasterParams extends XYZParams {
  prefectureCode?: string;       // 都道府県コード2桁
  administrativeAreaCode?: string; // 行政コード5桁
}

// XKT031: 人口集中地区
export interface DensityPopulationParams extends XYZParams {
  administrativeAreaCode?: string; // 行政区域コード5桁
}

// XST001: 国土調査（災害履歴）
export interface DisasterHistoryParams extends XYZParams {
  disastertype_code?: string;    // 災害種別コード2桁 (カンマ区切り)
}

// API共通エラー
export interface ApiError {
  code: string;
  message: string;
}
