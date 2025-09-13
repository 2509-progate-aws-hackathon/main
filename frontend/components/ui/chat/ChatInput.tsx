import React from 'react';
import { useAtom } from 'jotai';
import { messageInputAtom, sendMessageAtom, chatLoadingAtom } from '@/stores/chatAtoms';
import { Send, Paperclip, Mic } from 'lucide-react';

// TODO: 高度な入力機能
// - ファイルアップロード（画像、PDF、音声等）
// - 音声入力・認識
// - テキスト音声読み上げ
// - 自動補完・サジェスト機能
// - メンション機能（@船舶名 等）
// - テンプレート・定型文機能
// - ドラッグ&ドロップ対応
// - リッチテキスト編集
// - 絵文字ピッカー

export function ChatInput() {
  const [message, setMessage] = useAtom(messageInputAtom);
  const [, sendMessage] = useAtom(sendMessageAtom);
  const [isLoading] = useAtom(chatLoadingAtom);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      sendMessage(message);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
    // TODO: その他のキーボードショートカット
    // - Ctrl+Enter: 送信
    // - Ctrl+K: コマンドパレット
    // - Tab: 自動補完
    // - Esc: 入力クリア
  };

  return (
    <div className="border-t bg-white p-4">
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        {/* TODO: ファイルアップロードボタン */}
        <button
          type="button"
          className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          disabled // TODO: 実装後に有効化
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* メッセージ入力フィールド */}
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="船舶について質問してください..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={1}
            disabled={isLoading}
            style={{
              minHeight: '40px',
              maxHeight: '120px',
              // TODO: 自動リサイズ機能
            }}
          />
          
          {/* TODO: 入力支援機能 */}
          {/* - 文字数カウンター */}
          {/* - 自動補完ドロップダウン */}
          {/* - 入力プレビュー */}
        </div>

        {/* TODO: 音声入力ボタン */}
        <button
          type="button"
          className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          disabled // TODO: 実装後に有効化
        >
          <Mic className="w-5 h-5" />
        </button>

        {/* 送信ボタン */}
        <button
          type="submit"
          disabled={!message.trim() || isLoading}
          className="flex-shrink-0 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </form>

      {/* TODO: 入力支援UI */}
      {/* - サジェストクエリ（「◯◯について教えて」「比較して」等） */}
      {/* - よく使う質問のクイックボタン */}
      {/* - 入力ヒント・チュートリアル */}
      
      {/* サンプル質問（空の状態でのみ表示） */}
      {!message && (
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="text-xs text-gray-500">例：</span>
          {[
            '最も速い船舶は？',
            '大型船舶を比較して',
            'おすすめの船舶は？'
          ].map((sample, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setMessage(sample)}
              className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
              disabled={isLoading}
            >
              {sample}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// TODO: 追加機能
// - スマートリプライ（Gmail風の候補返信）
// - コンテキスト別入力モード（検索、比較、質問等）
// - 入力履歴・テンプレート管理
// - オートセーブ・復元機能
// - 多言語入力対応
// - アクセシビリティ強化（音声読み上げ、キーボードナビゲーション）
