# AWS Geo Routes API を使用した2点間距離計算機能 実装計画

## 要件
- 既存のMapコンポーネントに2点間の距離計算機能を追加
- AWS Geo Routes API の CalculateRoutesCommand を使用
- startPoint と endPoint が設定された時に自動計算
- 計算結果（距離・所要時間）をUIに表示
- 最小の実装にとどめる

## 実装ファイル
- `/home/yotu/github/2509-progate-aws/main/frontend/app/components/Map.tsx`
- 新規作成: `/home/yotu/github/2509-progate-aws/main/frontend/app/hooks/useRouteCalculation.ts`

## 実装内容

### 1. AWS SDK のセットアップ
- `@aws-sdk/client-geo-routes` の CalculateRoutesCommand を使用 ✓ (インストール済み)
- GeoRoutesClient の初期化
- AWS認証情報の設定

### 2. カスタムフック作成 (useRouteCalculation)
- startPoint と endPoint を受け取り、ルート計算を実行
- loading 状態の管理
- error ハンドリング
- 計算結果（distance, duration）を返却

### 3. Map コンポーネントの拡張
- useRouteCalculation フックの統合
- startPoint と endPoint の両方が設定された時に自動計算
- 計算結果の状態管理
- UI表示部分の追加

### 4. UI表示機能
- 距離と所要時間の表示エリア
- 計算中のローディング表示
- エラー時のメッセージ表示
- シンプルなスタイリング

### 5. CalculateRoutesCommand のパラメータ設定
```typescript
{
  Origin: [startPoint.lng, startPoint.lat],
  Destination: [endPoint.lng, endPoint.lat], 
  TravelMode: "Car",
  IncludeLegGeometry: false, // 最小実装のため無効
  OptimizeFor: "FastestRoute"
}
```

### 6. レスポンス処理
- Routes[0].Summary.Distance (距離)
- Routes[0].Summary.Duration (所要時間)
- 適切な単位での表示（km, 分）

## 環境変数の設定
- AWS認証情報（AmplifyのデフォルトCredentialsを使用予定）
- リージョン設定

## エラーハンドリング
- 認証エラー (AccessDeniedException)
- ネットワークエラー
- 座標不正エラー (ValidationException)
- サービス制限エラー (ThrottlingException)

## 最小実装の範囲
- 基本的な距離・時間計算のみ
- ルート描画は含まない
- 詳細な交通情報は含まない
- リセット機能は含まない

## 技術的詳細
- React hooks パターンの使用
- async/await による非同期処理
- useEffect での自動計算トリガー
- TypeScript型安全性の確保

## 次のステップ（実装後）
- ルート描画機能の追加
- 交通手段選択機能
- ルートオプション設定機能