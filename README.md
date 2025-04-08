# 不動産情報ライブラリ MCP サーバー

このプロジェクトは、国土交通省の[不動産情報ライブラリAPI](https://www.reinfolib.mlit.go.jp/help/apiManual/)を利用して、不動産情報を検索するためのModel Context Protocol (MCP) サーバーです。

## 機能

- 自然言語での不動産情報検索（例：「東京都新宿区の2022年の物件情報を5件取得」）
- パラメータを直接指定しての不動産情報検索
- 都道府県内の市区町村一覧の取得
- 都市計画区域/区域区分情報の取得

## 前提条件

- Node.js 18.x以上
- 不動産情報ライブラリのAPIキー（[申請方法](https://www.reinfolib.mlit.go.jp/help/apiManual/#titleApiApplication)を参照）

## 使い方

### NPXでの実行（推奨）

```bash
# APIキーをコマンドライン引数で指定
npx realestate-library-mcp --api-key YOUR_API_KEY

# または短縮形で
npx realestate-library-mcp -k YOUR_API_KEY

# ポート番号を指定する場合
npx realestate-library-mcp -k YOUR_API_KEY -p 8080
```

### mcp.json形式での設定

MCPサーバーの設定をファイルとして管理したい場合は、`mcp.json`ファイルを使用できます。

1. カレントディレクトリに`mcp.json`ファイルを作成します：

```json
{
  "realestate-library-mcp": {
    "apiKey": "YOUR_API_KEY",
    "port": 3000
  }
}
```

2. mcp.jsonファイルを指定してサーバーを実行：

```bash
npx realestate-library-mcp --config ./mcp.json
```

または以下のように`MCP_CONFIG`環境変数を設定して実行することもできます：

```bash
MCP_CONFIG=./mcp.json npx realestate-library-mcp
```

### ローカルインストール

```bash
# リポジトリをクローン
git clone https://github.com/miyatsuko10004/realestate-library-mcp.git
cd realestate-library-mcp

# 依存関係のインストール
npm install

# .envファイルの作成（APIキーをコマンドライン引数で指定しない場合）
cp .env.example .env
# .envファイルを編集して、REINFOLIB_API_KEYに取得したAPIキーを設定

# ビルド
npm run build

# 起動
npm start
```

サーバーは、デフォルトで`http://localhost:3000`で起動します。

### コマンドラインオプション

```
Options:
  -k, --api-key <key>     不動産情報ライブラリAPIキー
  -p, --port <number>     サーバーのポート番号 (デフォルト: "3000")
  -c, --config <path>     mcp.json設定ファイルのパス
  -h, --help              ヘルプ情報を表示
```

### MCP情報の確認

```
GET http://localhost:3000/.well-known/mcp
```

### 利用可能なツール

#### 1. searchRealEstateByNaturalLanguage

自然言語による検索クエリから不動産情報を検索します。

```json
{
  "query": "東京都新宿区の2022年の物件情報を5件取得"
}
```

#### 2. searchRealEstateByParams

特定のパラメータを指定して不動産情報を検索します。

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

#### 4. getUrbanPlanning

特定のタイル座標における都市計画区域/区域区分情報をGeoJSON形式で取得します。

```json
{
  "zoom": 11,
  "x": 1818,
  "y": 806
}
```

## Claudeとの使用例

Claudeのデスクトップアプリでは、このMCPサーバーを追加して利用することができます。

1. Claudeアプリの設定を開く
2. MCPサーバーを追加
3. サーバーURLに`http://localhost:3000`を入力
4. 保存して接続

接続後、以下のように不動産情報について質問できます：

- 「東京都渋谷区の最近の不動産取引情報を教えて」
- 「大阪府の住宅価格の相場はいくらですか？」
- 「神奈川県横浜市の2023年の取引データを5件見せて」

## ライセンス

MIT

## 謝辞

このプロジェクトは、国土交通省の不動産情報ライブラリAPIを利用しています。データの提供に感謝いたします。 