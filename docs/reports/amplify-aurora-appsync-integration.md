# 調査レポート: Amplify と Aurora Serverless を AppSync で接続する方法

## 概要
Amplify、Aurora Serverless、AppSyncを統合してGraphQL APIを通じてリレーショナルデータベースにアクセスする方法について、AWS公式ドキュメントから調査した結果をまとめます。

## 公式ドキュメント出典

### 主要なドキュメント
1. **AppSync Aurora Serverless チュートリアル**
   - 出典: https://docs.aws.amazon.com/appsync/latest/devguide/tutorial-rds-resolvers.html
   - AWS AppSync Developer Guide - Tutorial: Aurora Serverless

2. **Amplify Gen2 データ接続**
   - 出典: https://docs.amplify.aws/gen2/build-a-backend/data/
   - 出典: https://docs.amplify.aws/gen2/build-a-backend/data/connect-from-server-runtime/

## アーキテクチャ概要

```
Amplify Gen2 Frontend
    ↓ GraphQL
AppSync API
    ↓ Data API
Aurora Serverless v2
    ↓ 認証
AWS Secrets Manager
```

## 実装手順（既存Auroraインスタンス使用）

### 1. 既存Aurora インスタンスの確認と準備

#### 前提条件
- 既存のAurora クラスターとインスタンスが存在
- クラスター識別子とエンドポイント情報を把握
- マスターユーザー名とパスワードを把握

#### 既存クラスター情報の取得
```bash
# 既存クラスター情報を確認
aws rds describe-db-clusters \
    --db-cluster-identifier YOUR_EXISTING_CLUSTER_NAME \
    --query "DBClusters[0].{ClusterArn:DBClusterArn,Endpoint:Endpoint,Engine:Engine,EngineVersion:EngineVersion,Status:Status}"

# 既存インスタンス情報を確認  
aws rds describe-db-instances \
    --db-cluster-identifier YOUR_EXISTING_CLUSTER_NAME \
    --query "DBInstances[*].{InstanceId:DBInstanceIdentifier,Class:DBInstanceClass,Status:DBInstanceStatus}"
```

#### Data API の有効化（既存クラスター）
```bash
# 既存クラスターでData APIを有効化
aws rds modify-db-cluster \
    --db-cluster-identifier YOUR_EXISTING_CLUSTER_NAME \
    --enable-http-endpoint \
    --apply-immediately
```

#### 認証情報の設定（既存クラスター用）
```bash
# 既存クラスターの認証情報JSON作成
echo '{
    "username": "YOUR_EXISTING_MASTER_USERNAME",
    "password": "YOUR_EXISTING_MASTER_PASSWORD"
}' > existing-creds.json

# Secrets Manager でシークレット作成
aws secretsmanager create-secret \
    --name ExistingAuroraSecret \
    --secret-string file://existing-creds.json \
    --region YOUR_REGION
```

### 2. Data API の検証と既存データベース確認

#### Data API 動作確認
```bash
# Data API が有効になっているか確認
aws rds-data execute-statement \
    --resource-arn "arn:aws:rds:YOUR_REGION:YOUR_ACCOUNT:cluster:YOUR_EXISTING_CLUSTER_NAME" \
    --secret-arn "arn:aws:secretsmanager:YOUR_REGION:YOUR_ACCOUNT:secret:ExistingAuroraSecret-XXXXXX" \
    --region YOUR_REGION \
    --sql "SELECT VERSION()"

# 既存データベース一覧を確認
aws rds-data execute-statement \
    --resource-arn "arn:aws:rds:YOUR_REGION:YOUR_ACCOUNT:cluster:YOUR_EXISTING_CLUSTER_NAME" \
    --secret-arn "arn:aws:secretsmanager:YOUR_REGION:YOUR_ACCOUNT:secret:ExistingAuroraSecret-XXXXXX" \
    --region YOUR_REGION \
    --sql "SHOW DATABASES"

# 既存テーブル一覧を確認（データベース名を指定）
aws rds-data execute-statement \
    --resource-arn "arn:aws:rds:YOUR_REGION:YOUR_ACCOUNT:cluster:YOUR_EXISTING_CLUSTER_NAME" \
    --secret-arn "arn:aws:secretsmanager:YOUR_REGION:YOUR_ACCOUNT:secret:ExistingAuroraSecret-XXXXXX" \
    --region YOUR_REGION \
    --database "YOUR_EXISTING_DATABASE_NAME" \
    --sql "SHOW TABLES"
```

#### 新しいテーブル作成（必要な場合）
```bash
# 新しいテーブルを作成する場合の例
aws rds-data execute-statement \
    --resource-arn "arn:aws:rds:YOUR_REGION:YOUR_ACCOUNT:cluster:YOUR_EXISTING_CLUSTER_NAME" \
    --secret-arn "arn:aws:secretsmanager:YOUR_REGION:YOUR_ACCOUNT:secret:ExistingAuroraSecret-XXXXXX" \
    --region YOUR_REGION \
    --database "YOUR_EXISTING_DATABASE_NAME" \
    --sql "CREATE TABLE IF NOT EXISTS your_table(id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
```

