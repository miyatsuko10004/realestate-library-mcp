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
  getLiquefactionTendencyData
} from '../services/realEstateService.js';
import { 
  RealEstatePriceParams, 
  AppraisalParams, 
  PointApiParams, 
  LandPriceParams,
  UrbanPlanningParams,
  NationalLandInfoParams,
  PopulationMeshParams,
  StationPassengersParams,
  LiquefactionParams 
} from '../types/api.js';

// ToolDefinitionの型定義
export interface ToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: string;
    required?: string[];
    properties: Record<string, {
      type: string;
      description: string;
      enum?: string[]; // レスポンス形式などの選択肢用
    }>;
  };
  handler: (params: any) => Promise<any>;
}

// 共通のXYZパラメータ定義
const xyzParams = {
  response_format: {
    type: 'string',
    description: 'レスポンス形式 (geojson または pbf)',
    enum: ['geojson', 'pbf']
  },
  z: {
    type: 'number',
    description: 'ズームレベル（APIごとに指定可能な範囲が異なる場合あり）'
  },
  x: {
    type: 'number',
    description: 'タイル座標のX値'
  },
  y: {
    type: 'number',
    description: 'タイル座標のY値'
  }
};

// 共通のXYZ+Yearパラメータ定義
const xyzYearParams = {
  ...xyzParams,
  year: {
    type: 'string',
    description: '年度（YYYY形式）'
  }
};

/**
 * 自然言語クエリから不動産情報を検索するツール
 */
