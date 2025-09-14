# Aurora Serverless接続テスト結果レポート

作成日：2024年12月14日

## ✅ テスト結果サマリー

**すべてのテストが成功しました！** Aurora Serverlessクラスター `jiko-database` への接続と既存データの読み取りが正常に動作しています。

## 🔍 発見した詳細情報

### Aurora Serverlessクラスター詳細
- **クラスターID**: `jiko-database`
- **エンジン**: PostgreSQL 16.6 (ARM64)
- **状態**: 稼働中 (available)
- **エンドポイント**: `jiko-database.cluster-c0x2uo6863wb.us-east-1.rds.amazonaws.com`
- **Data API**: ✅ 有効
- **IAM認証**: ✅ 有効
- **シークレット**: `arn:aws:secretsmanager:us-east-1:083439127731:secret:rds!cluster-afcd9c2a-06fb-426d-a1e5-7c4c01a15fb0-XDxBzP`

### データベース構造
- **データベース名**: `jiko_database`
- **メインテーブル**: `accident_data`
- **レコード数**: 1,000件
- **主要カラム**:
  - `vehicle_id` (integer) - 車両ID
  - `occurrence_date_and_time` (varchar) - 発生日時
  - `location` (varchar) - 発生場所
  - `latitude` (numeric) - 緯度 ✅
  - `longitude` (numeric) - 経度 ✅
  - `accident_type_category` (varchar) - 事故種別
  - `weather` (varchar) - 天候

### 既存AppSyncリソース
- **API名**: `amplifyData`
- **API ID**: `c2gczwsiyfbipm45vh4a2zgbbq`
- **認証**: AWS_IAM + Cognito User Pools
- **既存データソース**: DynamoDB (Todoテーブル)
- **Aurora接続**: 未設定

## 📊 取得したサンプルデータ

```json
[
  {
    "vehicle_id": 300000001,
    "occurrence_date_and_time": "2005/10/7 6:55",
    "location": "小山市大塚町",
    "latitude": "36.31381",
    "longitude": "139.78748",
    "accident_type_category": "その他",
    "weather": "晴れ"
  },
  {
    "vehicle_id": 300000002,
    "occurrence_date_and_time": "2008/9/13 1:50",
    "location": "大津市",
    "latitude": "35.01836",
    "longitude": "135.85466",
    "accident_type_category": "その他",
    "weather": "雨"
  }
]
```

## 🚀 次のステップ計画

### Phase 1: Amplify統合準備 (30分)
1. **AppSyncデータソース追加**
   - Aurora Serverless用のRDSデータソースを追加
   - 適切なIAM権限設定

2. **GraphQLスキーマ設計**
   - 事故データ用の`AccidentReport`型定義
   - クエリ・ミューテーション設計

### Phase 2: Amplifyバックエンド更新 (45分)
1. **data/resource.ts更新**
   - 既存DynamoDBスキーマと並行してAuroraスキーマ追加
   - 型安全性確保

2. **カスタムリゾルバー実装**
   - PostgreSQL用の専用リゾルバー作成
   - 地理的検索クエリ対応

### Phase 3: フロントエンド統合 (60分)
1. **型定義更新**
   - 既存AccidentReport.tsを実データ構造に合わせて更新
   
2. **クエリ実装**
   - 事故データ一覧取得
   - 地理的範囲検索
   - ルート周辺検索

3. **地図表示統合**
   - 既存Map.tsxコンポーネントとの統合
   - リアルデータでのマーカー表示

## 🔧 必要な技術的作業

### 1. IAM権限設定
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "rds-data:ExecuteStatement",
        "rds-data:BatchExecuteStatement"
      ],
      "Resource": "arn:aws:rds:us-east-1:083439127731:cluster:jiko-database"
    },
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue"
      ],
      "Resource": "arn:aws:secretsmanager:us-east-1:083439127731:secret:rds!cluster-afcd9c2a-06fb-426d-a1e5-7c4c01a15fb0-XDxBzP"
    }
  ]
}
```

### 2. GraphQLスキーマ例
```graphql
type AccidentReport {
  id: ID!
  vehicleId: Int!
  occurrenceDateAndTime: String!
  location: String!
  latitude: Float!
  longitude: Float!
  accidentTypeCategory: String!
  weather: String
}

type Query {
  listAccidents(limit: Int, nextToken: String): AccidentConnection
  getAccidentsNearRoute(routeCoordinates: [Coordinate!]!, radius: Int!): [AccidentReport!]!
  getAccidentsInArea(
    minLatitude: Float!
    maxLatitude: Float!
    minLongitude: Float!
    maxLongitude: Float!
  ): [AccidentReport!]!
}

input Coordinate {
  latitude: Float!
  longitude: Float!
}

type AccidentConnection {
  items: [AccidentReport!]!
  nextToken: String
}
```

### 3. カスタムリゾルバー例
```sql
-- 地理的範囲検索用SQL
SELECT 
  vehicle_id,
  occurrence_date_and_time,
  location,
  latitude,
  longitude,
  accident_type_category,
  weather
FROM accident_data
WHERE 
  latitude BETWEEN $minLat AND $maxLat
  AND longitude BETWEEN $minLng AND $maxLng
ORDER BY occurrence_date_and_time DESC
LIMIT $limit;
```

## 🎯 推奨実装アプローチ

### 段階的統合戦略
1. **最小限のプロトタイプ**: 簡単なリスト表示から開始
2. **地図統合**: 既存Map.tsxとの連携
3. **高度な検索**: ルート周辺検索の実装
4. **パフォーマンス最適化**: インデックス作成、キャッシュ実装

### データマッピング考慮点
- **座標データ**: stringからnumberへの型変換
- **日時データ**: 文字列からDateオブジェクトへの変換
- **NULL値処理**: 適切なオプショナル型設計

## 🔒 セキュリティ考慮事項

### 本番データ保護
- **読み取り専用**: データ変更操作は無効化
- **アクセス制御**: Cognito認証必須
- **監査ログ**: CloudWatchでのアクセス監視

### データプライバシー
- **個人情報**: 必要最小限のデータ露出
- **位置情報**: 適切な精度レベルでの表示

## 📈 期待される成果

### 機能的成果
- ✅ 1,000件の実データでのリアルタイム事故情報表示
- ✅ 地図上での正確な位置マーカー表示
- ✅ ルート周辺の事故情報検索
- ✅ 高性能な地理的検索機能

### 技術的成果
- ✅ Aurora ServerlessとAmplify Gen2の完全統合
- ✅ PostGISを活用した地理空間検索
- ✅ スケーラブルなサーバーレスアーキテクチャ
- ✅ 型安全なGraphQL API

## 結論

**Aurora Serverlessクラスターとの接続テストは完全に成功しました。** 

既に1,000件の実データが格納されており、緯度・経度情報も完備されているため、すぐに本格的なアプリケーション開発に移行できる状態です。

次は「実装」フェーズに進み、AppSyncデータソースの設定とAmplify統合を行うことをお勧めします。