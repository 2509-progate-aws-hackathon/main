# 実装計画: マーカー設置後のシミュレーション開始UI実装

## 概要
現在のマップコンポーネントを拡張し、2点のマーカー設置後に「シミュレーション開始」ボタンを表示し、段階的な処理状況をユーザーに明示する機能を実装する。

## 関連ファイル
- `/frontend/app/components/Map.tsx` - メインのマップコンポーネント
- `/frontend/app/hooks/useRouteCalculation.ts` - ルート計算フック（既存）
- `/frontend/app/hooks/useAccidentReports.ts` - 事故情報検索フック（既存）
- `/frontend/app/types/AccidentReport.ts` - 事故レポート型定義（既存）

## 必要最小限の要件

### 1. UI変更
- 2点設置完了時に自動ルート計算を停止
- 「シミュレーション開始」ボタンを表示
- 処理段階表示エリアを追加

### 2. 段階的処理状態の管理
以下の3段階を定義し、状態管理を行う：
1. `searching-route` - ルートを検索中...
2. `searching-accidents` - 付近の事故情報を検索中...
3. `simulating` - シミュレーション中...

### 3. 新規フックの作成
`useSimulationProcess` フックを作成し、以下を管理：
- 現在の処理段階
- 各段階の完了状態
- エラー処理

### 4. 実装詳細

#### Map.tsx の変更点
- startPointとendPointが設定された時の自動ルート計算を停止
- シミュレーション開始ボタンの追加（2点設置完了時のみ表示）
- 処理段階表示コンポーネントの追加
- シミュレーション開始時の処理フロー制御

#### useSimulationProcess.ts の作成
```typescript
type SimulationStage = 'idle' | 'searching-route' | 'searching-accidents' | 'simulating' | 'completed';

interface UseSimulationProcessResult {
  currentStage: SimulationStage;
  isRunning: boolean;
  error: string | null;
  startSimulation: (startPoint: Point, endPoint: Point) => Promise<void>;
  resetSimulation: () => void;
}
```

#### 処理フロー
1. ユーザーがシミュレーション開始ボタンをクリック
2. `searching-route` 段階開始 → useRouteCalculation を呼び出し
3. ルート計算完了後 → `searching-accidents` 段階開始 → 空の実装
4. 事故情報検索完了後 → `simulating` 段階開始 → 空の実装
5. シミュレーション完了 → `completed` 段階

### 5. UI表示仕様
- 各段階でローディングスピナーと説明文を表示
- 完了した段階にはチェックマークを表示
- エラー発生時は該当段階にエラー表示
- シミュレーション中はボタンを無効化

### 6. 制約事項
- 段階2（事故情報検索）と段階3（シミュレーション）の内部ロジックは空実装
- 段階1（ルート検索）のみ既存のuseRouteCalculationを使用
- UI/UXの改善のみに集中し、実際のデータ処理は後回し

## 接続テスト手順

### Phase 1: 基本接続確認 (15分)

#### 1.1 AWS Data API での接続テスト
```bash
# データベース一覧確認
aws rds-data execute-statement \
    --resource-arn "arn:aws:rds:us-east-1:083439127731:cluster:jiko-database" \
    --secret-arn "arn:aws:secretsmanager:us-east-1:083439127731:secret:rds!cluster-8a98f81d-7591-4f2b-854e-fe3c3a895595-LBPj3O" \
    --region us-east-1 \
    --sql "SELECT version();"

# 既存データベース一覧取得
aws rds-data execute-statement \
    --resource-arn "arn:aws:rds:us-east-1:083439127731:cluster:jiko-database" \
    --secret-arn "arn:aws:secretsmanager:us-east-1:083439127731:secret:rds!cluster-8a98f81d-7591-4f2b-854e-fe3c3a895595-LBPj3O" \
    --region us-east-1 \
    --sql "SELECT datname FROM pg_database WHERE datistemplate = false;"
```

#### 1.2 既存テーブル構造の確認
```bash
# 接続するデータベースを指定してテーブル一覧取得
aws rds-data execute-statement \
    --resource-arn "arn:aws:rds:us-east-1:083439127731:cluster:jiko-database" \
    --secret-arn "arn:aws:secretsmanager:us-east-1:083439127731:secret:rds!cluster-8a98f81d-7591-4f2b-854e-fe3c3a895595-LBPj3O" \
    --region us-east-1 \
    --database "postgres" \
    --sql "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';"
```

