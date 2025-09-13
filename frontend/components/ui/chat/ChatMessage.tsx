import React from 'react';
import { ChatMessage as ChatMessageType } from '@/types/chat';
import { Bot, User, ExternalLink } from 'lucide-react';
import Link from 'next/link';

// TODO: 高度なメッセージ表示機能
// - Markdown レンダリング
// - コードシンタックスハイライト
// - 数式表示 (MathJax/KaTeX)
// - 画像・動画・音声表示
// - インタラクティブ要素（ボタン、フォーム等）
// - メッセージ編集・削除機能
// - リアクション機能（絵文字等）
// - メッセージ翻訳機能

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex gap-3 p-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* アバター */}
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}
      
      {/* メッセージコンテンツ */}
      <div className={`max-w-[70%] ${isUser ? 'order-first' : ''}`}>
        <div
          className={`p-3 rounded-lg ${
            isUser
              ? 'bg-blue-500 text-white ml-auto'
              : 'bg-gray-100 text-gray-900'
          }`}
        >
          {/* TODO: Markdownレンダリング */}
          <div className="whitespace-pre-wrap">{message.content}</div>
        </div>
        
        {/* タイムスタンプ */}
        <div className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {message.timestamp.toLocaleTimeString('ja-JP', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
        
        {/* ソース情報（AIメッセージのみ） */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="mt-2">
            <div className="text-xs text-gray-600 mb-1">参考船舶：</div>
            <div className="flex flex-wrap gap-1">
              {message.sources.map((source, index) => (
                <Link
                  key={index}
                  href={`/ships/${source.shipId}`}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  {source.shipId}
                </Link>
              ))}
            </div>
            
            {/* TODO: 拡張ソース表示機能 */}
            {/* - 信頼度表示 */}
            {/* - 関連フィールド詳細 */}
            {/* - ソースプレビュー */}
            {/* - 引用テキスト表示 */}
          </div>
        )}
      </div>
      
      {/* ユーザーアバター */}
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
}

// TODO: 追加コンポーネント
// - メッセージアクションバー（編集、削除、コピー、共有）
// - メッセージ読み上げ機能
// - メッセージ検索ハイライト
// - スレッド表示（返信機能）
// - メッセージグループ化（時間・トピック別）
// - プログレッシブローディング（長いメッセージ）
