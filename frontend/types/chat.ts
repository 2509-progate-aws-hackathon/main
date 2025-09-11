import { Ship } from './ship';

// TODO: 拡張予定の型定義
// - メッセージの編集機能
// - ファイル添付機能
// - メッセージリアクション
// - 音声メッセージ対応

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: ShipReference[];
  isStreaming?: boolean;
  // TODO: 追加フィールド
  // - attachments?: FileAttachment[];
  // - reactions?: MessageReaction[];
  // - editHistory?: EditHistory[];
}

export interface ShipReference {
  shipId: string;
  relevantFields: string[];
  confidence: number;
  // TODO: 拡張参照情報
  // - contextSnippet: string;
  // - relevanceScore: number;
  // - visualHighlights?: string[];
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  // TODO: セッション機能拡張
  // - tags?: string[];
  // - isBookmarked?: boolean;
  // - shareToken?: string;
  // - collaborators?: string[];
}

// TODO: 追加予定の型
// export interface RAGContext {
//   searchQuery: string;
//   retrievedDocs: DocumentChunk[];
//   generationPrompt: string;
//   confidence: number;
// }

// export interface MessageReaction {
//   emoji: string;
//   userId: string;
//   timestamp: Date;
// }

// export interface FileAttachment {
//   id: string;
//   name: string;
//   type: string;
//   size: number;
//   url: string;
// }
