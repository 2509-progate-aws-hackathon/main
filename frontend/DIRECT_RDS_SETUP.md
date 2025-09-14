# RDS Data API 直接アクセス実装

## 概要
セキュリティを無視してフロントエンドから直接 Aurora Serverless に PostGIS クエリを実行する実装です。

## 作成されたファイル

### 1. `/app/libs/directRDSClient.ts`
- RDS Data API クライアント
- PostGIS を使用したルート周辺事故検索
- 全事故データ取得
- 矩形範囲検索

### 2. `/app/hooks/useDirectRDS.ts` 
- React フック
- 状態管理（loading, error, results）
- 各種検索メソッド

### 3. `/app/test-rds/page.tsx`
- テスト用UI
- 各機能の動作確認
- デバッグ情報表示

## セットアップ手順

### 1. 環境変数設定
`.env.local` ファイルを作成：
```bash
# AWS基本設定
NEXT_PUBLIC_AWS_REGION=us-east-1

# Aurora Serverless 設定
NEXT_PUBLIC_AURORA_CLUSTER_ARN=arn:aws:rds:us-east-1:YOUR_ACCOUNT_ID:cluster:jiko-database
NEXT_PUBLIC_AURORA_SECRET_ARN=arn:aws:secretsmanager:us-east-1:YOUR_ACCOUNT_ID:secret:jiko-database-secret-XXXXX
NEXT_PUBLIC_AURORA_DATABASE_NAME=postgres

# AWS認証情報 (セキュリティ上推奨されない方法)
NEXT_PUBLIC_AWS_ACCESS_KEY_ID=AKIA...
NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY=...
```

### 2. 依存関係インストール
```bash
cd frontend
npm install
```

### 3. 実際の値に置き換え
`YOUR_ACCOUNT_ID` を実際のAWSアカウントIDに置き換える

### 4. IAM権限設定
使用するIAMユーザー/ロールに以下の権限を追加：

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "rds-data:ExecuteStatement",
                "rds-data:BeginTransaction", 
                "rds-data:CommitTransaction",
                "rds-data:RollbackTransaction"
            ],
            "Resource": "arn:aws:rds:us-east-1:*:cluster:jiko-database"
        },
        {
            "Effect": "Allow",
            "Action": [
                "secretsmanager:GetSecretValue"
            ],
            "Resource": "arn:aws:secretsmanager:us-east-1:*:secret:jiko-database-secret-*"
        }
    ]
}
```

## 使用方法

### 1. テストページでの確認
```
http://localhost:3000/test-rds
```

### 2. コンポーネント内での使用
```typescript
import { useDirectRDS } from '@/app/hooks/useDirectRDS';

function MyComponent() {
  const { accidents, loading, error, searchNearRoute } = useDirectRDS();

  const handleSearch = async () => {
    const routeLine = "LINESTRING(139.6917 35.6895, 139.6989 35.6866)";
    await searchNearRoute(routeLine, 100); // 100m以内を検索
  };

  return (
    <div>
      <button onClick={handleSearch}>ルート検索</button>
      {loading && <p>検索中...</p>}
      {error && <p>エラー: {error}</p>}
      <p>{accidents.length}件の事故が見つかりました</p>
    </div>
  );
}
```

## API リファレンス

### useDirectRDS フック

#### メソッド
- `searchNearRoute(routeLine: string, distanceMeters?: number)` - ルート周辺検索
- `getAllAccidents(limit?: number)` - 全事故データ取得
- `searchInBounds(minLat, maxLat, minLng, maxLng)` - 矩形範囲検索
- `clearResults()` - 結果クリア

#### 状態
- `accidents: Accident[]` - 検索結果
- `loading: boolean` - 読み込み状態
- `error: string | null` - エラーメッセージ

## データベース情報

- **エンドポイント**: jiko-database.cluster-c0x2uo6863wb.us-east-1.rds.amazonaws.com
- **リージョン**: us-east-1
- **データベース**: postgres
- **拡張**: PostGIS (geography型サポート)

## PostGIS クエリ例

```sql
-- ルートから100m以内の事故を検索
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
    100
)
AND a.latitude IS NOT NULL 
AND a.longitude IS NOT NULL
ORDER BY distance_meters;
```

## セキュリティ上の注意

⚠️ **この実装はセキュリティを無視しています**

- フロントエンドからの直接データベースアクセス
- 環境変数での認証情報管理
- CORS制限なし
- 本番環境では使用しないこと

## トラブルシューティング

### よくあるエラー

1. **認証エラー**
   - AWS認証情報の確認
   - IAM権限の確認
   - リージョン設定の確認

2. **接続エラー**
   - クラスターARNの確認
   - シークレットARNの確認
   - Data API有効化の確認

3. **PostGISエラー**
   - PostGIS拡張の有効化確認
   - WKT形式の確認
   - 座標系(SRID)の確認