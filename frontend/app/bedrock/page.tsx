'use client';

import { useState } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface BedrockResponse {
  success: boolean;
  response?: any; // APIから返される値は文字列以外の可能性もある
  rawResponse?: string;
  parsedResponse?: any;
  sessionId?: string;
  error?: string;
  details?: string;
  metadata?: {
    sessionId?: string;
    contentType?: string;
    runtimeSessionId?: string;
  };
}

export default function BedrockDemo() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/bedrock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input_text: inputMessage }),
      });

      const data: BedrockResponse = await response.json();

      if (data.success && data.response) {
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: typeof data.response === 'string' 
            ? data.response 
            : typeof data.response === 'object'
            ? JSON.stringify(data.response, null, 2)
            : String(data.response),
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, assistantMessage]);
        
        // セッションIDを取得（複数の場所から取得する可能性がある）
        const newSessionId = data.sessionId || 
                           data.metadata?.sessionId || 
                           data.metadata?.runtimeSessionId;
        if (newSessionId) {
          setSessionId(newSessionId);
        }
      } else {
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: `エラー: ${data.error}${data.details ? ` - ${data.details}` : ''}`,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `通信エラーが発生しました: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setSessionId(null);
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm p-4 border-b">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              🤖 Amazon Bedrock Agent Chat
            </h1>
            <p className="text-sm text-gray-600">
              Bedrock Agentとチャットできるデモページです
            </p>
          </div>
          <div className="flex gap-2">
            {sessionId && (
              <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                Session: {sessionId.substring(0, 8)}...
              </div>
            )}
            <button
              onClick={clearChat}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
            >
              チャットをクリア
            </button>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-4xl mx-auto p-4 h-[calc(100vh-120px)] flex flex-col">
        {/* チャットエリア */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border overflow-hidden flex flex-col">
          {/* メッセージリスト */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <div className="text-4xl mb-4">💬</div>
                <p className="text-lg font-medium mb-2">Bedrock Agentと会話を始めましょう</p>
                <p className="text-sm">
                  下のテキストボックスにメッセージを入力してください
                </p>
                <div className="mt-6 text-left max-w-md mx-auto">
                  <p className="text-sm font-medium text-gray-700 mb-2">例：</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• "機械学習について簡単に説明してください"</li>
                    <li>• "今日の天気はどうですか？"</li>
                    <li>• "プログラミングのベストプラクティスを教えて"</li>
                  </ul>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-4 ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : (typeof message.content === 'string' && 
                           (message.content.startsWith('エラー:') || message.content.startsWith('通信エラー')))
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="whitespace-pre-wrap break-words">
                      {typeof message.content === 'string' 
                        ? message.content 
                        : typeof message.content === 'object'
                        ? JSON.stringify(message.content, null, 2)
                        : String(message.content)
                      }
                    </div>
                    <div
                      className={`text-xs mt-2 ${
                        message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}
                    >
                      {formatTimestamp(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* ローディング表示 */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-4 max-w-[70%]">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    <span className="text-gray-600">応答を生成中...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 入力エリア */}
          <div className="border-t p-4">
            <div className="flex gap-3">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="メッセージを入力してください... (Enterで送信、Shift+Enterで改行)"
                className="flex-1 resize-none border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    送信中
                  </div>
                ) : (
                  '送信'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
