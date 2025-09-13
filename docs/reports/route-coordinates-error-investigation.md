# エラー調査レポート: ルート座標が見つからない問題

## 問題の概要
- **エラーメッセージ**: "ルート座標が見つかりません"  
- **原因**: AWS Geo RoutesのAPIレスポンス形式が想定と異なる
- **影響**: ルート可視化機能が動作しない

## 現在の実装問題点

### 1. 座標データの抽出方法
現在の`useRouteVisualization.ts`では以下の形式でレスponseを解析しています：

```typescript
// 現在の実装（間違った構造想定）
const legs = routeResponse.Routes[0].Legs || [];
legs.forEach(leg => {
  if (leg.Geometry && leg.Geometry.LineString) {
    coordinates.push(...leg.Geometry.LineString);
  }
});
```

### 2. AWS Geo Routesの実際のレスポンス構造
調査の結果、AWS Geo RoutesのレスポンスにはLineStringが直接含まれておらず、専用の変換が必要であることが判明しました。

## 解決策：AWS Location Utilities Datatypes ライブラリ

### ライブラリ概要
- **名前**: `@aws/amazon-location-utilities-datatypes`
- **目的**: AWS Location ServiceのレスポンスをGeoJSON形式に変換
- **対応API**: Geo Routes, Geo Places, Location Service全般

### 重要な変換関数

#### `calculateRoutesResponseToFeatureCollections`
- **入力**: AWS Geo RoutesのCalculateRoutesResponse
- **出力**: GeoJSON FeatureCollectionの配列
- **特徴**: 各ルートを個別のFeatureCollectionに変換

#### 変換オプション
```typescript
// デフォルトオプション
{
  flattenProperties: true,        // プロパティを平坦化
  includeLegs: true,             // Leg（区間）を含む
  includeSpans: false,           // Span（細かい区間）は除外
  includeTravelStepGeometry: false,      // 詳細なステップは除外
  includeTravelStepStartPositions: false, // ステップ開始点は除外
  includeLegArrivalDeparturePositions: false // 出発/到着地点は除外
}
```

#### フィーチャータイプ
変換されたFeatureには`FeatureType`プロパティが付与されます：
- `Leg`: ルートの区間（LineString）
- `Span`: 区間内の細かいセグメント（LineString）
- `TravelStepGeometry`: ステップのライン（LineString）
- `TravelStepStartPosition`: ステップ開始地点（Point）
- `Arrival`: 到着地点（Point）
- `Departure`: 出発地点（Point）

## 推奨実装方針

### 1. ライブラリのインストール
```bash
npm install @aws/amazon-location-utilities-datatypes
```

### 2. useRouteVisualization.tsの改修
- 現在の手動座標抽出を削除
- `calculateRoutesResponseToFeatureCollections`を使用
- Legタイプのフィーチャーのみを表示に使用

### 3. 利点
- **信頼性**: AWS公式ライブラリで確実な変換
- **将来性**: AWS API変更への対応
- **機能拡張**: 詳細なルート情報へのアクセス
- **標準化**: GeoJSONの正しい形式保証

## 次のステップ
1. ライブラリをインストール
2. `useRouteVisualization.ts`を改修
3. `useRouteCalculation.ts`のレスポンス保存方法を調整
4. テスト実行と動作確認

## 参考資料
- NPMパッケージ: https://www.npmjs.com/package/@aws/amazon-location-utilities-datatypes
- GitHubリポジトリ: https://github.com/aws-geospatial/amazon-location-utilities-datatypes-js
- AWS Location Service: https://docs.aws.amazon.com/location/latest/developerguide/