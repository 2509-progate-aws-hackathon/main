import React, { useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import { currentSessionAtom, chatLoadingAtom } from '@/stores/chatAtoms';
import { ChatMessage } from './ChatMessage';
import { Bot } from 'lucide-react';

// TODO: 高度な表示機能
// - バーチャルスクロール（大量メッセージ対応）
// - メッセージグループ化（日時別、トピック別）
// - メッセージ検索・フィルタリング
// - 未読メッセージハイライト
// - メッセージ間の関連性可視化
// - エクスポート機能（PDF、テキスト等）
// - ダークモード対応
// - フォントサイズ調整

export function ChatWindow() {
  const [currentSession] = useAtom(currentSessionAtom);
  const [isLoading] = useAtom(chatLoadingAtom);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 新しいメッセージが追加されたら自動スクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages, isLoading]);

  // TODO: スクロール制御の拡張
  // - ユーザーが手動スクロール中は自動スクロールを停止
  // - 「新しいメッセージ」通知ボタン
  // - スクロール位置の記憶・復元
  // - スムーズアニメーション

  if (!currentSession) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <Bot className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            船舶 AI アシスタント
          </h2>
          <p className="text-gray-500 mb-4">
            船舶情報について何でもお聞きください。<br />
            検索、比較、推奨など、様々な質問にお答えします。
          </p>
          
          {/* TODO: ウェルカムメッセージの拡張 */}
          {/* - アニメーション効果 */}
          {/* - チュートリアル動画 */}
          {/* - 機能紹介カード */}
          {/* - よくある質問 */}
          
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="p-3 bg-white rounded-lg shadow-sm border">
              <div className="font-medium text-gray-700 mb-1">💬 質問例</div>
              <div className="text-gray-600">
                「最も速い船舶を教えて」<br />
                「大型船舶を比較したい」
              </div>
            </div>
            <div className="p-3 bg-white rounded-lg shadow-sm border">
              <div className="font-medium text-gray-700 mb-1">🔍 検索機能</div>
              <div className="text-gray-600">
                船舶名、仕様、用途などで<br />
                詳細検索が可能
              </div>
            </div>
            <div className="p-3 bg-white rounded-lg shadow-sm border">
              <div className="font-medium text-gray-700 mb-1">📊 比較分析</div>
              <div className="text-gray-600">
                複数船舶の性能比較と<br />
                おすすめ提案
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* メッセージ一覧 */}
      <div className="flex-1 overflow-y-auto">
        {currentSession.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <Bot className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>新しい会話を始めましょう</p>
              
              {/* TODO: 初期プロンプト提案 */}
              {/* - カテゴリ別質問テンプレート */}
              {/* - 人気質問ランキング */}
              {/* - パーソナライズされた提案 */}
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {currentSession.messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            
            {/* 読み込み中インジケーター */}
            {isLoading && (
              <div className="flex gap-3 p-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="max-w-[70%]">
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">考え中...</div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* 自動スクロール用の要素 */}
        <div ref={messagesEndRef} />
      </div>

      {/* TODO: 追加UI要素 */}
      {/* - スクロールトップボタン */}
      {/* - メッセージ数表示 */}
      {/* - 会話統計（レスポンス時間等） */}
      {/* - フィードバックボタン */}
    </div>
  );
}

// TODO: パフォーマンス最適化
// - React.memo でのメモ化
// - useMemo でのメッセージ計算キャッシュ
// - Intersection Observer での可視性管理
// - レイジーローディング
// - メッセージのプリレンダリング
// - 画像・メディアの最適化
