import { atom } from 'jotai';
import { ChatMessage, ChatSession } from '@/types/chat';
import { mockRAGSystem } from '@/mocks/ragSystem';

// TODO: 高度な状態管理機能
// - 複数セッション同期
// - ローカルストレージ永続化
// - リアルタイム同期（WebSocket）
// - 状態復元・バックアップ機能
// - ユーザー認証との統合

// 現在のチャットセッション
export const currentSessionAtom = atom<ChatSession | null>(null);

// 全チャットセッション履歴
export const chatSessionsAtom = atom<ChatSession[]>([]);

// TODO: セッション管理の拡張
// - セッション検索・フィルタリング
// - セッション分類・タグ付け
// - セッション統計・分析
// - エクスポート・インポート機能

// メッセージ入力状態
export const messageInputAtom = atom<string>('');

// チャット読み込み状態
export const chatLoadingAtom = atom<boolean>(false);

// エラー状態
export const chatErrorAtom = atom<string | null>(null);

// TODO: 高度なエラーハンドリング
// - エラーカテゴリ分類
// - 自動回復機能
// - エラー報告機能
// - ユーザーフレンドリーなエラーメッセージ

// 新しいセッションを作成するアクション
export const createNewSessionAtom = atom(
  null,
  (get, set) => {
    const newSession: ChatSession = {
      id: `session_${Date.now()}`,
      title: '新しいチャット', // TODO: 自動タイトル生成
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // TODO: セッション作成の拡張
    // - インテリジェントなタイトル生成
    // - テンプレートベースの初期化
    // - ユーザー設定の適用
    // - 初期プロンプトの設定

    const currentSessions = get(chatSessionsAtom);
    set(chatSessionsAtom, [newSession, ...currentSessions]);
    set(currentSessionAtom, newSession);
    
    return newSession.id;
  }
);

// メッセージを送信するアクション
export const sendMessageAtom = atom(
  null,
  async (get, set, message: string) => {
    const currentSession = get(currentSessionAtom);
    if (!currentSession || !message.trim()) return;

    set(chatLoadingAtom, true);
    set(chatErrorAtom, null);

    try {
      // ユーザーメッセージを追加
      const userMessage: ChatMessage = {
        id: `msg_${Date.now()}_user`,
        role: 'user',
        content: message,
        timestamp: new Date(),
        sources: []
      };

      // TODO: メッセージ送信の拡張機能
      // - メッセージタイプ判定（テキスト、画像、ファイル等）
      // - メッセージ前処理（フィルタリング、サニタイズ）
      // - 送信前バリデーション
      // - メッセージ暗号化

      const updatedMessages = [...currentSession.messages, userMessage];
      
      // セッションを更新（ユーザーメッセージ追加）
      const updatedSession = {
        ...currentSession,
        messages: updatedMessages,
        updatedAt: new Date()
      };

      set(currentSessionAtom, updatedSession);
      
      // セッション一覧も更新
      const allSessions = get(chatSessionsAtom);
      const updatedSessions = allSessions.map(session => 
        session.id === currentSession.id ? updatedSession : session
      );
      set(chatSessionsAtom, updatedSessions);

      // RAGシステムでレスポンス生成
      const ragResponse = await mockRAGSystem.processQuery(message);

      // TODO: レスポンス処理の拡張
      // - ストリーミングレスポンス対応
      // - 多段階推論の可視化
      // - 信頼度ベースの応答調整
      // - A/Bテスト用の複数応答生成

      // AIメッセージを追加
      const aiMessage: ChatMessage = {
        id: `msg_${Date.now()}_assistant`,
        role: 'assistant',
        content: ragResponse.answer,
        timestamp: new Date(),
        sources: ragResponse.sources,
        // TODO: 拡張メッセージプロパティ
        // confidence: ragResponse.confidence,
        // processingTime: ragResponse.processingTime,
        // suggestedActions: ragResponse.suggestedActions
      };

      const finalMessages = [...updatedMessages, aiMessage];
      const finalSession = {
        ...updatedSession,
        messages: finalMessages,
        updatedAt: new Date()
      };

      set(currentSessionAtom, finalSession);
      
      const finalSessions = allSessions.map(session => 
        session.id === currentSession.id ? finalSession : session
      );
      set(chatSessionsAtom, finalSessions);

    } catch (error) {
      console.error('Chat error:', error);
      set(chatErrorAtom, 'メッセージの送信に失敗しました。');
      
      // TODO: 高度なエラー処理
      // - エラーの自動分類
      // - リトライ機能
      // - 部分的な応答の保存
      // - ユーザーへの具体的なガイダンス
    } finally {
      set(chatLoadingAtom, false);
      set(messageInputAtom, '');
    }
  }
);

// セッションを選択するアクション
export const selectSessionAtom = atom(
  null,
  (get, set, sessionId: string) => {
    const sessions = get(chatSessionsAtom);
    const selectedSession = sessions.find(session => session.id === sessionId);
    
    if (selectedSession) {
      set(currentSessionAtom, selectedSession);
    }

    // TODO: セッション選択の拡張
    // - セッション読み込み状態の管理
    // - セッションプリロード
    // - 履歴の自動整理
    // - アクセス頻度ベースの並び替え
  }
);

// セッションを削除するアクション
export const deleteSessionAtom = atom(
  null,
  (get, set, sessionId: string) => {
    const sessions = get(chatSessionsAtom);
    const filteredSessions = sessions.filter(session => session.id !== sessionId);
    set(chatSessionsAtom, filteredSessions);

    const currentSession = get(currentSessionAtom);
    if (currentSession?.id === sessionId) {
      set(currentSessionAtom, filteredSessions[0] || null);
    }

    // TODO: セッション削除の拡張
    // - 削除確認ダイアログ
    // - ゴミ箱機能（一時削除）
    // - 削除のアンドゥ機能
    // - 関連データの整理
  }
);

// TODO: 追加のアトム
// - メッセージ検索用アトム
// - お気に入りメッセージ管理
// - セッション統計・分析
// - 設定・プリファレンス管理
// - 通知・アラート管理
// - オフライン同期状態管理
