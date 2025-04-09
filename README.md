# 不動産情報ライブラリ MCP サーバー

このプロジェクトは、国土交通省の[不動産情報ライブラリAPI](https://www.reinfolib.mlit.go.jp/help/apiManual/)を利用して、不動産情報を検索するためのModel Context Protocol (MCP) サーバーです。

## 機能

- 自然言語での不動産情報検索
- パラメータ指定での不動産情報検索
- 都道府県内市区町村一覧の取得
- 鑑定評価書情報の検索
- 各種GISデータ（不動産価格ポイント、地価公示ポイント、都市計画、国土数値情報、災害リスク等）の取得

## 前提条件

- Node.js 18.x以上
- 不動産情報ライブラリのAPIキー（[申請方法](https://www.reinfolib.mlit.go.jp/help/apiManual/#titleApiApplication)を参照）

## 使い方

npmを通じてパッケージをインストールせずに実行する場合：

```bash
# APIキーを指定して実行
npx @miyatsuko10004/realestate-library-mcp -k YOUR_API_KEY

# ポート番号も指定する場合
npx @miyatsuko10004/realestate-library-mcp -k YOUR_API_KEY -p 8080
```

ローカルにクローンして使用する場合：

```bash
# リポジトリをクローン
git clone https://github.com/miyatsuko10004/realestate-library-mcp.git
cd realestate-library-mcp

# 依存関係のインストールとビルド
npm install
npm run build

# 実行
node dist/cli.js -k YOUR_API_KEY
```

### mcp.json形式での設定

MCPサーバーの設定をファイルとして管理したい場合は、`mcp.json`ファイルを使用できます。

1. カレントディレクトリに`mcp.json`ファイルを作成します：

```json
{
  "@miyatsuko10004/realestate-library-mcp": {
    "apiKey": "YOUR_API_KEY",
    "port": 3000
  }
}
```

2. mcp.jsonファイルを指定してサーバーを実行：

```bash
npx @miyatsuko10004/realestate-library-mcp --config ./mcp.json
```

または以下のように`MCP_CONFIG`環境変数を設定して実行することもできます：

```bash
MCP_CONFIG=./mcp.json npx @miyatsuko10004/realestate-library-mcp
```

### コマンドラインオプション

```
Options:
  -k, --api-key <key>     不動産情報ライブラリAPIキー
  -p, --port <number>     サーバーのポート番号 (デフォルト: "3000")
  -c, --config <path>     mcp.json設定ファイルのパス
  -H, --host <hostname>   サーバーをバインドするホスト名 (デフォルト: "127.0.0.1")
  -h, --help              ヘルプ情報を表示
```

### MCP情報の確認

```
GET http://localhost:3000/.well-known/mcp
```

### 利用可能なツール

#### 1. searchRealEstateByNaturalLanguage

自然言語による検索クエリから不動産価格情報を検索します。

```json
{
  "query": "東京都新宿区の2022年の物件情報を5件取得"
}
```

#### 2. searchRealEstateByParams

特定のパラメータを指定して不動産価格情報を検索します。

```json
{
  "prefecture": "13",
  "keywords": "新宿区",
  "from": "2022-1",
  "to": "2022-4",
  "limit": 5
}
```

#### 3. getMunicipalities

指定した都道府県の市区町村一覧を取得します。

```json
{
  "prefectureCode": "13"
}
```

#### 4. getAppraisal

鑑定評価書情報を検索します。

```json
{
  "prefecture": "13",
  "city": "13101",
  "limit": 3
}
```

#### 5. getRealEstatePricePointData

不動産価格（取引価格・成約価格）情報のポイント (点) をXYZタイル座標で取得します。

```json
{
  "response_format": "geojson",
  "z": 12,
  "x": 3636,
  "y": 1613
}
```

#### 6. getLandPricePointData

地価公示・地価調査のポイント（点）をXYZタイル座標で取得します。

```json
{
  "response_format": "geojson",
  "z": 13,
  "x": 7273,
  "y": 3226,
  "year": "2023"
}
```

#### 7. getUrbanPlanningDistrict

都市計画決定GISデータ（都市計画区域/区域区分）をXYZタイル座標で取得します。

```json
{
  "response_format": "geojson",
  "z": 11,
  "x": 1818,
  "y": 806
}
```

#### 8. getLandUseZone

都市計画決定GISデータ（用途地域）をXYZタイル座標で取得します。

```json
{
  "response_format": "pbf",
  "z": 14,
  "x": 14546,
  "y": 6452,
  "year": "2022"
}
```

#### 9. getLocationOptimizationPlan

都市計画決定GISデータ（立地適正化計画）をXYZタイル座標で取得します。

```json
{
  "response_format": "geojson",
  "z": 11,
  "x": 1818,
  "y": 807
}
```

#### 10. getElementarySchoolDistrict

国土数値情報（小学校区）をXYZタイル座標で取得します。

```json
{
  "response_format": "geojson",
  "z": 13,
  "x": 7273,
  "y": 3225
}
```

#### 11. getJuniorHighSchoolDistrict

国土数値情報（中学校区）をXYZタイル座標で取得します。

```json
{
  "response_format": "pbf",
  "z": 13,
  "x": 7273,
  "y": 3225
}
```

#### 12. getSchool

国土数値情報（学校）をXYZタイル座標で取得します。

```json
{
  "response_format": "geojson",
  "z": 14,
  "x": 14547,
  "y": 6451
}
```

#### 13. getChildcareFacility

国土数値情報（保育園・幼稚園等）をXYZタイル座標で取得します。

```json
{
  "response_format": "geojson",
  "z": 15,
  "x": 29094,
  "y": 12903
}
```

#### 14. getMedicalFacility

国土数値情報（医療機関）をXYZタイル座標で取得します。

```json
{
  "response_format": "pbf",
  "z": 15,
  "x": 29095,
  "y": 12903
}
```

#### 15. getPopulationMesh

国土数値情報（将来推計人口250mメッシュ）をXYZタイル座標で取得します。

```json
{
  "response_format": "geojson",
  "z": 15,
  "x": 29094,
  "y": 12903,
  "year": "2030"
}
```

#### 16. getStationPassengers

国土数値情報（駅別乗降客数）をXYZタイル座標で取得します。

```json
{
  "response_format": "geojson",
  "z": 14,
  "x": 14547,
  "y": 6451,
  "year": "2021"
}
```

#### 17. getLibrary

国土数値情報（図書館）をXYZタイル座標で取得します。

```json
{
  "response_format": "geojson",
  "z": 14,
  "x": 14547,
  "y": 6451
}
```

#### 18. getDisasterHazardArea

国土数値情報（災害危険区域）をXYZタイル座標で取得します。

```json
{
  "response_format": "pbf",
  "z": 12,
  "x": 3636,
  "y": 1612
}
```

#### 19. getLiquefactionTendency

国土交通省都市局（地形区分に基づく液状化の発生傾向図）をXYZタイル座標で取得します。

```json
{
  "response_format": "geojson",
  "z": 13,
  "x": 7273,
  "y": 3226
}
```

## Claudeとの使用例

Claudeのデスクトップアプリでは、このMCPサーバーを追加して利用することができます。

1. Claudeアプリの設定を開く
2. MCPサーバーを追加
3. サーバーURLに`http://localhost:3000`を入力
4. 保存して接続

接続後、以下のように不動産情報や関連データについて質問できます：

- 「東京都渋谷区の最近の不動産取引情報を教えて」
- 「大阪府の住宅価格の相場はいくらですか？」
- 「神奈川県横浜市の2023年の取引データを5件見せて」
- 「この座標 (Z=14, X=14546, Y=6452) の用途地域は何ですか？」
- 「千葉市中央区の小学校区データを表示して」

## ライセンス

MIT

## 謝辞

このプロジェクトは、国土交通省の不動産情報ライブラリAPIを利用しています。データの提供に感謝いたします。

[Source: 不動産情報ライブラリAPI操作説明](https://www.reinfolib.mlit.go.jp/help/apiManual/) 