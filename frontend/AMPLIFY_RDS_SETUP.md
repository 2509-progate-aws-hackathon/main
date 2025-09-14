# Amplify認証 + RDS Data API セットアップ

## 概要
Amplify Cognito Identity Poolを使用して、セキュアにRDS Data APIにアクセスする実装です。
認証情報のハードコード不要で、一時的な認証情報を自動取得します。

## 🆕 新しいアプローチ
- ✅ **セキュア**: Cognito Identity Poolで一時認証情報を取得
- ✅ **認証情報不要**: AWS Access Key/Secret Keyのハードコード不要
- ✅ **IAM制御**: 最小権限でRDS Data APIアクセス
- ✅ **PostGIS対応**: 地理空間クエリをフロントエンドから実行

## 📁 作成されたファイル

### 認証版
1. **`/app/libs/amplifyRDSClient.ts`** - Amplify認証使用のRDSクライアント
2. **`/app/hooks/useAmplifyRDS.ts`** - セキュアなReactフック
3. **`/app/test-amplify-rds/page.tsx`** - 認証版テストUI

### バックエンド設定
4. **`/amplify/auth/resource.ts`** - Cognitoの設定
5. **`/amplify/backend.ts`** - IAMロール権限追加

## 🚀 セットアップ手順

### 1. 環境変数設定
`.env.local` を作成：
```bash
# AWS基本設定
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_AWS_ACCOUNT_ID=あなたのアカウントID

# Aurora設定
NEXT_PUBLIC_AURORA_CLUSTER_ARN=arn:aws:rds:us-east-1:アカウントID:cluster:jiko-database
NEXT_PUBLIC_AURORA_SECRET_ARN=arn:aws:secretsmanager:us-east-1:アカウントID:secret:jiko-database-secret-XXXXXX
NEXT_PUBLIC_AURORA_DATABASE_NAME=postgres
```

### 2. 依存関係インストール
```bash
cd frontend
npm install
```

### 3. Amplifyデプロイ
```bash
npx ampx deploy
```

### 4. テスト実行
```bash
npm run dev
# http://localhost:3000/test-amplify-rds にアクセス
```

## 🔧 認証フロー

### Cognito Identity Pool
1. **ゲストアクセス有効**: ログイン不要で一時認証情報取得
2. **IAMロール**: `unauthenticatedUserIamRole` に RDS Data API 権限付与
3. **一時認証情報**: セッショントークン付きの安全な認証情報

### 権限設定 (自動)
backend.ts で以下の権限を自動設定：
```typescript
// RDS Data API権限
"rds-data:ExecuteStatement",
"rds-data:BeginTransaction", 
"rds-data:CommitTransaction",
"rds-data:RollbackTransaction"

// Secrets Manager権限  
"secretsmanager:GetSecretValue"
```

## 🧪 テスト機能

### `/test-amplify-rds` ページで可能なテスト
1. **🔍 データベース診断**
   - テーブル存在確認
   - PostGIS拡張確認

2. **📊 基本データ取得**
   - 最新100件/500件取得
   - パフォーマンステスト

3. **🛣️ PostGISルート検索**
   - WKT形式ルートライン入力
   - 距離指定検索（デフォルト100m）
   - プリセットルート（渋谷→新宿、東京→新宿）

## 📋 API使用例

### コンポーネント内での使用
```typescript
import { useAmplifyRDS } from '@/app/hooks/useAmplifyRDS';

function MyComponent() {
  const { 
    accidents, 
    loading, 
    error, 
    dbStatus,
    searchNearRoute, 
    checkDatabase 
  } = useAmplifyRDS();

  // データベース状態確認
  const handleCheckDB = async () => {
    await checkDatabase();
    console.log('DB Status:', dbStatus);
  };

  // ルート周辺検索
  const handleRouteSearch = async () => {
    const route = "LINESTRING(139.6917 35.6895, 139.6989 35.6866)";
    await searchNearRoute(route, 100);
  };

  return (
    <div>
      <button onClick={handleCheckDB}>DB接続テスト</button>
      <button onClick={handleRouteSearch}>ルート検索</button>
      
      {loading && <p>処理中...</p>}
      {error && <p>エラー: {error}</p>}
      {dbStatus && (
        <div>
          <p>テーブル存在: {dbStatus.tableExists ? 'Yes' : 'No'}</p>
          <p>PostGIS: {dbStatus.hasPostGIS ? 'Yes' : 'No'}</p>
        </div>
      )}
      
      <ul>
        {accidents.map(acc => (
          <li key={acc.id}>
            {acc.location} - {acc.distance_meters}m
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## 🎯 PostGISクエリ例

### 実行されるSQL
```sql
-- ルートから100m以内の事故検索
SELECT 
    a.id,
    a.location,
    a.accident_date, 
    a.severity,
    a.latitude,
    a.longitude,
    ST_Distance(
        ST_Transform(ST_Point(a.longitude, a.latitude), 3857), 
        ST_Transform(ST_GeomFromText($1, 4326), 3857)
    ) as distance_meters
FROM accident_reports a
WHERE ST_DWithin(
    ST_Transform(ST_Point(a.longitude, a.latitude), 3857),
    ST_Transform(ST_GeomFromText($1, 4326), 3857),
    $2
)
AND a.latitude IS NOT NULL 
AND a.longitude IS NOT NULL
ORDER BY distance_meters
LIMIT 100;
```

### WKT形式例
```javascript
// 渋谷→新宿の直線ルート
"LINESTRING(139.6917 35.6895, 139.6989 35.6866)"

// 複数ポイントのルート
"LINESTRING(139.6917 35.6895, 139.6950 35.6880, 139.6989 35.6866)"
```

## 🚨 トラブルシューティング

### よくあるエラーと解決方法

#### 1. "credential is missing"
```bash
# 解決: Amplifyデプロイが必要
npx ampx deploy
```

#### 2. "No credentials available from Amplify session"
```bash
# 解決: amplify_outputs.json確認
ls -la amplify_outputs.json

# 再デプロイ
npx ampx deploy
```

#### 3. "AccessDenied" エラー
- backend.ts のIAM権限確認
- クラスターARN、シークレットARNの確認
- リージョン設定の確認

#### 4. "Table does not exist"
- jiko-databaseにaccident_reportsテーブルが存在するか確認
- PostGIS拡張が有効化されているか確認

## 📊 パフォーマンス

### 最適化のポイント
- **接続プール**: RDS Data APIは自動で接続管理
- **結果制限**: LIMIT句でレスポンスサイズ制御
- **インデックス**: 地理空間インデックス(GiST)推奨
- **座標変換**: Web Mercator(3857)で正確な距離計算

### 制限事項
- **同時接続数**: RDS Data APIの制限に準拠
- **クエリタイムアウト**: 45秒
- **結果セットサイズ**: 1MB上限

## 🔒 セキュリティ

### ✅ 安全な点
- 一時認証情報使用
- IAM最小権限
- フロントエンドに永続認証情報なし
- Secrets Manager経由でDB認証情報取得

### ⚠️ 注意点
- ゲストアクセス有効（制限付きアクセス）
- 公開データベースへの接続
- CORS設定による制限

これでセキュアかつ簡単にRDS Data APIにアクセスできます！