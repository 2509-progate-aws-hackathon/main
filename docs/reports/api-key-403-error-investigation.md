# API Key 403 Forbidden エラー調査レポート

## エラー内容
```
POST https://routes.geo.us-east-1.amazonaws.com/v2/routes?key=v1.public.eyJqdGki... 403 (Forbidden)
Route calculation error: 403: User is not authorized to access this resource with an explicit deny
```

## 問題の原因分析

### 1. API Key権限不足
現在使用中のAPI Keyが Routes API へのアクセス権限を持っていない可能性があります。

### 2. API Key設定の確認が必要な項目
- **Restrictions**: Routes API が許可されているか
- **Domain Restrictions**: 現在のドメインが許可されているか  
- **Expiration**: API Keyが有効期限内か
- **Resource Access**: 適切なリソースへのアクセス権限があるか

### 3. 使用中のAPI Key情報
- **Key**: `v1.public.eyJqdGki...` (Map用のAPI Key)
- **用途**: 元々はMap表示用に設定されたAPI Key
- **問題**: Routes API用の権限が設定されていない可能性

## 解決方法

### 方法1: 既存API Keyに権限追加（推奨）

#### AWS Location Service コンソールでの設定
1. **Location Service Console** → **API keys**
2. 既存のAPI Keyを選択
3. **Permissions** → **Edit**
4. **Routes** にチェックを追加
5. 必要に応じて **Calculate routes** アクションを追加

#### 必要な権限設定
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "geo-routes:CalculateRoutes"
      ],
      "Resource": "*"
    }
  ]
}
```

### 方法2: Routes専用API Key作成

#### 新しいAPI Key作成手順
1. **AWS Location Service Console** → **Create API key**
2. **Name**: `routes-api-key`
3. **Restrictions**: 
   - API actions: `CalculateRoutes`
   - Domains: 現在のドメイン（localhost:3001 等）
4. **Expiration**: 必要に応じて設定

### 方法3: 環境変数分離

#### 異なるAPI Keyを使用
```bash
# .env.local
NEXT_PUBLIC_MAP_API_KEY=<Map用のAPI Key>
NEXT_PUBLIC_ROUTES_API_KEY=<Routes用のAPI Key>
```

#### useRouteCalculationフックの修正
```typescript
const apiKey = process.env.NEXT_PUBLIC_ROUTES_API_KEY || process.env.NEXT_PUBLIC_MAP_API_KEY;
```

## 緊急対応

### 一時的な解決策
既存のCognito Identity Poolを使用した認証に切り替える（認証情報が既に設定されている場合）

```typescript
// Cognito認証を使用する場合
import { fetchAuthSession } from 'aws-amplify/auth';

const session = await fetchAuthSession();
const client = new GeoRoutesClient({
  region: 'us-east-1',
  credentials: session.credentials,
});
```

## 次のステップ
1. **AWS Console確認**: 現在のAPI Key設定を確認
2. **権限追加**: Routes APIアクセス権限を追加
3. **テスト**: 修正後の動作確認
4. **セキュリティ確認**: ドメイン制限の適切な設定

## 参考情報
- [AWS Location Service API Keys](https://docs.aws.amazon.com/location/latest/developerguide/using-apikeys.html)
- [Routes API Documentation](https://docs.aws.amazon.com/location/latest/APIReference/API_CalculateRoute.html)

## 推奨アクション
最も簡単な解決方法は、AWS Location Service コンソールで既存のAPI KeyにRoutes API権限を追加することです。