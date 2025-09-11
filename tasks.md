# RAG AI Assistant 機能 実装計画

## 概要
船舶情報に関する質問に対して、RAG（Retrieval-Augmented Generation）を用いてインテリジェントに回答するチャットボット機能を実装する。

## 要件分析

### 機能要件
- **チャット UI**: ユーザーが自然言語で船舶に関する質問を投稿できる
- **RAG システム**: 船舶データベースから関連情報を取得して回答を生成
- **リアルタイム応答**: ストリーミング形式での回答表示
- **履歴管理**: 会話履歴の保存と表示
- **コンテキスト保持**: 前の会話を考慮した継続的な対話

### 非機能要件
- **応答速度**: 3秒以内での初回応答
- **精度**: 船舶データに基づく正確な情報提供
- **UI/UX**: 直感的で使いやすいチャットインターフェース
- **モバイル対応**: レスポンシブデザイン

## 技術アーキテクチャ

### フロントエンド
- **Next.js 15**: App Router with TypeScript
- **チャット UI**: リアルタイム更新機能
- **ストリーミング**: Server-Sent Events (SSE) または WebSocket
- **状態管理**: Jotai for chat state management

### バックエンド（モック）
- **API Routes**: Next.js API routesでモックAPI実装
- **RAG モック**: 事前定義されたQ&Aパターンでの応答生成
- **船舶データ統合**: 既存のモックデータとの連携

### データフロー
```
ユーザー質問 → チャット UI → API Route → RAG処理 → 船舶データ検索 → 回答生成 → ストリーミング応答
```

## ファイル構成計画

### 1. 型定義
```typescript
// types/chat.ts
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: ShipReference[];
  isStreaming?: boolean;
}

export interface ShipReference {
  shipId: string;
  relevantFields: string[];
  confidence: number;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}
```

### 2. モック RAG システム
```typescript
// app/mocks/ragSystem.ts
export interface RAGResponse {
  answer: string;
  sources: ShipReference[];
  confidence: number;
}

export class MockRAGSystem {
  // 質問パターンマッチング
  // 船舶データからの情報抽出
  // 回答生成
}
```

### 3. チャット状態管理
```typescript
// stores/chatAtoms.ts
export const chatSessionsAtom = atom<ChatSession[]>([]);
export const currentSessionAtom = atom<ChatSession | null>(null);
export const isTypingAtom = atom<boolean>(false);
```

### 4. チャット UI コンポーネント
```typescript
// features/chat/
├── components/
│   ├── ChatInterface.tsx      // メインチャットUI
│   ├── MessageList.tsx        // メッセージ一覧
│   ├── MessageBubble.tsx      // 個別メッセージ
│   ├── ChatInput.tsx          // 入力フォーム
│   ├── TypingIndicator.tsx    // タイピング表示
│   ├── SourceReferences.tsx   // 参照船舶情報
│   └── ChatSidebar.tsx        // セッション一覧
```

### 5. API エンドポイント
```typescript
// app/api/chat/
├── route.ts                   // チャット API
├── sessions/route.ts          // セッション管理
└── stream/route.ts            // ストリーミング応答
```

### 6. ページ実装
```typescript
// app/chat/
├── page.tsx                   // メインチャットページ
├── layout.tsx                 // チャット専用レイアウト
└── loading.tsx                // ローディング状態
```

## モック実装仕様

### 質問パターンと回答例
```typescript
const questionPatterns = [
  {
    pattern: /船.*速度|スピード|速力/,
    type: 'speed_inquiry',
    handler: generateSpeedComparison
  },
  {
    pattern: /トン数|重量|大きさ/,
    type: 'tonnage_inquiry', 
    handler: generateTonnageInfo
  },
  {
    pattern: /比較|違い|どちら/,
    type: 'comparison',
    handler: generateComparison
  },
  {
    pattern: /おすすめ|推奨|最適/,
    type: 'recommendation',
    handler: generateRecommendation
  }
];
```

### RAG データソース
- **船舶基本データ**: 既存のmockShipsデータ
- **性能データ**: 速度、トン数、寸法等
- **用途別データ**: 旅客船、貨物船、漁船等の特徴
- **比較データ**: 船舶間の差異や優劣

## UI/UX 設計

### チャットインターフェース
- **左側**: セッション履歴（折りたたみ可能）
- **中央**: メインチャットエリア
- **右側**: 参照された船舶情報（必要時表示）
- **下部**: 入力フォームと送信ボタン

### メッセージ表示
- **ユーザー**: 右寄り、青系背景
- **AI**: 左寄り、グレー系背景  
- **ストリーミング**: タイプライター効果
- **ソース表示**: 回答下部に参照船舶カード

### レスポンシブ対応
- **デスクトップ**: 3カラムレイアウト
- **タブレット**: サイドバー折りたたみ
- **モバイル**: 全画面チャット、ドロワーナビ

## 実装フェーズ

### Phase 1: 基本チャット機能
1. 型定義とモックデータ作成
2. 基本チャットUI実装
3. メッセージ送受信機能
4. 簡単なパターンマッチング応答

### Phase 2: RAG システム統合
1. モックRAGシステム実装
2. 船舶データとの連携
3. ソース参照機能
4. 回答精度向上

### Phase 3: UX 強化
1. ストリーミング応答実装
2. セッション履歴管理
3. 参照船舶詳細表示
4. タイピングインジケーター

### Phase 4: 高度な機能
1. コンテキスト保持機能
2. 船舶推奨アルゴリズム
3. 画像・グラフ生成
4. エクスポート機能

## 技術的考慮事項

### パフォーマンス
- **レスポンス最適化**: 段階的回答表示
- **キャッシング**: 頻出質問の事前生成回答
- **デバウンス**: 入力中の無駄なリクエスト防止

### セキュリティ
- **入力検証**: XSS、インジェクション対策
- **レート制限**: API呼び出し頻度制限
- **データ暗号化**: セッション情報の保護

### スケーラビリティ
- **コンポーネント分離**: 再利用可能な設計
- **状態管理**: 効率的なメモリ使用
- **API設計**: RESTful で拡張性の高い構造

## 成功指標

### 機能指標
- ✅ 基本的な船舶質問への正答率 > 85%
- ✅ 平均応答時間 < 3秒
- ✅ UI応答性（インタラクティブ性）
- ✅ モバイルでの使用感

### ユーザー体験指標
- ✅ 直感的な操作性
- ✅ 情報の正確性と有用性
- ✅ 継続的な会話の自然さ
- ✅ 船舶データとの効果的な連携

## リスク と対策

### 技術リスク
- **応答精度**: → 段階的改善、フィードバック機能
- **パフォーマンス**: → ストリーミング、キャッシング
- **UI複雑性**: → 段階的機能追加、ユーザーテスト

### プロジェクトリスク  
- **開発期間**: → MVP（最小機能製品）アプローチ
- **技術学習コスト**: → 既存パターンの活用
- **統合複雑性**: → 疎結合設計、モジュール化

---

## 次のアクション
1. **Phase 1 実装開始**: 基本型定義とモックデータ作成
2. **UI プロトタイプ**: チャットインターフェースのモックアップ
3. **RAG ロジック設計**: 質問パターンと回答生成アルゴリズム
4. **既存システム統合**: 船舶データとの連携テスト
