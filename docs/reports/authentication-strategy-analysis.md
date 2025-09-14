# ユーザーデータ不要サービスでの認証方式選択 調査レポート

## 現在の状況
- **サービス特性**: ユーザーデータを管理しないシンプルな位置情報サービス
- **機能**: マップ表示、2点間のルート計算
- **ユーザー管理**: 不要（匿名利用）

## 認証方式の選択肢

### 1. API Key 認証（推奨）

#### メリット
- **シンプル**: ユーザー登録・ログイン不要
- **軽量**: 認証フロー一切なし
- **適用範囲**: Maps, Places, Routes APIに対応 ✓
- **匿名利用**: 完全に匿名でサービス利用可能

#### デメリット
- **セキュリティ**: APIキーがクライアントに露出
- **制限**: 一部のLocation Service機能のみ利用可能
- **管理**: ドメイン制限・有効期限管理が必要

#### 実装方法
```typescript
import { withAPIKey } from "@aws/amazon-location-utilities-auth-helper";

const authHelper = withAPIKey("<API Key>", "<Region>");
const client = new GeoRoutesClient(authHelper.getClientConfig());
```

### 2. Cognito Identity Pool（未認証）

#### メリット
- **セキュリティ**: 一時的な認証情報を動的生成
- **AWS統合**: 他のAWSサービスとの連携が容易
- **柔軟性**: 将来的にユーザー認証に拡張可能

#### デメリット
- **複雑**: 設定と実装が複雑
- **オーバーヘッド**: 単純なサービスには過剰

#### 実装方法
```typescript
import { withIdentityPoolId } from "@aws/amazon-location-utilities-auth-helper";

const authHelper = await withIdentityPoolId(identityPoolId);
const client = new GeoRoutesClient(authHelper.getClientConfig());
```

### 3. Cognito User Pool（完全認証）

#### 現在のプロジェクトでは不要
- ユーザーデータ管理が不要
- ログイン機能が不要
- 過度なセキュリティ要件

## 推奨アプローチ: API Key認証

### 理由
1. **要件適合**: ユーザーデータ不要の匿名サービスに最適
2. **実装簡易**: 最小限のコード変更で済む
3. **十分なセキュリティ**: ドメイン制限で基本的なセキュリティを確保
4. **コスト効率**: 余計な認証インフラが不要

### 必要なライブラリ
```bash
npm install @aws/amazon-location-utilities-auth-helper
```

### セキュリティ対策
- **ドメイン制限**: 特定ドメインからのみAPI使用可能に設定
- **Referrer制限**: HTTPリファラーによるアクセス制限
- **有効期限設定**: 定期的なキーローテーション

## 実装手順

### 1. API Keyの作成
- AWS Location Service コンソールでAPI Key作成
- Routes APIへのアクセス許可を設定
- ドメイン制限を設定

### 2. useRouteCalculationフックの修正
```typescript
import { withAPIKey } from "@aws/amazon-location-utilities-auth-helper";

const authHelper = withAPIKey(
  process.env.NEXT_PUBLIC_LOCATION_API_KEY!, 
  process.env.NEXT_PUBLIC_AWS_REGION!
);
const client = new GeoRoutesClient(authHelper.getClientConfig());
```

### 3. 環境変数の追加
```bash
NEXT_PUBLIC_LOCATION_API_KEY=your_api_key_here
```

## 将来の拡張可能性

### ユーザー管理が必要になった場合
- Cognito Identity Poolに移行
- 既存のAPI Key認証と併用可能
- 段階的な移行が可能

### 結論
**現在の要件ではAPI Key認証が最適解**
- Cognitoは不要
- シンプルで効率的
- 十分なセキュリティレベル