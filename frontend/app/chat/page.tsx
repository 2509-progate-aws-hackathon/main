'use client';

import React, { useEffect } from 'react';
import { useAtom } from 'jotai';
import { 
  currentSessionAtom, 
  chatSessionsAtom,
  createNewSessionAtom,
  selectSessionAtom,
  deleteSessionAtom,
  chatErrorAtom
} from '@/stores/chatAtoms';
import { ChatWindow } from '@/components/ui/chat/ChatWindow';
import { ChatInput } from '@/components/ui/chat/ChatInput';
import { MessageSquare, Plus, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// TODO: 高度なチャットページ機能
// - サイドバーの折りたたみ/展開
// - セッション検索・フィルタリング
// - セッション並び替え（日時、名前、トピック別）
// - セッションお気に入り機能
// - セッション共有機能
// - ダークモード切り替え
// - ユーザー設定パネル
// - 通知・アラート管理
// - ヘルプ・チュートリアル
// - フィードバック機能

export default function ChatPage() {
  const [currentSession] = useAtom(currentSessionAtom);
  const [sessions] = useAtom(chatSessionsAtom);
  const [, createNewSession] = useAtom(createNewSessionAtom);
  const [, selectSession] = useAtom(selectSessionAtom);
  const [, deleteSession] = useAtom(deleteSessionAtom);
  const [error] = useAtom(chatErrorAtom);

  // 初回アクセス時に新しいセッションを作成
  useEffect(() => {
    if (sessions.length === 0) {
      createNewSession();
    }
  }, [sessions.length, createNewSession]);

  // TODO: セッション管理の拡張
  // - セッション自動保存
  // - セッション復元（ページリロード時）
  // - セッション同期（複数タブ間）
  // - セッション バックアップ・復元

  const handleNewSession = () => {
    createNewSession();
  };

  const handleSelectSession = (sessionId: string) => {
    selectSession(sessionId);
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sessions.length > 1) {
      deleteSession(sessionId);
    }
    // TODO: 削除確認ダイアログ
  };

  return (
    <div className="h-screen bg-white flex">
      {/* サイドバー - セッション一覧 */}
      <div className="w-80 border-r bg-gray-50 flex flex-col">
        {/* ヘッダー */}
        <div className="p-4 border-b bg-white">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-semibold text-gray-800">AI アシスタント</h1>
            <Link
              href="/ships"
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="船舶一覧に戻る"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>
          
          <button
            onClick={handleNewSession}
            className="w-full flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            新しいチャット
          </button>
        </div>

        {/* セッション一覧 */}
        <div className="flex-1 overflow-y-auto p-2">
          {sessions.map((session) => (
            <div
              key={session.id}
              onClick={() => handleSelectSession(session.id)}
              className={`group flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors mb-1 ${
                currentSession?.id === session.id
                  ? 'bg-blue-100 border border-blue-200'
                  : 'hover:bg-gray-100'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-gray-800 truncate">
                  {session.title}
                </div>
                <div className="text-xs text-gray-500">
                  {session.messages.length > 0 ? (
                    `${session.messages.length}件のメッセージ`
                  ) : (
                    '空のチャット'
                  )}
                </div>
                <div className="text-xs text-gray-400">
                  {session.updatedAt.toLocaleDateString('ja-JP')}
                </div>
              </div>
              
              {/* 削除ボタン */}
              {sessions.length > 1 && (
                <button
                  onClick={(e) => handleDeleteSession(session.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                  title="セッションを削除"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          
          {/* TODO: セッション管理UI */}
          {/* - セッション検索バー */}
          {/* - セッションフィルター（日付、トピック等） */}
          {/* - セッション統計表示 */}
          {/* - セッションエクスポート */}
        </div>

        {/* フッター情報 */}
        <div className="p-3 border-t bg-white text-xs text-gray-500">
          <div className="mb-1">船舶情報 AI アシスタント</div>
          <div>v1.0.0 - Beta</div>
          
          {/* TODO: フッター拡張 */}
          {/* - ユーザー情報 */}
          {/* - 設定リンク */}
          {/* - ヘルプリンク */}
          {/* - フィードバックリンク */}
        </div>
      </div>

      {/* メインチャットエリア */}
      <div className="flex-1 flex flex-col">
        {/* エラー表示 */}
        {error && (
          <div className="p-3 bg-red-50 border-b border-red-200 text-red-700 text-sm">
            {error}
            {/* TODO: エラー処理の拡張 */}
            {/* - エラー詳細情報 */}
            {/* - リトライボタン */}
            {/* - エラー報告機能 */}
          </div>
        )}

        {/* チャットウィンドウ */}
        <ChatWindow />
        
        {/* チャット入力 */}
        <ChatInput />
      </div>

      {/* TODO: 追加UI要素 */}
      {/* - フローティングヘルプボタン */}
      {/* - 設定パネル */}
      {/* - 通知センター */}
      {/* - フィードバックモーダル */}
      {/* - キーボードショートカット表示 */}
    </div>
  );
}

// TODO: レスポンシブ対応
// - モバイル用レイアウト
// - タブレット最適化
// - サイドバー自動非表示
// - スワイプジェスチャー対応

// TODO: アクセシビリティ
// - キーボードナビゲーション
// - スクリーンリーダー対応
// - 高コントラストモード
// - フォーカス管理

// TODO: パフォーマンス最適化
// - 仮想スクロール
// - レイジーローディング
// - メモ化最適化
// - バンドルサイズ最適化
