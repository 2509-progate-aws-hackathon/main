'use client';

import { useState } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  data?: any; 
}

export default function BedrockDemo() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const formatAccidentData = (accident: any) => {
    return (
      <div className="bg-gray-50 p-3 rounded mt-2 text-sm">
        <h4 className="font-semibold text-gray-800 mb-2">{accident.title}</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div><span className="font-medium">発生日時:</span> {new Date(accident.occurrenceDateTime).toLocaleString('ja-JP')}</div>
          <div><span className="font-medium">場所:</span> {accident.location}</div>
          <div><span className="font-medium">天候:</span> {accident.weather}</div>
          <div><span className="font-medium">事故タイプ:</span> {accident.accidentTypeCategory}</div>
          <div><span className="font-medium">損傷レベル:</span> {accident.damageLevel}</div>
          <div><span className="font-medium">座標:</span> {accident.latitude}, {accident.longitude}</div>
        </div>
        <p className="text-xs text-gray-600 mt-2">{accident.description}</p>
      </div>
    );
  };

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input_text: inputMessage }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.success 
          ? (data.data?.result || '結果を取得しました')
          : `エラー: ${data.error}`,
        timestamp: new Date(),
        data: data.success ? data.data : null,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `通信エラー: ${(error as Error).message}`,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">Bedrock Chat</h1>
        
        {/* チャットエリア */}
        <div className="bg-white rounded-lg shadow p-4 h-96 overflow-y-auto mb-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>メッセージを入力してチャットを開始してください</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-100 text-blue-900 ml-8'
                    : message.content.startsWith('エラー') || message.content.startsWith('通信エラー')
                    ? 'bg-red-100 text-red-900 mr-8'
                    : 'bg-gray-100 text-gray-900 mr-8'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                
                {/* 構造化データの表示 */}
                {message.data?.structured_data && (
                  <div className="mt-3">
                    <p className="font-semibold text-sm mb-2">検索結果 ({message.data.count}件):</p>
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {message.data.structured_data.map((accident: any, index: number) => (
                        <div key={accident.id || index}>
                          {formatAccidentData(accident)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-500 mt-1">
                  {message.timestamp.toLocaleTimeString('ja-JP')}
                </div>
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="text-center text-gray-500">
              <div className="animate-pulse">応答を生成中...</div>
            </div>
          )}
        </div>

        {/* 入力エリア */}
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="メッセージを入力..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition-colors"
          >
            {isLoading ? '送信中...' : '送信'}
          </button>
        </div>
      </div>
    </div>
  );
}
