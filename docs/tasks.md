# AccidentReport地図マーカー表示機能 実装計画

## 概要
AccidentReportデータを地図上にマーカーとして表示する機能を実装する。既存のMap.tsxコンポーネントにAccidentReportマーカー機能を統合し、データ可視化とインタラクション機能を提供する。

## 機能要件

### 基本機能
1. **マーカー表示**: AccidentReportデータ配列を受け取り、latitude/longitudeがあるデータを地図上にマーカー表示
2. **色分け表示**: 事故種別・損害レベル・死傷者数に基づくマーカー色分け
3. **サイズ調整**: 被害程度に応じたマーカーサイズ変更
4. **クリック詳細**: マーカークリック時にAccidentReportDetail表示
5. **自動フィット**: 全マーカーが表示されるよう地図範囲自動調整

### 視覚設計
- **死亡事故**: 黒色マーカー（最優先）
- **重傷事故**: 赤色マーカー
- **事故種別色分け**: 追突(#ff6b6b)、出会い頭(#4ecdc4)、右折時(#45b7d1)等
- **損害レベル**: 重大(#ff4444)、中程度(#ff8800)、軽微(#ffcc00)
- **サイズ**: 死傷者数に応じて10px-16px

### 関連ファイル
- `/frontend/app/components/Map.tsx` - メインマップコンポーネント（統合対象）
- `/frontend/app/hooks/useAccidentMarkers.ts` - マーカー管理フック（作成済み）
- `/frontend/app/types/AccidentReport.ts` - データ型定義（既存）
- `/frontend/app/components/AccidentReport/AccidentReportDetail.tsx` - 詳細表示（既存）
- `/frontend/app/data/mockAccidentReports.ts` - テストデータ（既存）

## 実装手順

### Phase 1: Map.tsx統合完成 (20分)
1. `useAccidentMarkers`フックをMap.tsxに統合
2. `accidentReports`プロップから受信したデータでマーカー表示
3. マーカークリック時のコールバック処理実装
1. **GraphQLスキーマ設計**
   - AccidentReport メインエンティティの定義
   - 58個のCSVカラムを適切なGraphQL型にマッピング
   - 必須フィールドとオプショナルフィールドの分類

2. **TypeScript型定義**
   - スキーマに対応した型定義ファイル作成
   - フロントエンド用のユーティリティ型定義

### Phase 2: テストデータ実装 (45分)
1. **モックデータ生成**
   - 実際のCSVヘッダーに基づく構造化データ作成
   - リアルな値を持つテストレコード（20件程度）
   - 各フィールドタイプに応じた適切なサンプルデータ

### Phase 2: 詳細表示機能 (15分)
1. **マーカークリック詳細表示**
   - AccidentReportDetailコンポーネントのポップアップ表示
   - モーダル形式での詳細情報表示
   - 閉じる機能とオーバーレイ処理

### Phase 3: メインページ統合 (10分)
1. **page.tsxでのマップ使用**
   - mockAccidentReportsデータを渡してマーカー表示テスト
   - マーカークリック時の詳細表示動作確認

### Phase 4: パフォーマンス対応 (15分)
1. **大量データ対応検討**
   - マーカークラスタリング必要性の検討
   - 表示件数制限とフィルタリング
   - 地図ズームレベル連動表示

## 制約事項

- **座標必須**: latitude/longitudeが存在するAccidentReportのみマーカー表示
- **既存機能保持**: Map.tsxの既存ルート計算・表示機能は影響を受けない
- **テストデータ使用**: 初期は/frontend/app/data/mockAccidentReports.tsのデータを使用

## 技術詳細

### useAccidentMarkersフック仕様（既実装済み）
```typescript
interface UseAccidentMarkersProps {
  map: maplibregl.Map | null;
  reports: AccidentReport[];
  onMarkerClick?: (report: AccidentReport) => void;
}

// 提供機能
- addMarker(report): 単一マーカー追加
- addMarkers(reports): 複数マーカー一括追加
- removeMarker(reportId): 特定マーカー削除
- clearMarkers(): 全マーカー削除
- getMarkerCount(): マーカー数取得
  vehicle1ModelType: String
  vehicle1BodyType: String
  vehicle1YearOfRegistration: Int
  vehicle1SeatingCapacity: Int
  vehicle1LoadAtTime: Float
  vehicle1MaxLoadCapacity: Float
  cargoContents: String
  
  # 危険物情報 (2項目)
  transportOfHazardousMaterial: Boolean
  typeOfHazardousMaterial: String
### Map.tsx統合コード案
```typescript
// Map.tsx内に追加
import { useAccidentMarkers } from '../hooks/useAccidentMarkers';

// useAccidentMarkersフック使用
const { addMarkers, clearMarkers, getMarkerCount } = useAccidentMarkers({
  map: mapInstanceRef.current,
  reports: accidentReports,
  onMarkerClick: onAccidentMarkerClick
});

// マーカー情報パネル表示
{accidentReports.length > 0 && (
  <div style={{ position: 'absolute', top: '20px', right: '20px', ... }}>
    <h3>事故マーカー情報</h3>
    <p>表示中: {getMarkerCount()}件</p>
  </div>
)}
```

### 実装優先度
1. **必須**: Map.tsx統合、マーカー表示、基本的な色分け
2. **重要**: マーカークリック詳細表示、自動地図フィット
3. **任意**: パフォーマンス最適化、高度な視覚効果
  description: String
  
  # システムフィールド
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}
```

### 必須実装機能
1. **基本CRUD操作**
   - 事故レポート一覧取得（ページネーション付き）
   - 事故レポート詳細取得
   - 事故レポート新規作成
   - 事故レポート更新・削除

2. **検索・フィルタリング**
   - 日付範囲検索
   - 地理的範囲検索（緯度経度）
   - 事故種別フィルター
   - 車両情報でのフィルター
   - 被害レベルでのソート

3. **データ表示**
   - レスポンシブテーブル表示
   - 詳細モーダル表示
## 成果物

### 実装済みファイル
1. **マーカー管理フック**: `/frontend/app/hooks/useAccidentMarkers.ts` ✅
2. **Map.tsx拡張**: interface更新、import追加 🔄
3. **型定義**: `/frontend/app/types/AccidentReport.ts` ✅
4. **テストデータ**: `/frontend/app/data/mockAccidentReports.ts` ✅（5件のCSVデータ）

### 実装予定ファイル
1. **Map.tsx統合完成**: useAccidentMarkersフック統合
2. **詳細表示統合**: マーカークリック→AccidentReportDetailモーダル
3. **page.tsx更新**: メインページでAccidentReportマーカー表示テスト

## 完了基準
- AccidentReportデータが地図上にマーカー表示される
- マーカーが事故種別・被害レベルで色分けされる
- マーカークリック時にAccidentReportDetail詳細が表示される
- 複数マーカーが表示される際に地図範囲が自動調整される
- 既存のルート機能に影響を与えない

## 制限事項
- 初期実装では大量データのパフォーマンス最適化は含まない
- マーカークラスタリングは将来の拡張として留保
- 地図上のマーカーフィルタリングは別機能として実装

## 次のステップ（実装後）
- ルート描画機能の追加
- 交通手段選択機能
- ルートオプション設定機能