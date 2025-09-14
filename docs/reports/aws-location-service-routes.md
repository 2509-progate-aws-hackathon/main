# AWS Location Service ルート検索機能 調査レポート

## 概要
AWS Location Service は、アプリケーションに位置情報機能を簡単に追加できるフルマネージドサービスです。高品質な地理空間データを使用して、マップ、場所、ルート、トラッキング、ジオフェンス機能を提供します。

## ルート検索機能（CalculateRoute API）

### 基本情報
- **API名**: `CalculateRoute`
- **機能**: 出発地と目的地の間の最適なルートを計算
- **SDK**: `@aws-sdk/client-location`
- **コマンド**: `CalculateRouteCommand`

### 主要パラメータ

#### 必須パラメータ
- **calculator-name**: 使用するルート計算リソースの名前
- **departure-position**: 出発地の座標 `[経度, 緯度]` (WGS84形式)
- **destination-position**: 目的地の座標 `[経度, 緯度]` (WGS84形式)

#### オプションパラメータ
- **waypoint-positions**: 経由地（最大23箇所）
- **travel-mode**: 交通手段
  - `Car` (デフォルト)
  - `Truck`
  - `Walking`
  - `Bicycle` (Grabデータプロバイダーのみ、東南アジア限定)
  - `Motorcycle` (Grabデータプロバイダーのみ、東南アジア限定)
- **departure-time**: 出発時間（ISO 8601形式）
- **depart-now**: 現在時刻で出発
- **distance-unit**: 距離単位（`Kilometers` / `Miles`）
- **include-leg-geometry**: ルート詳細を含むかどうか
- **optimize-for**: 最適化方法
  - `FastestRoute`: 最短時間
  - `ShortestRoute`: 最短距離

#### 交通手段別オプション
- **car-mode-options**: 
  - `AvoidFerries`: フェリーを避ける
  - `AvoidTolls`: 有料道路を避ける
- **truck-mode-options**: 
  - トラックの寸法、重量制限を考慮

### JavaScript SDK 使用例

```javascript
import { LocationClient, CalculateRouteCommand } from "@aws-sdk/client-location";

const client = new LocationClient({ region: "ap-northeast-1" });

const params = {
  CalculatorName: "your-route-calculator-name",
  DeparturePosition: [139.767, 35.681], // 東京
  DestinationPosition: [139.691, 35.689], // 新宿
  TravelMode: "Car",
  IncludeLegGeometry: true,
  OptimizeFor: "FastestRoute"
};

const command = new CalculateRouteCommand(params);

try {
  const data = await client.send(command);
  console.log(data.Routes);
} catch (error) {
  console.error(error);
}
```

### レスポンス構造
- **Routes**: ルートの配列
  - **Distance**: 距離
  - **DurationSeconds**: 所要時間（秒）
  - **Legs**: ルートの区間
    - **StartPosition**: 区間開始座標
    - **EndPosition**: 区間終了座標
    - **Distance**: 区間距離
    - **DurationSeconds**: 区間所要時間
    - **Geometry**: ルート詳細（LineString）

### 制限事項
- Esriプロバイダー: 400km以上のルートでエラー
- 徒歩モード（Esri）: 出発地と目的地が40km以内
- 経由地: 最大23箇所
- 座標範囲: `[-180 to 180, -90 to 90]`

### 料金
- 1回のルート計算リクエストあたり課金
- データプロバイダーによって料金が異なる

## 参考URL
- [AWS Location Service 公式ドキュメント](https://docs.aws.amazon.com/location/)
- [CalculateRoute CLI リファレンス](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/location/calculate-route.html)
- [AWS SDK for JavaScript v3 - Location Client](https://www.npmjs.com/package/@aws-sdk/client-location)
- [AWS Location Service 機能概要](https://aws.amazon.com/location/features/)

## 実装時の考慮点
1. **Route Calculator リソース**: 事前に作成が必要
2. **認証**: AWS Credentials または API Key が必要
3. **エラーハンドリング**: 座標範囲、距離制限のチェック
4. **レスポンス処理**: ルート描画用のGeometry データの活用
5. **パフォーマンス**: キャッシュ機能の検討

## 次のステップ
- Route Calculator リソースの作成
- フロントエンドでの統合実装
- マップ上でのルート描画機能の実装