#### 1.3 テスト用テーブル作成確認
```bash
# 簡単なテストテーブル作成
aws rds-data execute-statement \
    --resource-arn "arn:aws:rds:us-east-1:083439127731:cluster:jiko-database" \
    --secret-arn "arn:aws:secretsmanager:us-east-1:083439127731:secret:rds!cluster-8a98f81d-7591-4f2b-854e-fe3c3a895595-LBPj3O" \
    --region us-east-1 \
    --database "postgres" \
    --sql "CREATE TABLE IF NOT EXISTS connection_test (
        id SERIAL PRIMARY KEY,
        message VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );"

# テストデータ挿入
aws rds-data execute-statement \
    --resource-arn "arn:aws:rds:us-east-1:083439127731:cluster:jiko-database" \
    --secret-arn "arn:aws:secretsmanager:us-east-1:083439127731:secret:rds!cluster-8a98f81d-7591-4f2b-854e-fe3c3a895595-LBPj3O" \
    --region us-east-1 \
    --database "postgres" \
    --sql "INSERT INTO connection_test (message) VALUES ('Hello from Amplify!');"

# データ取得確認
aws rds-data execute-statement \
    --resource-arn "arn:aws:rds:us-east-1:083439127731:cluster:jiko-database" \
    --secret-arn "arn:aws:secretsmanager:us-east-1:083439127731:secret:rds!cluster-8a98f81d-7591-4f2b-854e-fe3c3a895595-LBPj3O" \
    --region us-east-1 \
    --database "postgres" \
    --sql "SELECT * FROM connection_test;"
```

### Phase 2: Amplify統合テスト準備 (20分)

#### 2.1 AppSyncリソース確認
```bash
# 既存のAppSync APIを確認
aws appsync list-graphql-apis --region us-east-1

# データソース一覧確認
aws appsync list-data-sources --api-id <API_ID> --region us-east-1
```

#### 2.2 IAMロール・ポリシー確認
```bash
# AppSync用サービスロール確認
aws iam list-roles --query "Roles[?contains(RoleName, 'AppSync') || contains(RoleName, 'appsync')]"

# RDS Data API アクセス権限確認
aws iam list-attached-role-policies --role-name <APPSYNC_ROLE_NAME>
```

#### 2.3 必要なIAMポリシー作成（存在しない場合）
```bash
# AppSync用RDS Data APIアクセスポリシー
cat > appsync-rds-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "rds-data:ExecuteStatement",
                "rds-data:BatchExecuteStatement",
                "rds-data:BeginTransaction",
                "rds-data:CommitTransaction",
                "rds-data:RollbackTransaction"
            ],
            "Resource": "arn:aws:rds:us-east-1:083439127731:cluster:jiko-database"
        },
        {
            "Effect": "Allow",
            "Action": [
                "secretsmanager:GetSecretValue",
                "secretsmanager:DescribeSecret"
            ],
            "Resource": "arn:aws:secretsmanager:us-east-1:083439127731:secret:rds!cluster-*"
        }
    ]
}
EOF
```

### Phase 3: Amplify設定更新 (25分)

#### 3.1 backend.tsでのクラスター接続設定
- 既存のAmplifyバックエンド設定を確認
- Aurora接続用のカスタムリソース追加
- 環境変数設定

#### 3.2 GraphQLスキーマ作成
- 接続テスト用の簡単なスキーマ定義
- PostgreSQL型との対応確認
- AppSyncリゾルバー設定

#### 3.3 フロントエンド接続テスト
- 簡単なクエリでデータ取得確認
- エラーハンドリング確認
- 認証状態での動作確認

## 予想される課題と対策

### 1. 認証・権限問題
- **問題**: AppSyncからRDS Data APIへのアクセス拒否
- **対策**: IAMロール・ポリシーの詳細確認と修正

### 2. ネットワーク接続問題
- **問題**: VPC設定によるアクセス制限
- **対策**: セキュリティグループ設定確認

### 3. Data API制限
- **問題**: 同時接続数や実行時間制限
- **対策**: 適切なクエリ設計と分割処理

### 4. スキーマ不整合
- **問題**: PostgreSQL型とGraphQL型の不一致
- **対策**: 型マッピング表作成と変換ロジック実装

## 成功基準

### Phase 1完了基準
- [ ] AWS CLIでのData API接続成功
- [ ] 基本的なSQL文実行成功（SELECT, INSERT）
- [ ] 既存テーブル構造の把握

### Phase 2完了基準
- [ ] AppSyncリソースの現状把握
- [ ] 必要なIAM権限の設定完了
- [ ] Data APIアクセステスト成功

### Phase 3完了基準  
- [ ] AmplifyからAuroraへの接続成功
- [ ] GraphQL経由でのデータ読み書き成功
- [ ] フロントエンドでのデータ表示成功

## 次のステップ
1. **Phase 1実行**: AWS CLIでの基本接続確認
2. **現状分析**: 発見された問題点の整理
3. **Phase 2実行**: Amplify統合準備
4. **Phase 3実行**: 完全統合テスト
5. **本格実装**: 事故データテーブル設計と実装

## 注意事項
- **本番環境**: `jiko-database`が本番データを含む可能性があるため慎重に操作
- **削除保護**: DeletionProtection が有効なため、誤削除の心配なし
- **バックアップ**: 操作前に現在の状態を記録
- **ログ監視**: CloudWatch Logsでエラー状況を監視

## 参考資料
- [Aurora Serverless Data API Documentation](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/data-api.html)
- [AppSync RDS Integration Guide](https://docs.aws.amazon.com/appsync/latest/devguide/tutorial-rds-resolvers.html)  
- [Amplify Gen2 Data Documentation](https://docs.amplify.aws/gen2/build-a-backend/data/)
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