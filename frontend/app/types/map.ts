// MapLibre GL JS関連の型定義

// MapLibre GLの型定義（動的インポート対応）
export type LngLatLike = [number, number] | { lng: number; lat: number };
export type MapLibreMap = any; // 実際のMapインスタンス（動的インポート後に設定）

/**
 * 座標の型定義
 */
export interface Coordinates {
  lng: number;
  lat: number;
}

/**
 * バウンディングボックスの型定義
 */
export interface BoundingBox {
  north: number;
  south: number;
  east: number;
  west: number;
}

/**
 * マップ設定の型定義
 */
export interface MapConfig {
  center: LngLatLike;
  zoom: number;
  style?: string;
  container?: string | HTMLElement;
  minZoom?: number;
  maxZoom?: number;
  bearing?: number;
  pitch?: number;
}

/**
 * マーカーの型定義
 */
export interface MarkerData {
  id: string;
  coordinates: Coordinates;
  title?: string;
  description?: string;
  type?: 'start' | 'end' | 'waypoint' | 'accident' | 'custom';
  color?: string;
}

/**
 * ルートの型定義
 */
export interface RouteData {
  id: string;
  coordinates: Coordinates[];
  color?: string;
  width?: number;
  opacity?: number;
}

/**
 * MapLibre フック用の戻り値の型
 */
export interface UseMapLibreReturn {
  mapRef: React.RefObject<HTMLDivElement>;
  map: MapLibreMap | null;
  isLoaded: boolean;
  error: string | null;
}

/**
 * MapComponentの Props型
 */
export interface MapComponentProps {
  config?: Partial<MapConfig>;
  className?: string;
  onMapLoad?: (map: MapLibreMap) => void;
  onMapError?: (error: Error) => void;
  children?: React.ReactNode;
}

/**
 * MapComponentの Props型
 */
export interface MapComponentProps {
  config?: Partial<MapConfig>;
  className?: string;
  onMapLoad?: (map: MapLibreMap) => void;
  onMapError?: (error: Error) => void;
  children?: React.ReactNode;
}

/**
 * デフォルトのマップ設定
 */
export const DEFAULT_MAP_CONFIG: MapConfig = {
  center: [139.7671, 35.6812], // 東京駅
  zoom: 12,
  style: 'https://demotiles.maplibre.org/style.json',
  minZoom: 0,
  maxZoom: 22,
  bearing: 0,
  pitch: 0,
};

/**
 * エラーメッセージの定数
 */
export const MAP_ERROR_MESSAGES = {
  INITIALIZATION_FAILED: 'マップの初期化に失敗しました',
  STYLE_LOAD_FAILED: 'マップスタイルの読み込みに失敗しました',
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
  BROWSER_NOT_SUPPORTED: 'お使いのブラウザはMapLibreをサポートしていません',
} as const;