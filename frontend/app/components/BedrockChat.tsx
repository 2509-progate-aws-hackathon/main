'use client';

import { useState } from 'react';
import { transformBedrockDataToAccidentReports } from '../utils/bedrockDataTransform';
import type { AccidentReport } from '../types/AccidentReport';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  data?: any; 
}

interface BedrockChatProps {
  className?: string;
  height?: string;
  onAccidentDataReceived?: (reports: AccidentReport[]) => void;
}

export default function BedrockChat({ 
  className, 
  height = 'h-96', 
  onAccidentDataReceived 
}: BedrockChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const formatAccidentData = (accident: any) => {
    return (
      <div className="bg-gray-50 p-2 rounded mt-1 text-xs">
        <h5 className="font-semibold text-gray-800 mb-1">{accident.title}</h5>
        <div className="grid grid-cols-1 gap-1 text-xs">
          <div><span className="font-medium">発生日時:</span> {new Date(accident.occurrenceDateTime).toLocaleString('ja-JP')}</div>
          <div><span className="font-medium">場所:</span> {accident.location}</div>
          <div><span className="font-medium">天候:</span> {accident.weather}</div>
          <div><span className="font-medium">事故タイプ:</span> {accident.accidentTypeCategory}</div>
          <div><span className="font-medium">損傷レベル:</span> {accident.damageLevel}</div>
          <div><span className="font-medium">座標:</span> {accident.latitude}, {accident.longitude}</div>
        </div>
        <p className="text-xs text-gray-600 mt-1">{accident.description}</p>
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

      // structured_dataがある場合、AccidentReportに変換してコールバックを実行
      if (data.success && data.data?.structured_data && onAccidentDataReceived) {
        const transformedReports = transformBedrockDataToAccidentReports(data.data);
        onAccidentDataReceived(transformedReports);
      }
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
    <div className={`bg-white rounded-lg shadow-lg p-4 flex flex-col ${className}`}>
      <h2 className="text-lg font-bold mb-3 text-center">事故情報チャット</h2>
      
      {/* チャットエリア */}
      <div className={`bg-gray-50 rounded-lg p-3 ${height} overflow-y-auto mb-3 flex-1`}>
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            <p className="text-sm">事故情報について質問してください</p>
            <p className="text-xs mt-1 text-gray-400">例：「小山町で発生した事故を教えて」</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`mb-3 p-2 rounded-lg text-sm ${
                message.role === 'user'
                  ? 'bg-blue-100 text-blue-900 ml-4'
                  : message.content.startsWith('エラー') || message.content.startsWith('通信エラー')
                  ? 'bg-red-100 text-red-900 mr-4'
                  : 'bg-white text-gray-900 mr-4 shadow-sm'
              }`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
              
              {/* 構造化データの表示 */}
              {message.data?.structured_data && (
                <div className="mt-2">
                  <p className="font-semibold text-xs mb-1">検索結果 ({message.data.count}件):</p>
                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {message.data.structured_data.slice(0, 3).map((accident: any, index: number) => (
                      <div key={accident.id || index}>
                        {formatAccidentData(accident)}
                      </div>
                    ))}
                    {message.data.structured_data.length > 3 && (
                      <div className="text-xs text-blue-600 bg-blue-50 p-1 rounded text-center">
                        他 {message.data.structured_data.length - 3}件の結果があります
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="text-xs text-gray-400 mt-1">
                {message.timestamp.toLocaleTimeString('ja-JP')}
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="text-center text-gray-500">
            <div className="animate-pulse text-sm">応答を生成中...</div>
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
          placeholder="事故について質問..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading || !inputMessage.trim()}
          className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition-colors text-sm"
        >
          {isLoading ? '送信中' : '送信'}
        </button>
      </div>
    </div>
  );
}
