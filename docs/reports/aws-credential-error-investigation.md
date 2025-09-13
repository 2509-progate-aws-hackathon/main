# AWS認証エラー（Credential is missing）調査レポート

## エラー内容
```
Route calculation error: Error: Credential is missing
    at runtimeConfig.browser.js:22:102
    at fn (resolveAwsSdkSigV4Config.js:127:35)
    at httpAuthSchemeMiddleware.js:33:29
    at async loggerMiddleware.js:3:26
    at async useRouteCalculation.useCallback[calculateRoute] (useRouteCalculation.ts:46:24)
```

## 問題の原因
GeoRoutesClientの初期化時にAWS認証情報（Credentials）が設定されていないため、APIリクエストが失敗している。

## 現在の状況分析

### 1. 設定状況
- **Amplify設定**: `amplify_outputs.json`が存在し、Cognito認証が設定済み
- **リージョン**: `us-east-1`
- **環境変数**: `.env.local`でMap APIキーとリージョンが設定済み

### 2. 問題点
- **Amplify Auth未初期化**: フロントエンドでAmplifyの初期化が行われていない
- **認証状態なし**: ユーザーがサインインしていない状態
- **Credentials未設定**: GeoRoutesClientに認証情報が渡されていない

## 解決方法

### 方法1: Amplify認証を使用（推奨）

#### 1. Amplifyライブラリのセットアップ
```bash
npm install @aws-amplify/ui-react
```

#### 2. Amplify初期化（layout.tsx）
```tsx
import { Amplify } from 'aws-amplify';
import amplifyconfig from './amplify_outputs.json';

Amplify.configure(amplifyconfig);
```

#### 3. Authenticatorコンポーネント追加
```tsx
import { withAuthenticator } from '@aws-amplify/ui-react';
```

#### 4. GeoRoutesClientでAmplify認証情報使用
```tsx
import { fetchAuthSession } from 'aws-amplify/auth';

const session = await fetchAuthSession();
const client = new GeoRoutesClient({
  region: 'us-east-1',
  credentials: session.credentials,
});
```

### 方法2: API Key認証（簡単）

#### GeoRoutesClientでAPI Key使用
```tsx
const client = new GeoRoutesClient({
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'dummy', // API Key使用時は不要だが必須パラメータ
    secretAccessKey: 'dummy',
  },
  // API Keyを使用する場合の設定
});
```

### 方法3: 環境変数でCredentials設定

#### 環境変数追加（.env.local）
```bash
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
```

## 実装の選択肢

### 最適解: Amplify認証統合
1. **セキュリティ**: Cognitoの一時的なCredentialsを使用
2. **管理**: ユーザーごとの認証状態管理
3. **拡張性**: 他のAWSサービスとの連携が容易

### 簡単解: API Key使用
1. **実装**: 認証フローが不要
2. **制限**: セキュリティが低い
3. **用途**: プロトタイプや開発段階

## 次のステップ
1. Amplify認証の実装（推奨）
2. useRouteCalculationフックの認証情報統合
3. エラーハンドリングの改善

## 参考URL
- [Amplify Auth Setup](https://docs.amplify.aws/javascript/build-a-backend/auth/set-up-auth/)
- [Amplify Auth Sign-in](https://docs.amplify.aws/javascript/build-a-backend/auth/connect-your-frontend/sign-in/)
- [AWS SDK Credentials Configuration](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/setting-credentials.html)