'use client';

import { useEffect, useRef, useState } from 'react';

// 動的インポートでMapLibreを読み込み（SSR対応）
const loadMapLibre = async () => {
  const maplibregl = await import('maplibre-gl');
  return maplibregl.default;
};

/**
 * MapLibre基本設定型
 */
interface MapConfig {
  center: [number, number];
  zoom: number;
  style?: string;
  minZoom?: number;
  maxZoom?: number;
  bearing?: number;
  pitch?: number;
}

/**
 * useMapLibreフックの戻り値型
 */
interface UseMapLibreReturn {
  mapRef: React.RefObject<HTMLDivElement | null>;
  map: any | null; // MapLibreMapは後でimport後に型を更新
  isLoaded: boolean;
  error: string | null;
  reload: () => void;
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
 * MapLibre地図を管理するカスタムフック
 * 
 * @param config - マップ設定（オプション）
 * @returns マップ参照、インスタンス、状態
 */
export function useMapLibre(config: Partial<MapConfig> = {}): UseMapLibreReturn {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  // マップ設定をマージ
  const mapConfig: MapConfig = { ...DEFAULT_CONFIG, ...config };

  useEffect(() => {
    if (!mapRef.current || map.current) return;

    let isMounted = true;

    const initializeMap = async () => {
      try {
        setError(null);
        setIsLoaded(false);

        // MapLibreを動的に読み込み
        const maplibregl = await loadMapLibre();

        // マウント状態を確認
        if (!isMounted || !mapRef.current) return;

        // マップインスタンスを作成
        const newMap = new maplibregl.Map({
          container: mapRef.current,
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
          }
        });

        // エラーイベント
        newMap.on('error', (e: any) => {
          if (isMounted) {
            const errorMessage = e.error?.message || 'マップでエラーが発生しました';
            setError(errorMessage);
          }
        });

        // スタイルロードイベント
        newMap.on('styledata', () => {
          if (isMounted) {
            console.log('Map style loaded');
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
        }
      }
    };

    initializeMap();

    // クリーンアップ
    return () => {
      isMounted = false;
      if (map.current) {
        try {
          map.current.remove();
        } catch (err) {
          console.warn('Map cleanup error:', err);
        }
        map.current = null;
      }
      setIsLoaded(false);
    };
  }, [reloadTrigger]); // reloadTriggerが変わったら再初期化

  // リロード関数
  const reload = () => {
    if (map.current) {
      map.current.remove();
      map.current = null;
    }
    setIsLoaded(false);
    setError(null);
    setReloadTrigger(prev => prev + 1);
  };

  return {
    mapRef,
    map: map.current,
    isLoaded,
    error,
    reload,
  };
}

/**
 * マーカーを追加するヘルパーフック
 */
export function useMapMarkers(map: any) {
  const markersRef = useRef<Map<string, any>>(new Map());

  const addMarker = async (
    id: string, 
    coordinates: [number, number], 
    options: { color?: string; popup?: string } = {}
  ) => {
    if (!map) return null;

    try {
      const maplibregl = await loadMapLibre();
      
      // 既存のマーカーを削除
      if (markersRef.current.has(id)) {
        markersRef.current.get(id)?.remove();
      }

      // 新しいマーカーを作成
      const marker = new maplibregl.Marker({ color: options.color })
        .setLngLat(coordinates)
        .addTo(map);

      // ポップアップを追加
      if (options.popup) {
        const popup = new maplibregl.Popup({ offset: 25 })
          .setHTML(options.popup);
        marker.setPopup(popup);
      }

      markersRef.current.set(id, marker);
      return marker;
    } catch (err) {
      console.error('Failed to add marker:', err);
      return null;
    }
  };

  const removeMarker = (id: string) => {
    const marker = markersRef.current.get(id);
    if (marker) {
      marker.remove();
      markersRef.current.delete(id);
    }
  };

  const clearMarkers = () => {
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current.clear();
  };

  return {
    addMarker,
    removeMarker,
    clearMarkers,
  };
}