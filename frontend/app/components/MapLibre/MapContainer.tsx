'use client';

import React from 'react';
import { useMapLibre } from '../../hooks/useMapLibre';

/**
 * MapContainer設定型
 */
interface MapContainerConfig {
  center?: [number, number];
  zoom?: number;
  style?: string;
  minZoom?: number;
  maxZoom?: number;
}

/**
 * MapContainerのProps
 */
interface MapContainerProps {
  config?: MapContainerConfig;
  className?: string;
  children?: React.ReactNode;
  onMapLoad?: (map: any) => void;
  onMapError?: (error: string) => void;
}

/**
 * MapLibreフックを使用したマップコンテナー
 */
export default function MapContainer({
  config = {},
  className = '',
  children,
  onMapLoad,
  onMapError,
}: MapContainerProps) {
  const { mapRef, map, isLoaded, error, reload } = useMapLibre(config);

  // マップロード完了時のコールバック
  React.useEffect(() => {
    if (isLoaded && map && onMapLoad) {
      onMapLoad(map);
    }
  }, [isLoaded, map, onMapLoad]);

  // エラー時のコールバック
  React.useEffect(() => {
    if (error && onMapError) {
      onMapError(error);
    }
  }, [error, onMapError]);

  return (
    <div className={`relative ${className}`}>
      {/* マップコンテナー */}
      <div
        ref={mapRef}
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />

      {/* ローディング状態 */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
            <div className="text-gray-600 font-medium">地図を読み込み中...</div>
            <div className="text-sm text-gray-500 mt-1">
              初回読み込みには時間がかかる場合があります
            </div>
          </div>
        </div>
      )}

      {/* エラー表示 */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 rounded-lg">
          <div className="text-center p-6">
            <div className="text-red-500 mb-3 text-4xl">⚠️</div>
            <div className="text-red-700 font-medium mb-2">マップエラー</div>
            <div className="text-sm text-red-600 mb-4 max-w-sm">{error}</div>
            <button
              onClick={reload}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              再読み込み
            </button>
          </div>
        </div>
      )}

      {/* 地図情報表示 */}
      {isLoaded && (
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border">
          <div className="text-sm font-semibold text-gray-800 mb-1">
            🗺️ WorstRoute
          </div>
          <div className="text-xs text-gray-600">
            ズーム: {map ? Math.round(map.getZoom()) : 0}
          </div>
        </div>
      )}

      {/* 子要素（オーバーレイなど） */}
      {isLoaded && children}
    </div>
  );
}