export const searchRealEstateByNaturalLanguage: ToolDefinition = {
  name: 'searchRealEstateByNaturalLanguage',
  description: '自然言語による検索クエリから不動産情報を検索します。例: 「東京都新宿区の2022年の物件情報を5件取得」',
  parameters: {
    type: 'object',
    required: ['query'],
    properties: {
      query: {
        type: 'string',
        description: '検索したい不動産情報を自然言語で指定してください。「都道府県名」「市区町村名」「価格帯」「面積」「取引年」などを含めることができます。',
      },
    },
  },
  async handler({ query }: { query: string }) {
    try {
      // 自然言語クエリをAPIパラメータに変換
      const params = parseNaturalLanguageQuery(query);
      console.log('生成されたパラメータ:', params);
      
      // 不動産情報を取得
      const results = await getRealEstateData(params);
      
      return {
        count: results.length,
        query: query,
        parameters: params,
        results: results,
      };
    } catch (error) {
      console.error('Error in searchRealEstateByNaturalLanguage:', error);
      throw new Error(`不動産情報の検索中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
};

/**
 * パラメータを直接指定して不動産情報を検索するツール
 */
export const searchRealEstateByParams: ToolDefinition = {
  name: 'searchRealEstateByParams',
  description: '特定のパラメータを指定して不動産情報を検索します',
  parameters: {
    type: 'object',
    properties: {
      prefecture: {
        type: 'string',
        description: '都道府県コード (例: 13 = 東京都)',
      },
      city: {
        type: 'string',
        description: '市区町村コード',
      },
      from: {
        type: 'string',
        description: '検索期間（開始）YYYY-Q[1-4] 例: 2020-1',
      },
      to: {
        type: 'string',
        description: '検索期間（終了）YYYY-Q[1-4] 例: 2020-4',
      },
      minTradePrice: {
        type: 'string',
        description: '最低取引価格（円）',
      },
      maxTradePrice: {
        type: 'string',
        description: '最高取引価格（円）',
      },
      area: {
        type: 'string',
        description: '面積（平方メートル）',
      },
      keywords: {
        type: 'string',
        description: 'キーワード（地区名、住所など）',
      },
      limit: {
        type: 'number',
        description: '取得件数制限',
      },
    },
  },
  async handler(params: RealEstatePriceParams) {
    try {
      // パラメータが何も指定されていない場合はエラー
      if (Object.keys(params).length === 0) {
        throw new Error('少なくとも1つのパラメータを指定してください');
      }
      
      // 不動産情報を取得
      const results = await getRealEstateData(params);
      
      return {
        count: results.length,
        parameters: params,
        results: results,
      };
    } catch (error) {
      console.error('Error in searchRealEstateByParams:', error);
      throw new Error(`不動産情報の検索中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
};

/**
 * 都道府県の市区町村一覧を取得するツール
 */
export const getMunicipalities: ToolDefinition = {
  name: 'getMunicipalities',
  description: '指定した都道府県の市区町村一覧を取得します',
  parameters: {
    type: 'object',
    required: ['prefectureCode'],
    properties: {
      prefectureCode: {
        type: 'string',
        description: '都道府県コード (例: 13 = 東京都)',
      },
    },
  },
  async handler({ prefectureCode }: { prefectureCode: string }) {
    try {
      const prefecture = await getPrefectureMunicipalities(prefectureCode);
      return prefecture;
    } catch (error) {
      console.error('Error in getMunicipalities:', error);
      throw new Error(`市区町村一覧の取得中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
};

/**
 * 都市計画区域/区域区分情報を取得するツール (元々のgetUrbanPlanning)
 */
export const getUrbanPlanningDistrict: ToolDefinition = {
  name: 'getUrbanPlanningDistrict',
  description: '都市計画決定GISデータ（都市計画区域/区域区分）をXYZタイル座標で取得します。',
  parameters: {
    type: 'object',
    required: ['response_format', 'z', 'x', 'y'],
    properties: xyzParams
  },
  async handler(params: PointApiParams) {
    try {
      const urbanData = await getUrbanPlanningArea(params.z, params.x, params.y); // Service側の関数名も修正が必要かもしれない
      return urbanData;
    } catch (error) {
      console.error('Error in getUrbanPlanningDistrict:', error);
      throw new Error(`都市計画区域/区域区分情報の取得中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
};

/**
 * 鑑定評価書情報を取得するツール
 */
export const getAppraisal: ToolDefinition = {
  name: 'getAppraisal',
  description: '鑑定評価書情報を検索します。',
  parameters: {
    type: 'object',
    properties: {
      id: { type: 'string', description: '鑑定評価書ID' },
      prefecture: { type: 'string', description: '都道府県コード' },
      city: { type: 'string', description: '市区町村コード' },
      keywords: { type: 'string', description: 'キーワード' },
      limit: { type: 'number', description: '取得件数制限' }
    }
  },
  async handler(params: AppraisalParams) {
    try {
      const results = await getAppraisalData(params);
      return results;
    } catch (error) {
      console.error('Error in getAppraisal:', error);
      throw new Error(`鑑定評価書情報の取得中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};

/**
 * 不動産価格情報のポイントデータを取得するツール
 */
export const getRealEstatePricePointData: ToolDefinition = {
  name: 'getRealEstatePricePointData',
  description: '不動産価格（取引価格・成約価格）情報のポイント (点) をXYZタイル座標で取得します。',
  parameters: {
    type: 'object',
    required: ['response_format', 'z', 'x', 'y'],
    properties: xyzParams
  },
  async handler(params: PointApiParams) {
    try {
      const results = await getRealEstatePricePoints(params);
      return results;
    } catch (error) {
      console.error('Error in getRealEstatePricePointData:', error);
      throw new Error(`不動産価格ポイント情報の取得中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};

/**
 * 地価公示・地価調査のポイントデータを取得するツール
 */
export const getLandPricePointData: ToolDefinition = {
  name: 'getLandPricePointData',
  description: '地価公示・地価調査のポイント（点）をXYZタイル座標で取得します。',
  parameters: {
    type: 'object',
    required: ['response_format', 'z', 'x', 'y'],
    properties: {
      ...xyzParams,
      type: { type: 'string', description: '情報種別 (任意)' },
      prefecture: { type: 'string', description: '都道府県コード (任意)' },
      city: { type: 'string', description: '市区町村コード (任意)' },
      year: { type: 'string', description: '年度 (YYYY形式, 任意)' }
    }
  },
  async handler(params: LandPriceParams) {
    try {
      const results = await getLandPricePoints(params);
      return results;
    } catch (error) {
      console.error('Error in getLandPricePointData:', error);
      throw new Error(`地価公示・地価調査情報の取得中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};

/**
 * 用途地域データを取得するツール
 */
export const getLandUseZone: ToolDefinition = {
  name: 'getLandUseZone',
  description: '都市計画決定GISデータ（用途地域）をXYZタイル座標で取得します。',
  parameters: {
    type: 'object',
    required: ['response_format', 'z', 'x', 'y'],
    properties: xyzYearParams
  },
  async handler(params: UrbanPlanningParams) {
    try {
      const results = await getLandUseZoneData(params);
      return results;
    } catch (error) {
      console.error('Error in getLandUseZone:', error);
      throw new Error(`用途地域データの取得中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};

/**
 * 立地適正化計画データを取得するツール
 */
export const getLocationOptimizationPlan: ToolDefinition = {
  name: 'getLocationOptimizationPlan',
  description: '都市計画決定GISデータ（立地適正化計画）をXYZタイル座標で取得します。',
  parameters: {
    type: 'object',
    required: ['response_format', 'z', 'x', 'y'],
    properties: xyzYearParams
  },
  async handler(params: UrbanPlanningParams) {
    try {
      const results = await getLocationOptimizationPlanData(params);
      return results;
    } catch (error) {
      console.error('Error in getLocationOptimizationPlan:', error);
      throw new Error(`立地適正化計画データの取得中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};

/**
 * 小学校区データを取得するツール
 */
export const getElementarySchoolDistrict: ToolDefinition = {
  name: 'getElementarySchoolDistrict',
  description: '国土数値情報（小学校区）をXYZタイル座標で取得します。',
  parameters: {
    type: 'object',
    required: ['response_format', 'z', 'x', 'y'],
    properties: xyzYearParams
  },
  async handler(params: NationalLandInfoParams) {
    try {
      const results = await getElementarySchoolDistrictData(params);
      return results;
    } catch (error) {
      console.error('Error in getElementarySchoolDistrict:', error);
      throw new Error(`小学校区データの取得中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};

/**
 * 中学校区データを取得するツール
 */
export const getJuniorHighSchoolDistrict: ToolDefinition = {
  name: 'getJuniorHighSchoolDistrict',
  description: '国土数値情報（中学校区）をXYZタイル座標で取得します。',
  parameters: {
    type: 'object',
    required: ['response_format', 'z', 'x', 'y'],
    properties: xyzYearParams
  },
  async handler(params: NationalLandInfoParams) {
    try {
      const results = await getJuniorHighSchoolDistrictData(params);
      return results;
    } catch (error) {
      console.error('Error in getJuniorHighSchoolDistrict:', error);
      throw new Error(`中学校区データの取得中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};

/**
 * 学校データを取得するツール
 */
export const getSchool: ToolDefinition = {
  name: 'getSchool',
  description: '国土数値情報（学校）をXYZタイル座標で取得します。',
  parameters: {
    type: 'object',
    required: ['response_format', 'z', 'x', 'y'],
    properties: xyzYearParams
  },
  async handler(params: NationalLandInfoParams) {
    try {
      const results = await getSchoolData(params);
      return results;
    } catch (error) {
      console.error('Error in getSchool:', error);
      throw new Error(`学校データの取得中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};

/**
 * 保育園・幼稚園等データを取得するツール
 */
export const getChildcareFacility: ToolDefinition = {
  name: 'getChildcareFacility',
  description: '国土数値情報（保育園・幼稚園等）をXYZタイル座標で取得します。',
  parameters: {
    type: 'object',
    required: ['response_format', 'z', 'x', 'y'],
    properties: xyzYearParams
  },
  async handler(params: NationalLandInfoParams) {
    try {
      const results = await getChildcareFacilityData(params);
      return results;
    } catch (error) {
      console.error('Error in getChildcareFacility:', error);
      throw new Error(`保育園・幼稚園等データの取得中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};

/**
 * 医療機関データを取得するツール
 */
export const getMedicalFacility: ToolDefinition = {
  name: 'getMedicalFacility',
  description: '国土数値情報（医療機関）をXYZタイル座標で取得します。',
  parameters: {
    type: 'object',
    required: ['response_format', 'z', 'x', 'y'],
    properties: xyzYearParams
  },
  async handler(params: NationalLandInfoParams) {
    try {
      const results = await getMedicalFacilityData(params);
      return results;
    } catch (error) {
      console.error('Error in getMedicalFacility:', error);
      throw new Error(`医療機関データの取得中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};

/**
 * 将来推計人口メッシュデータを取得するツール
 */
export const getPopulationMesh: ToolDefinition = {
  name: 'getPopulationMesh',
  description: '国土数値情報（将来推計人口250mメッシュ）をXYZタイル座標で取得します。',
  parameters: {
    type: 'object',
    required: ['response_format', 'z', 'x', 'y'],
    properties: {
      ...xyzParams,
      year: { type: 'string', description: '予測年 (YYYY形式, 任意)' },
      type: { type: 'string', description: '人口タイプ (任意、総人口など)' }
    }
  },
  async handler(params: PopulationMeshParams) {
    try {
      const results = await getPopulationMeshData(params);
      return results;
    } catch (error) {
      console.error('Error in getPopulationMesh:', error);
      throw new Error(`将来推計人口メッシュデータの取得中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};

/**
 * 駅別乗降客数データを取得するツール
 */
export const getStationPassengers: ToolDefinition = {
  name: 'getStationPassengers',
  description: '国土数値情報（駅別乗降客数）をXYZタイル座標で取得します。',
  parameters: {
    type: 'object',
    required: ['response_format', 'z', 'x', 'y'],
    properties: {
      ...xyzParams,
      company_type: { type: 'string', description: '事業者種別 (任意)' },
      year: { type: 'string', description: '年度 (YYYY形式, 任意)' }
    }
  },
  async handler(params: StationPassengersParams) {
    try {
      const results = await getStationPassengersData(params);
      return results;
    } catch (error) {
      console.error('Error in getStationPassengers:', error);
      throw new Error(`駅別乗降客数データの取得中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};

/**
 * 図書館データを取得するツール
 */
export const getLibrary: ToolDefinition = {
  name: 'getLibrary',
  description: '国土数値情報（図書館）をXYZタイル座標で取得します。',
  parameters: {
    type: 'object',
    required: ['response_format', 'z', 'x', 'y'],
    properties: xyzYearParams
  },
  async handler(params: NationalLandInfoParams) {
    try {
      const results = await getLibraryData(params);
      return results;
    } catch (error) {
      console.error('Error in getLibrary:', error);
      throw new Error(`図書館データの取得中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};

/**
 * 災害危険区域データを取得するツール
 */
export const getDisasterHazardArea: ToolDefinition = {
  name: 'getDisasterHazardArea',
  description: '国土数値情報（災害危険区域）をXYZタイル座標で取得します。',
  parameters: {
    type: 'object',
    required: ['response_format', 'z', 'x', 'y'],
    properties: xyzYearParams
  },
  async handler(params: NationalLandInfoParams) {
    try {
      const results = await getDisasterHazardAreaData(params);
      return results;
    } catch (error) {
      console.error('Error in getDisasterHazardArea:', error);
      throw new Error(`災害危険区域データの取得中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};

/**
 * 地形区分に基づく液状化の発生傾向図データを取得するツール
 */
export const getLiquefactionTendency: ToolDefinition = {
  name: 'getLiquefactionTendency',
  description: '国土交通省都市局（地形区分に基づく液状化の発生傾向図）をXYZタイル座標で取得します。',
  parameters: {
    type: 'object',
    required: ['response_format', 'z', 'x', 'y'],
    properties: xyzParams
  },
  async handler(params: LiquefactionParams) {
    try {
      const results = await getLiquefactionTendencyData(params);
      return results;
    } catch (error) {
      console.error('Error in getLiquefactionTendency:', error);
      throw new Error(`液状化発生傾向図データの取得中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};

// TODO: 他のAPIエンドポイントに対応するツールを追加... 