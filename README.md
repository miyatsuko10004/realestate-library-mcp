# 不動産情報ライブラリ MCP サーバー

国土交通省の[不動産情報ライブラリAPI](https://www.reinfolib.mlit.go.jp/help/apiManual/)に対応したModel Context Protocol (MCP) サーバーです。公開されている全35 APIをMCPツールとして提供します。

## 機能

公式APIマニュアルの全35エンドポイントに対応しています。

| カテゴリ | ツール数 | 内容 |
|---|---|---|
| 価格情報 | 5 | 不動産価格・地価公示・鑑定評価書・価格ポイント |
| 都市計画 | 8 | 用途地域・立地適正化計画・地区計画・都市計画道路 等 |
| 周辺施設 | 10 | 学校区・医療機関・福祉施設・図書館・市区町村役場 等 |
| 人口 | 3 | 将来推計人口メッシュ・駅別乗降客数・人口集中地区 |
| 防災・地形 | 9 | 洪水・津波・土砂災害・液状化・急傾斜地崩壊危険区域 等 |

## 前提条件

- Node.js 18.x 以上
- 不動産情報ライブラリのAPIキー（[申請方法](https://www.reinfolib.mlit.go.jp/help/apiManual/#titleApiApplication)を参照）

## Claude Desktop での設定

`claude_desktop_config.json` にMCPサーバーを追加してください。

```json
{
  "mcpServers": {
    "realestate-library": {
      "command": "npx",
      "args": ["-y", "@miyatsuko10004/realestate-library-mcp"],
      "env": {
        "REINFOLIB_API_KEY": "YOUR_API_KEY"
      }
    }
  }
}
```

APIキーをコマンドライン引数で渡す場合：

```json
{
  "mcpServers": {
    "realestate-library": {
      "command": "npx",
      "args": ["-y", "@miyatsuko10004/realestate-library-mcp", "-k", "YOUR_API_KEY"]
    }
  }
}
```

### mcp.json 設定ファイルを使用する場合

```json
{
  "@miyatsuko10004/realestate-library-mcp": {
    "apiKey": "YOUR_API_KEY"
  }
}
```

```json
{
  "mcpServers": {
    "realestate-library": {
      "command": "npx",
      "args": ["-y", "@miyatsuko10004/realestate-library-mcp", "--config", "/path/to/mcp.json"]
    }
  }
}
```

## コマンドラインオプション

```
Options:
  -k, --api-key <key>   不動産情報ライブラリAPIキー
  -c, --config <path>   mcp.json設定ファイルのパス
  -h, --help            ヘルプ情報を表示
```

APIキーの優先順位: `-k` オプション > mcp.json ファイル > `REINFOLIB_API_KEY` 環境変数

## 利用可能なツール（全35種）

### 価格情報

#### getRealEstatePrice (XIT001)
不動産価格（取引価格・成約価格）情報を取得します。`year`・`quarter`と、`area`・`city`・`station`のいずれか1つが必須です。

```json
{
  "year": "2023",
  "quarter": "1",
  "area": "13"
}
```

#### getMunicipalities (XIT002)
指定した都道府県の市区町村一覧を取得します。

```json
{
  "area": "13"
}
```

#### getAppraisal (XCT001)
鑑定評価書情報を取得します。`year`・`area`・`division`がすべて必須です。

```json
{
  "year": "2024",
  "area": "13",
  "division": "00"
}
```

`division`: 00=住宅地, 03=宅地見込地, 05=商業地, 07=準工業地, 09=工業地, 10=調整区域内宅地, 13=現況林地, 20=林地

#### getRealEstatePricePoints (XPT001)
不動産価格情報のポイントをXYZタイル座標で取得します。`from`・`to`はYYYYN形式（例: `20231`）。

```json
{
  "response_format": "geojson",
  "z": 13,
  "x": 7273,
  "y": 3226,
  "from": "20231",
  "to": "20234"
}
```

#### getLandPricePoints (XPT002)
地価公示・地価調査のポイントをXYZタイル座標で取得します。`year`が必須です。

```json
{
  "response_format": "geojson",
  "z": 13,
  "x": 7273,
  "y": 3226,
  "year": "2023"
}
```

---

### 都市計画

XYZタイル座標（`response_format`・`z`・`x`・`y`）が必須です。

| ツール名 | API ID | 内容 |
|---|---|---|
| `getUrbanPlanningDistrict` | XKT001 | 都市計画区域/区域区分 |
| `getLandUseZone` | XKT002 | 用途地域 |
| `getLocationOptimizationPlan` | XKT003 | 立地適正化計画 |
| `getFirePreventionZone` | XKT014 | 防火・準防火地域 |
| `getDistrictPlan` | XKT023 | 地区計画 |
| `getHighDensityUtilizationArea` | XKT024 | 高度利用地区 |
| `getUrbanPlanningRoad` | XKT030 | 都市計画道路 |

```json
{
  "response_format": "geojson",
  "z": 13,
  "x": 7273,
  "y": 3226
}
```

---

### 周辺施設

XYZタイル座標が必須です。

| ツール名 | API ID | 内容 |
|---|---|---|
| `getElementarySchoolDistrict` | XKT004 | 小学校区 |
| `getJuniorHighSchoolDistrict` | XKT005 | 中学校区 |
| `getSchool` | XKT006 | 学校 |
| `getChildcareFacility` | XKT007 | 保育園・幼稚園等 |
| `getMedicalFacility` | XKT010 | 医療機関 |
| `getLibrary` | XKT017 | 図書館 |
| `getMunicipalOffice` | XKT018 | 市区町村役場及び集会施設等 |

#### getWelfareFacility (XKT011)
国土数値情報（福祉施設）を取得します。施設種別でフィルタリング可能です。

```json
{
  "response_format": "geojson",
  "z": 14,
  "x": 14546,
  "y": 6452,
  "welfareFacilityClassCode": "01"
}
```

#### getNaturalPark (XKT019)
国土数値情報（自然公園地域）を取得します。

```json
{
  "response_format": "geojson",
  "z": 11,
  "x": 1818,
  "y": 806,
  "prefectureCode": "13"
}
```

---

### 人口

| ツール名 | API ID | 内容 |
|---|---|---|
| `getPopulationMesh` | XKT013 | 将来推計人口250mメッシュ |
| `getStationPassengers` | XKT015 | 駅別乗降客数 |

#### getDensityPopulationArea (XKT031)
国土数値情報（人口集中地区）を取得します。

```json
{
  "response_format": "geojson",
  "z": 11,
  "x": 1818,
  "y": 806,
  "administrativeAreaCode": "13101"
}
```

---

### 防災・地形

XYZタイル座標が必須です。

| ツール名 | API ID | 内容 |
|---|---|---|
| `getDisasterHazardArea` | XKT016 | 災害危険区域 |
| `getLargeFilledLand` | XKT020 | 大規模盛土造成地マップ |
| `getLiquefactionTendency` | XKT025 | 液状化の発生傾向図 |
| `getFloodInundationArea` | XKT026 | 洪水浸水想定区域（想定最大規模） |
| `getStormSurgeInundationArea` | XKT027 | 高潮浸水想定区域 |
| `getTsunamiInundationArea` | XKT028 | 津波浸水想定 |
| `getSedimentDisasterHazardArea` | XKT029 | 土砂災害警戒区域 |
| `getEmergencyEvacuationSite` | XGT001 | 指定緊急避難場所 |

#### getLandslidePreventionArea (XKT021)
国土数値情報（地すべり防止地区）を取得します。

```json
{
  "response_format": "geojson",
  "z": 13,
  "x": 7273,
  "y": 3226,
  "prefectureCode": "13"
}
```

#### getSteepSlopeHazardArea (XKT022)
国土数値情報（急傾斜地崩壊危険区域）を取得します。

```json
{
  "response_format": "geojson",
  "z": 13,
  "x": 7273,
  "y": 3226,
  "administrativeAreaCode": "13101"
}
```

#### getDisasterHistory (XST001)
国土調査（災害履歴）を取得します。災害種別コードでフィルタリング可能です。

```json
{
  "response_format": "geojson",
  "z": 12,
  "x": 3636,
  "y": 1612,
  "disastertype_code": "11,12"
}
```

`disastertype_code`: 11=洪水, 12=内水, 13=高潮, 14=津波, 21=地すべり, 22=土石流, 23=がけ崩れ, 24=雪崩, 33=地震, 34=液状化, 37=火山, 38=その他

---

## Claudeとの使用例

設定後、以下のような質問ができます。

- 「東京都渋谷区の2023年第1四半期の不動産取引情報を教えて」
- 「大阪府（コード:27）の住宅地の鑑定評価書を2024年分で検索して」
- 「この座標 Z=13, X=7273, Y=3226 の用途地域と防火地域を調べて」
- 「東京都新宿区周辺の小学校区と医療機関データを取得して」
- 「ズームレベル13、X=7273、Y=3226エリアの洪水浸水想定区域を表示して」

## XYZタイル座標の調べ方

地図上の座標からXYZタイル座標を確認するには[地理院タイル座標確認ページ](https://maps.gsi.go.jp/development/tileCoordCheck.html)をご利用ください。

## ライセンス

MIT

## 謝辞

このプロジェクトは、国土交通省の不動産情報ライブラリAPIを利用しています。

[不動産情報ライブラリAPI操作説明](https://www.reinfolib.mlit.go.jp/help/apiManual/)
