'use client';

import { useState } from 'react';

interface StoryResponse {
  success: boolean;
  data?: {
    text: string;
    raw: any;
  };
  response?: string;
  error?: string;
  details?: string;
}

export default function StoryPage() {
  const [inputText, setInputText] = useState('');
  const [storyResponse, setStoryResponse] = useState<StoryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateStory = async () => {
    if (!inputText.trim()) {
      alert('プロンプトを入力してください');
      return;
    }

    setIsLoading(true);
    setStoryResponse(null);

    try {
      const response = await fetch('/api/story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input_text: inputText,
        }),
      });

      const data: StoryResponse = await response.json();
      setStoryResponse(data);
    } catch (error) {
      console.error('Story generation error:', error);
      setStoryResponse({
        success: false,
        error: 'ストーリー生成中にエラーが発生しました',
        details: (error as Error).message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatStoryText = (text: string) => {
    return text.split('\n').map((line, index) => (
      <p key={index} className="mb-4 leading-relaxed">
        {line}
      </p>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          AI ストーリージェネレーター
        </h1>

        {/* 入力フォーム */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-2">
            ストーリーのプロンプトを入力してください
          </label>
          <textarea
            id="input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="例: 深夜の山道で事故が起きた恐怖ストーリーを書いて"
            className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            disabled={isLoading}
          />
          <button
            onClick={generateStory}
            disabled={isLoading || !inputText.trim()}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-md transition-colors"
          >
            {isLoading ? 'ストーリーを生成中...' : 'ストーリーを生成'}
          </button>
        </div>

        {/* ローディング表示 */}
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* レスポンス表示 */}
        {storyResponse && !isLoading && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            {storyResponse.success ? (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
                  生成されたストーリー
                </h2>
                
                {/* メインストーリーテキスト */}
                {storyResponse.data?.text && (
                  <div className="prose max-w-none mb-6">
                    <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-500">
                      <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                        {formatStoryText(storyResponse.data.text)}
                      </div>
                    </div>
                  </div>
                )}

                {/* fallback: response フィールドがある場合 */}
                {!storyResponse.data?.text && storyResponse.response && (
                  <div className="prose max-w-none mb-6">
                    <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-yellow-500">
                      <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                        {formatStoryText(storyResponse.response)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-red-800 mb-2">
                  エラーが発生しました
                </h3>
                <p className="text-red-700 mb-2">{storyResponse.error}</p>
                {storyResponse.details && (
                  <details className="text-sm text-red-600">
                    <summary className="cursor-pointer">詳細を表示</summary>
                    <p className="mt-2 font-mono bg-red-100 p-2 rounded">
                      {storyResponse.details}
                    </p>
                  </details>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
