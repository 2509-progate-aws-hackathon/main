'use client';

import { useState } from 'react';
import { useDirectRDS } from '@/app/hooks/useDirectRDS';

/**
 * RDS Data API 直接アクセステストコンポーネント
 * セキュリティを無視してデータベースに直接アクセスするテスト用UI
 */
export default function DirectRDSTest() {
  const { accidents, loading, error, searchNearRoute, getAllAccidents, searchInBounds, clearResults } = useDirectRDS();
  const [routeInput, setRouteInput] = useState('LINESTRING(139.6917 35.6895, 139.6989 35.6866)');
  const [distance, setDistance] = useState(100);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">RDS Data API 直接アクセステスト</h1>
      
      {/* エラー表示 */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>エラー:</strong> {error}
        </div>
      )}

      {/* ローディング表示 */}
      {loading && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
          データベースにアクセス中...
        </div>
      )}

      {/* 操作ボタン群 */}
      <div className="space-y-4 mb-6">
        {/* 全事故データ取得 */}
        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">全事故データ取得</h3>
          <button 
            onClick={() => getAllAccidents(500)}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            最新500件を取得
          </button>
        </div>

        {/* ルート検索 */}
        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">ルート周辺検索</h3>
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium">ルートライン (WKT形式):</label>
              <input
                type="text"
                value={routeInput}
                onChange={(e) => setRouteInput(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                placeholder="LINESTRING(139.6917 35.6895, 139.6989 35.6866)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">検索距離 (メートル):</label>
              <input
                type="number"
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                className="border px-3 py-2 rounded"
                min="1"
                max="10000"
              />
            </div>
            <button 
              onClick={() => searchNearRoute(routeInput, distance)}
              disabled={loading || !routeInput}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              ルート周辺を検索
            </button>
          </div>
        </div>

        {/* 範囲検索 */}
        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">矩形範囲検索</h3>
          <button 
            onClick={() => {
              // 東京都心部の範囲
              searchInBounds(35.6, 35.8, 139.6, 139.8);
            }}
            disabled={loading}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
          >
            東京都心部を検索
          </button>
        </div>

        {/* クリアボタン */}
        <div>
          <button 
            onClick={clearResults}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            結果をクリア
          </button>
        </div>
      </div>

      {/* 結果表示 */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">
          検索結果 ({accidents.length}件)
        </h2>
        
        {accidents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">ID</th>
                  <th className="border px-4 py-2">場所</th>
                  <th className="border px-4 py-2">日付</th>
                  <th className="border px-4 py-2">重症度</th>
                  <th className="border px-4 py-2">緯度</th>
                  <th className="border px-4 py-2">経度</th>
                  <th className="border px-4 py-2">距離(m)</th>
                </tr>
              </thead>
              <tbody>
                {accidents.map((accident, index) => (
                  <tr key={`${accident.id}-${index}`} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{accident.id}</td>
                    <td className="border px-4 py-2">{accident.location}</td>
                    <td className="border px-4 py-2">{accident.accident_date}</td>
                    <td className="border px-4 py-2">{accident.severity}</td>
                    <td className="border px-4 py-2">{accident.latitude.toFixed(6)}</td>
                    <td className="border px-4 py-2">{accident.longitude.toFixed(6)}</td>
                    <td className="border px-4 py-2">
                      {accident.distance_meters ? accident.distance_meters.toFixed(2) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">検索結果がありません</p>
        )}
      </div>

      {/* デバッグ情報 */}
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">デバッグ情報</h3>
        <div className="text-sm space-y-1">
          <p><strong>データベース:</strong> jiko-database.cluster-c0x2uo6863wb.us-east-1.rds.amazonaws.com</p>
          <p><strong>リージョン:</strong> us-east-1</p>
          <p><strong>アクセス方式:</strong> RDS Data API (直接アクセス)</p>
          <p><strong>認証:</strong> IAM + Secrets Manager</p>
        </div>
      </div>
    </div>
  );
}