### 3. AppSync API とスキーマ設定（既存データベーススキーマに合わせて）

#### 既存テーブル構造の確認
```bash
# 既存テーブルの構造を確認
aws rds-data execute-statement \
    --resource-arn "arn:aws:rds:YOUR_REGION:YOUR_ACCOUNT:cluster:YOUR_EXISTING_CLUSTER_NAME" \
    --secret-arn "arn:aws:secretsmanager:YOUR_REGION:YOUR_ACCOUNT:secret:ExistingAuroraSecret-XXXXXX" \
    --region YOUR_REGION \
    --database "YOUR_EXISTING_DATABASE_NAME" \
    --sql "DESCRIBE your_existing_table"
```

#### GraphQL スキーマ例（既存テーブルに対応）
```graphql
# 既存のテーブル構造に合わせてスキーマを定義
type Query {
    # 既存データの取得
    getItem(id: ID!): Item
    listItems(limit: Int, nextToken: String): ItemConnection
    searchItems(filter: ItemFilterInput): [Item]
}

type Mutation {
    # 既存データの操作
    createItem(input: CreateItemInput!): Item
    updateItem(input: UpdateItemInput!): Item
    deleteItem(id: ID!): DeleteItemResponse
}

type Item {
    id: ID!
    name: String!
    description: String
    createdAt: AWSDateTime
    updatedAt: AWSDateTime
    # 既存テーブルの列に合わせて追加
}

input CreateItemInput {
    name: String!
    description: String
}

input UpdateItemInput {
    id: ID!
    name: String
    description: String
}

input ItemFilterInput {
    name: StringFilterInput
    createdAt: DateFilterInput
}

input StringFilterInput {
    eq: String
    contains: String
    beginsWith: String
}

input DateFilterInput {
    eq: AWSDateTime
    gt: AWSDateTime
    lt: AWSDateTime
    between: [AWSDateTime]
}

type ItemConnection {
    items: [Item]
    nextToken: String
}

type DeleteItemResponse {
    success: Boolean!
    message: String
}

schema {
    query: Query
    mutation: Mutation
}
```

### 4. AppSync データソース設定（既存Auroraクラスター接続）

#### 必要な設定項目
- **データソースタイプ**: Relational database
- **クラスターARN**: 既存Aurora クラスターのARN
- **シークレットARN**: 作成したSecrets Manager のARN  
- **データベース名**: 既存のデータベース名
- **リージョン**: 既存クラスターのリージョン

#### 既存クラスター用IAM ポリシー例
```json
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
            "Resource": "arn:aws:rds:YOUR_REGION:YOUR_ACCOUNT:cluster:YOUR_EXISTING_CLUSTER_NAME"
        },
        {
            "Effect": "Allow", 
            "Action": [
                "secretsmanager:GetSecretValue"
            ],
            "Resource": "arn:aws:secretsmanager:YOUR_REGION:YOUR_ACCOUNT:secret:ExistingAuroraSecret-*"
        }
    ]
}
```

#### AppSync コンソールでのデータソース追加手順
1. **AppSync コンソール**にアクセス
2. 対象のGraphQL APIを選択
3. **「データソース」**タブを選択
4. **「データソースを作成」**をクリック
5. 以下を設定:
   - **データソース名**: `ExistingAuroraDataSource`
   - **データソースタイプ**: `Relational database`
   - **リージョン**: 既存クラスターのリージョン
   - **クラスター**: 既存クラスター名を選択
   - **データベース名**: 既存データベース名
   - **既存のロール**: 上記IAMポリシーを持つロールを選択
   - **シークレット**: 作成したSecrets Manager シークレットを選択

## Amplify Gen2 との統合（既存Aurora使用）

### Amplify Gen2 での設定
1. **バックエンド設定** (`amplify/backend.ts`)
```typescript
import { defineBackend } from '@aws-amplify/backend'
import { auth } from './auth/resource'
import { data } from './data/resource'

export const backend = defineBackend({
  auth,
  data,
})

// 既存Aurora クラスターとの接続設定
const { cfnGraphqlApi } = backend.data.resources.cfnResources
cfnGraphqlApi.additionalAuthenticationProviders = [
  {
    authenticationType: 'AWS_IAM',
  }
]
```

