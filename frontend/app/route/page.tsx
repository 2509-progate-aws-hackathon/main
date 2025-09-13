'use client';

import { MapContainer } from '../components/MapLibre';

/**
 * シンプルなマップ表示ページ
 */
export default function RoutePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm p-4">
        <h1 className="text-2xl font-bold text-gray-900">
          🗺️ MapLibre テスト
        </h1>
      </div>

      {/* マップエリア */}
      <div className="p-4">
        <MapContainer
          className="w-full h-[600px] rounded-lg shadow-lg"
          config={{
            center: [139.7671, 35.6812], // 東京駅
            zoom: 12,
          }}
        />
      </div>
    </div>
  );
}