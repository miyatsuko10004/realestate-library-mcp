import { getRealEstateData, getPrefectureMunicipalities, getUrbanPlanningArea, parseNaturalLanguageQuery } from '../services/realEstateService.js';
import { RealEstatePriceParams } from '../types/api.js';

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
    }>;
  };
  handler: (params: any) => Promise<any>;
}

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
 * 都市計画区域/区域区分情報を取得するツール
 */
export const getUrbanPlanning: ToolDefinition = {
  name: 'getUrbanPlanning',
  description: '特定のタイル座標における都市計画区域/区域区分情報をGeoJSON形式で取得します',
  parameters: {
    type: 'object',
    required: ['zoom', 'x', 'y'],
    properties: {
      zoom: {
        type: 'number',
        description: 'ズームレベル（11-15）',
      },
      x: {
        type: 'number',
        description: 'タイル座標のX値',
      },
      y: {
        type: 'number',
        description: 'タイル座標のY値',
      },
    },
  },
  async handler({ zoom, x, y }: { zoom: number, x: number, y: number }) {
    try {
      const urbanData = await getUrbanPlanningArea(zoom, x, y);
      return urbanData;
    } catch (error) {
      console.error('Error in getUrbanPlanning:', error);
      throw new Error(`都市計画区域情報の取得中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
}; 