2. **データリソース設定** (`amplify/data/resource.ts`)
```typescript
import { defineData, type ClientSchema } from '@aws-amplify/backend'

const schema = /* GraphQL */ `
  # 既存データベーススキーマに対応したGraphQLスキーマ
  type Item @aws_iam @aws_cognito_user_pools {
    id: ID!
    name: String!
    description: String
    createdAt: AWSDateTime
    updatedAt: AWSDateTime
  }
  
  type Query {
    getItem(id: ID!): Item @aws_iam @aws_cognito_user_pools
    listItems: [Item] @aws_iam @aws_cognito_user_pools
  }
  
  type Mutation {
    createItem(input: CreateItemInput!): Item @aws_iam @aws_cognito_user_pools
    updateItem(input: UpdateItemInput!): Item @aws_iam @aws_cognito_user_pools
    deleteItem(id: ID!): Boolean @aws_iam @aws_cognito_user_pools
  }
`

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
})

export type Schema = ClientSchema<typeof data>
```

3. **フロントエンド統合**
```typescript
// src/main.tsx または src/App.tsx
import { Amplify } from 'aws-amplify'
import { generateClient } from 'aws-amplify/data'
import outputs from '../amplify_outputs.json'
import type { Schema } from '../amplify/data/resource'

Amplify.configure(outputs)

const client = generateClient<Schema>()

// 既存データの取得例
const fetchItems = async () => {
  try {
    const { data: items } = await client.models.Item.list()
    console.log('既存データ:', items)
  } catch (error) {
    console.error('データ取得エラー:', error)
  }
}
```

### 利点と特徴

#### 技術的利点
- **シームレスな統合**: GraphQLとリレーショナルデータベース間の直接接続
- **サーバーレス スケーラビリティ**: Aurora Serverless v2 の自動スケーリング
- **セキュアなアクセス**: AWS Secrets Manager 経由の安全な認証
- **SQLインジェクション対策**: 入力サニタイゼーション機能内蔵
- **柔軟なクエリ**: フィルタリングと範囲操作のサポート

#### 使用例
- リレーショナルデータ要件を持つスケーラブルアプリケーション
- GraphQL の柔軟性とSQL データベース機能の両方が必要なAPI
- GraphQL ミューテーションとクエリを通じたデータ操作管理
- セキュアなデータベースアクセスパターンの実装

## 既存Aurora使用時の注意事項

### データベース互換性
- **既存のテーブル構造**を事前に確認し、GraphQLスキーマに反映
- **データ型の対応**を確認（MySQL/PostgreSQL ↔ GraphQL）
- **外部キー制約**や**トリガー**がある場合は動作確認が必要

### Data API 制約事項
- **既存クラスター**でData APIを有効化すると一時的に再起動が発生する可能性
- **トランザクション**は限定的（単一ステートメント内のみ）
- **ストアドプロシージャ**の実行に制限がある場合

### セキュリティ考慮事項
- **既存データベースのアクセス権限**を適切に設定
- **本番データ**への接続の場合は読み取り専用レプリカの使用を検討
- **マスターユーザー**ではなく専用ユーザーの作成を推奨

### パフォーマンス
- **既存の負荷**に影響がないか監視
- **AppSync リゾルバー**の効率的な実装
- **データAPI の制限**（同時接続数など）を考慮

### バックアップとメンテナンス
- **既存のバックアップスケジュール**に影響がないか確認
- **メンテナンスウィンドウ**の調整が必要な場合
- **Data API 有効化後の動作確認**を十分に実施

## 結論（既存Aurora使用）

既存の Aurora インスタンスと Amplify を AppSync で接続するには、以下の手順が必要です:

### 統合手順まとめ
1. **既存Aurora クラスター情報の確認**と Data API有効化
2. **既存データベース構造の調査**とテーブル確認
3. **AWS Secrets Manager** での既存認証情報管理
4. **既存スキーマに対応した GraphQL API** の作成
5. **AppSync データソース設定**（既存クラスターARN指定）
6. **Amplify Gen2 との統合**とフロントエンド実装

### 主な利点
- **既存データの活用**: 蓄積されたデータをそのまま GraphQL API として提供
- **段階的移行**: 既存システムを維持しながら新しいAPI層を追加
- **開発効率**: Amplify Gen2 の型安全な開発体験
- **コスト効率**: 新しいデータベースを作成せず既存リソースを活用

### 成功のポイント
- **事前調査**: 既存データベース構造とデータ型の詳細な把握
- **段階的実装**: まず読み取り専用で始め、徐々に書き込み機能を追加
- **監視体制**: 既存システムへの影響を適切に監視
- **テスト環境**: 本番データベースを直接使用せず、まずテスト環境で検証

この統合により、既存の Aurora データベース資産を活かしながら、モダンな GraphQL API とフロントエンド開発体験を実現できます。

---
**出典一覧:**
- AWS AppSync Developer Guide: https://docs.aws.amazon.com/appsync/latest/devguide/tutorial-rds-resolvers.html
- Amplify Gen2 Documentation: https://docs.amplify.aws/gen2/build-a-backend/data/
- AWS RDS Aurora User Guide (Data API): https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/data-api.html