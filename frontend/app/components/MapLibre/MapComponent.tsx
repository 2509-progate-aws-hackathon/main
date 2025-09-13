'use client';

import React, { useEffect, useRef, useState } from 'react';

// 型定義
type LngLatLike = [number, number] | { lng: number; lat: number };
type MapLibreMap = any; // 動的インポート対応

// 動的インポートでMapLibreを読み込み（SSR対応）
const loadMapLibre = async () => {
  const maplibregl = await import('maplibre-gl');
  return maplibregl.default;
};

/**
 * MapLibre基本設定
 */
interface MapConfig {
  center: LngLatLike;
  zoom: number;
  style?: string;
  minZoom?: number;
  maxZoom?: number;
  bearing?: number;
  pitch?: number;
}

/**
 * MapComponentのProps
 */
interface MapComponentProps {
  config?: Partial<MapConfig>;
  className?: string;
  onMapLoad?: (map: MapLibreMap) => void;
  onMapError?: (error: Error) => void;
  children?: React.ReactNode;
}

/**
 * デフォルト設定
 */
const DEFAULT_CONFIG: MapConfig = {
  center: [139.7671, 35.6812], // 東京駅
  zoom: 12,
  style: 'https://demotiles.maplibre.org/style.json',
  minZoom: 0,
  maxZoom: 22,
  bearing: 0,
  pitch: 0,
};

/**
 * 基本的なMapLibre地図コンポーネント
 */
export default function MapComponent({
  config = {},
  className = '',
  onMapLoad,
  onMapError,
  children,
}: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<MapLibreMap | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // マップ設定をマージ
  const mapConfig: MapConfig = { ...DEFAULT_CONFIG, ...config };

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    let isMounted = true;

    const initializeMap = async () => {
      try {
        // MapLibreを動的に読み込み
        const maplibregl = await loadMapLibre();

        // マウント状態を確認
        if (!isMounted || !mapContainer.current) return;

        // マップインスタンスを作成
        const newMap = new maplibregl.Map({
          container: mapContainer.current,
          style: mapConfig.style!,
          center: mapConfig.center,
          zoom: mapConfig.zoom,
          minZoom: mapConfig.minZoom,
          maxZoom: mapConfig.maxZoom,
          bearing: mapConfig.bearing,
          pitch: mapConfig.pitch,
        });

        // ナビゲーションコントロールを追加
        newMap.addControl(new maplibregl.NavigationControl(), 'top-right');

        // 全画面コントロールを追加
        newMap.addControl(new maplibregl.FullscreenControl(), 'top-right');

        // スケールコントロールを追加
        newMap.addControl(
          new maplibregl.ScaleControl({
            maxWidth: 80,
            unit: 'metric',
          }),
          'bottom-left'
        );

        // ロード完了イベント
        newMap.on('load', () => {
          if (isMounted) {
            setIsLoaded(true);
            setError(null);
            onMapLoad?.(newMap);
          }
        });

        // エラーイベント
        newMap.on('error', (e) => {
          if (isMounted) {
            const errorMessage = e.error?.message || 'マップでエラーが発生しました';
            setError(errorMessage);
            onMapError?.(new Error(errorMessage));
          }
        });

        // マップインスタンスを保存
        map.current = newMap;
      } catch (err) {
        if (isMounted) {
          const errorMessage = err instanceof Error 
            ? err.message 
            : 'マップの初期化に失敗しました';
          setError(errorMessage);
          onMapError?.(new Error(errorMessage));
        }
      }
    };

    initializeMap();

    // クリーンアップ
    return () => {
      isMounted = false;
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // エラー表示
  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 text-gray-600 ${className}`}>
        <div className="text-center p-4">
          <div className="text-red-500 mb-2">⚠️ マップエラー</div>
          <div className="text-sm">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            再読み込み
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* マップコンテナー */}
      <div
        ref={mapContainer}
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />

      {/* ローディング状態 */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2" />
            <div className="text-gray-600">地図を読み込み中...</div>
          </div>
        </div>
      )}

      {/* 地図情報表示 */}
      {isLoaded && (
        <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 shadow-lg">
          <div className="text-sm font-medium text-gray-800">WorstRoute Map</div>
          <div className="text-xs text-gray-600">
            ズーム: {Math.round(map.current?.getZoom() || 0)}
          </div>
        </div>
      )}

      {/* 子要素（オーバーレイなど） */}
      {isLoaded && children}
    </div>
  );
}