# MapLibre + AWS Location Service ルーティング実装調査

## 調査目的
Next.js プロジェクトで MapLibre GL JS と AWS Location Service を使用して、二点間のルートを算出・表示するコンポーネントの実装方法を調査する。

## 技術スタック
- Next.js
- MapLibre GL JS
- AWS Location Service
- TypeScript

## 調査内容

### 1. AWS Location Service とは

AWS Location Serviceは、アプリケーションに位置機能を簡単に追加できる完全マネージド型サービスです。

**主な機能：**
- **Maps**: 地図表示機能
- **Places**: 場所検索と住所変換（ジオコーディング）
- **Routes**: ルート計算機能
- **Trackers**: 位置追跡機能
- **Geofences**: ジオフェンス機能

**特徴：**
- 高品質な地理空間データの提供
- プライバシーとセキュリティの制御
- 他のAWSサービスとのシームレスな統合
- メタデータの匿名化によるデータ保護

### 2. MapLibre GL JS とは

MapLibre GL JSは、ウェブサイトやWebViewベースのアプリで地図を表示するためのオープンソースライブラリです。

**特徴：**
- GPU アクセラレーションによる高速なベクタータイル描画
- Mapbox GL JS v1.x のオープンソースフォーク
- カスタマイズ可能なスタイル
- React、Vue、Angularとの統合が容易

### 3. 必要なパッケージとセットアップ

```json
{
  "dependencies": {
    "@aws-sdk/client-location": "^3.x.x",
    "@aws-sdk/credential-providers": "^3.x.x",
    "maplibre-gl": "^4.x.x",
    "react": "^18.x.x",
    "next": "^14.x.x"
  },
  "devDependencies": {
    "@types/maplibre-gl": "^4.x.x",
    "typescript": "^5.x.x"
  }
}
```

**CDN経由での読み込み（開発用）：**
```html
<script src='https://unpkg.com/maplibre-gl@latest/dist/maplibre-gl.js'></script>
<link href='https://unpkg.com/maplibre-gl@latest/dist/maplibre-gl.css' rel='stylesheet' />
```

### 4. AWS Location Service の設定

#### 4.1 必要なリソース

**Route Calculator（ルート計算機）の作成：**
- AWS Consoleまたは AWS CLI でルート計算機を作成
- データプロバイダー: Esri、HERE、GrabMaps から選択
- 使用目的に応じた適切なプロバイダーを選択

**Map リソースの作成：**
- 地図表示用のマップリソース
- スタイル: VectorEsriStreets、VectorHere、RasterEsriImagery など

#### 4.2 IAM権限

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "geo:CalculateRoute",
        "geo:GetMapTile",
        "geo:GetMapStyleDescriptor",
        "geo:GetMapGlyphs",
        "geo:GetMapSprites"
      ],
      "Resource": [
        "arn:aws:geo:region:account-id:route-calculator/route-calculator-name",
        "arn:aws:geo:region:account-id:map/map-name"
      ]
    }
  ]
}
```

### 5. ルーティング機能の実装方法

#### 5.1 AWS SDK設定

```typescript
import { LocationClient, CalculateRouteCommand } from '@aws-sdk/client-location';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';

const locationClient = new LocationClient({
  region: 'us-east-1',
  credentials: fromCognitoIdentityPool({
    clientConfig: { region: 'us-east-1' },
    identityPoolId: 'your-identity-pool-id',
  }),
});
```

#### 5.2 ルート計算API

```typescript
async function calculateRoute(
  startCoordinates: [number, number],
  endCoordinates: [number, number]
) {
  const params = {
    CalculatorName: 'your-route-calculator-name',
    DeparturePosition: startCoordinates,
    DestinationPosition: endCoordinates,
    TravelMode: 'Car', // Car, Truck, Walking, Bicycle
    DepartNow: true,
    IncludeLegGeometry: true,
    DistanceUnit: 'Kilometers',
  };

  try {
    const command = new CalculateRouteCommand(params);
    const response = await locationClient.send(command);
    return response;
  } catch (error) {
    console.error('Route calculation failed:', error);
    throw error;
  }
}
```

### 6. Next.js でのコンポーネント実装

#### 6.1 基本的な地図コンポーネント

```typescript
// components/RouteMap.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { LocationClient, CalculateRouteCommand } from '@aws-sdk/client-location';
import 'maplibre-gl/dist/maplibre-gl.css';

interface RouteMapProps {
  mapName: string;
  calculatorName: string;
  region: string;
  identityPoolId: string;
}

export default function RouteMap({
  mapName,
  calculatorName,
  region,
  identityPoolId
}: RouteMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [startPoint, setStartPoint] = useState<[number, number] | null>(null);
  const [endPoint, setEndPoint] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // AWS Credentials設定
    const locationClient = new LocationClient({
      region,
      credentials: fromCognitoIdentityPool({
        clientConfig: { region },
        identityPoolId,
      }),
    });

    // MapLibre地図の初期化
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://maps.geo.${region}.amazonaws.com/maps/v0/maps/${mapName}/style-descriptor`,
      center: [139.7671, 35.6812], // 東京
      zoom: 10,
      transformRequest: (url, resourceType) => {
        if (url.includes('amazonaws.com')) {
          return {
            url: [url.slice(0, url.indexOf('?')), url.slice(url.indexOf('?'))].join('?'),
          };
        }
        return { url };
      },
    });

    // マップクリックイベント
    map.current.on('click', async (e) => {
      const coordinates: [number, number] = [e.lngLat.lng, e.lngLat.lat];
      
      if (!startPoint) {
        setStartPoint(coordinates);
        addMarker(coordinates, 'start');
      } else if (!endPoint) {
        setEndPoint(coordinates);
        addMarker(coordinates, 'end');
        
        // ルート計算実行
        try {
          const route = await calculateRoute(startPoint, coordinates);
          displayRoute(route);
        } catch (error) {
          console.error('Route calculation failed:', error);
        }
      } else {
        // リセット
        clearMap();
        setStartPoint(coordinates);
        setEndPoint(null);
        addMarker(coordinates, 'start');
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [mapName, region, identityPoolId]);

  const calculateRoute = async (
    start: [number, number],
    end: [number, number]
  ) => {
    const params = {
      CalculatorName: calculatorName,
      DeparturePosition: start,
      DestinationPosition: end,
      TravelMode: 'Car',
      DepartNow: true,
      IncludeLegGeometry: true,
      DistanceUnit: 'Kilometers',
    };

    const command = new CalculateRouteCommand(params);
    const response = await locationClient.send(command);
    return response;
  };

  const addMarker = (coordinates: [number, number], type: 'start' | 'end') => {
    if (!map.current) return;

    const color = type === 'start' ? '#22c55e' : '#ef4444';
    new maplibregl.Marker({ color })
      .setLngLat(coordinates)
      .addTo(map.current);
  };

  const displayRoute = (routeResponse: any) => {
    if (!map.current || !routeResponse.Routes?.[0]) return;

    const route = routeResponse.Routes[0];
    const geometry = route.Legs[0].Geometry;

    // ルートラインを地図に追加
    map.current.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: geometry.LineString,
        },
      },
    });

    map.current.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#3b82f6',
        'line-width': 5,
        'line-opacity': 0.75,
      },
    });

    // ルート情報表示
    const distance = (route.Summary.Distance / 1000).toFixed(1);
    const duration = Math.round(route.Summary.DurationSeconds / 60);
    
    console.log(`Distance: ${distance} km, Duration: ${duration} minutes`);
  };

  const clearMap = () => {
    if (!map.current) return;
    
    // マーカーとルートをクリア
    const markers = document.querySelectorAll('.maplibregl-marker');
    markers.forEach(marker => marker.remove());
    
    if (map.current.getLayer('route')) {
      map.current.removeLayer('route');
      map.current.removeSource('route');
    }
  };

  return (
    <div className="w-full h-96 relative">
      <div ref={mapContainer} className="w-full h-full" />
      <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-lg">
        <p className="text-sm font-medium">クリックして経路を設定</p>
        <p className="text-xs text-gray-600">
          {!startPoint && "出発地点をクリック"}
          {startPoint && !endPoint && "目的地をクリック"}
          {startPoint && endPoint && "新しい経路を設定するにはクリック"}
        </p>
      </div>
    </div>
  );
}
```

#### 6.2 ページコンポーネントでの使用

```typescript
// app/map/page.tsx
import RouteMap from '@/components/RouteMap';

export default function MapPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ルート検索</h1>
      <RouteMap
        mapName="your-map-name"
        calculatorName="your-calculator-name"
        region="us-east-1"
        identityPoolId="your-identity-pool-id"
      />
    </div>
  );
}
```

### 7. 認証とセキュリティ

#### 7.1 Amazon Cognito Identity Pool設定

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "cognito-identity.amazonaws.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "cognito-identity.amazonaws.com:aud": "your-identity-pool-id"
        }
      }
    }
  ]
}
```

#### 7.2 環境変数管理

```typescript
// config/aws.ts
export const awsConfig = {
  region: process.env.NEXT_PUBLIC_AWS_REGION!,
  identityPoolId: process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID!,
  mapName: process.env.NEXT_PUBLIC_MAP_NAME!,
  calculatorName: process.env.NEXT_PUBLIC_CALCULATOR_NAME!,
};
```

### 8. 高度な機能実装

#### 8.1 複数ルート取得と代替ルート表示

AWS Location Serviceでは、複数の代替ルートを取得し、各ルートに状態情報を付与することができます。

```typescript
interface RouteStatus {
  id: string;
  available: boolean;
  reason?: string;
  severity: 'info' | 'warning' | 'error';
  color: string;
}

async function calculateMultipleRoutes(
  start: [number, number],
  end: [number, number]
): Promise<RouteWithStatus[]> {
  const routeOptions = [
    { TravelMode: 'Car', AvoidFerries: false, AvoidTolls: false },
    { TravelMode: 'Car', AvoidFerries: true, AvoidTolls: false },
    { TravelMode: 'Car', AvoidFerries: false, AvoidTolls: true },
  ];

  const routes = await Promise.all(
    routeOptions.map(async (options, index) => {
      try {
        const params = {
          CalculatorName: calculatorName,
          DeparturePosition: start,
          DestinationPosition: end,
          ...options,
          DepartNow: true,
          IncludeLegGeometry: true,
          DistanceUnit: 'Kilometers',
        };

        const command = new CalculateRouteCommand(params);
        const response = await locationClient.send(command);
        
        // ルート状態の判定ロジック
        const status = determineRouteStatus(response.Routes[0], index);
        
        return {
          route: response.Routes[0],
          status,
          options,
        };
      } catch (error) {
        return {
          route: null,
          status: {
            id: `route-${index}`,
            available: false,
            reason: 'ルートを計算できませんでした',
            severity: 'error' as const,
            color: '#ef4444',
          },
          options,
        };
      }
    })
  );

  return routes.filter(r => r.route !== null);
}

function determineRouteStatus(route: any, index: number): RouteStatus {
  const baseStatus = {
    id: `route-${index}`,
    available: true,
    severity: 'info' as const,
  };

  // 距離や時間による判定
  const distance = route.Summary.Distance / 1000; // km
  const duration = route.Summary.DurationSeconds / 60; // minutes

  if (distance > 500) {
    return {
      ...baseStatus,
      available: false,
      reason: '距離が長すぎます (500km超)',
      severity: 'warning',
      color: '#f59e0b',
    };
  }

  if (duration > 480) { // 8時間超
    return {
      ...baseStatus,
      available: false,
      reason: '運転時間が長すぎます (8時間超)',
      severity: 'warning',
      color: '#f59e0b',
    };
  }

  // 道路制限の模擬判定（実際のAPIからの情報に基づいて調整）
  const hasRestrictions = Math.random() > 0.7; // 30%の確率で制限あり
  if (hasRestrictions) {
    const restrictions = ['工事中', '通行止め', '重量制限', '時間制限'];
    const restriction = restrictions[Math.floor(Math.random() * restrictions.length)];
    
    return {
      ...baseStatus,
      available: false,
      reason: `${restriction}のため通行不可`,
      severity: 'error',
      color: '#ef4444',
    };
  }

  // 利用可能なルート
  const colors = ['#3b82f6', '#10b981', '#8b5cf6'];
  return {
    ...baseStatus,
    color: colors[index] || '#6b7280',
  };
}
```

#### 8.2 複数ルートの地図表示

```typescript
function displayMultipleRoutes(routes: RouteWithStatus[]) {
  if (!map.current) return;

  // 既存のルートレイヤーをクリア
  clearAllRoutes();

  routes.forEach((routeData, index) => {
    if (!routeData.route) return;

    const { route, status } = routeData;
    const geometry = route.Legs[0].Geometry;
    const sourceId = `route-${status.id}`;
    const layerId = `route-layer-${status.id}`;

    // ルートソースを追加
    map.current!.addSource(sourceId, {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {
          status: status.available,
          reason: status.reason,
          severity: status.severity,
        },
        geometry: {
          type: 'LineString',
          coordinates: geometry.LineString,
        },
      },
    });

    // ルートレイヤーを追加
    map.current!.addLayer({
      id: layerId,
      type: 'line',
      source: sourceId,
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': status.color,
        'line-width': status.available ? 5 : 3,
        'line-opacity': status.available ? 0.8 : 0.4,
        'line-dasharray': status.available ? [1] : [2, 2], // 利用不可は破線
      },
    });

    // ルートクリック時の情報表示
    map.current!.on('click', layerId, (e) => {
      const properties = e.features![0].properties;
      
      new maplibregl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(`
          <div class="route-popup">
            <h4>${properties.status ? '利用可能なルート' : '利用不可のルート'}</h4>
            ${properties.reason ? `<p>${properties.reason}</p>` : ''}
            <div class="route-details">
              <p>距離: ${(route.Summary.Distance / 1000).toFixed(1)} km</p>
              <p>時間: ${Math.round(route.Summary.DurationSeconds / 60)} 分</p>
            </div>
          </div>
        `)
        .addTo(map.current!);
    });

    // マウスホバー時のカーソル変更
    map.current!.on('mouseenter', layerId, () => {
      map.current!.getCanvas().style.cursor = 'pointer';
    });

    map.current!.on('mouseleave', layerId, () => {
      map.current!.getCanvas().style.cursor = '';
    });
  });
}
```

#### 8.3 ルート選択UI コンポーネント

```typescript
interface RouteListProps {
  routes: RouteWithStatus[];
  onSelectRoute: (routeId: string) => void;
  selectedRouteId?: string;
}

function RouteList({ routes, onSelectRoute, selectedRouteId }: RouteListProps) {
  return (
    <div className="route-list bg-white rounded-lg shadow-lg p-4 max-h-96 overflow-y-auto">
      <h3 className="font-bold text-lg mb-3">利用可能なルート</h3>
      
      {routes.map((routeData) => {
        const { route, status } = routeData;
        if (!route) return null;

        const distance = (route.Summary.Distance / 1000).toFixed(1);
        const duration = Math.round(route.Summary.DurationSeconds / 60);
        const isSelected = selectedRouteId === status.id;

        return (
          <div
            key={status.id}
            className={`route-item p-3 mb-2 rounded border cursor-pointer transition-colors ${
              isSelected ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
            } ${!status.available ? 'opacity-60' : ''}`}
            onClick={() => status.available && onSelectRoute(status.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: status.color }}
                />
                <div>
                  <div className="font-medium">
                    ルート {status.id.split('-')[1]}
                    {!status.available && (
                      <span className="ml-2 text-sm text-red-600 font-normal">
                        利用不可
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    {distance} km • {duration} 分
                  </div>
                  {status.reason && (
                    <div className={`text-sm mt-1 ${
                      status.severity === 'error' ? 'text-red-600' : 
                      status.severity === 'warning' ? 'text-yellow-600' : 
                      'text-blue-600'
                    }`}>
                      {status.reason}
                    </div>
                  )}
                </div>
              </div>
              
              {status.available && (
                <button
                  className={`px-3 py-1 rounded text-sm ${
                    isSelected 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {isSelected ? '選択中' : '選択'}
                </button>
              )}
            </div>
          </div>
        );
      })}
      
      {routes.every(r => !r.status.available) && (
        <div className="text-center py-8 text-gray-500">
          <p>利用可能なルートがありません</p>
          <p className="text-sm mt-1">条件を変更して再検索してください</p>
        </div>
      )}
    </div>
  );
}
```

#### 8.4 リアルタイム道路状況の統合

```typescript
// 外部APIやデータベースから道路状況を取得
async function getRoadConditions(routeGeometry: any): Promise<RoadCondition[]> {
  // 実際の実装では交通情報APIや自社データベースを使用
  const mockConditions = [
    {
      location: [139.7671, 35.6812],
      type: 'construction',
      severity: 'high',
      message: '首都高速道路工事のため通行止め',
      startTime: new Date('2025-09-13T08:00:00'),
      endTime: new Date('2025-09-13T18:00:00'),
    },
    {
      location: [139.7500, 35.6762],
      type: 'accident',
      severity: 'medium',
      message: '事故により渋滞発生',
      estimatedClearTime: new Date('2025-09-13T16:30:00'),
    }
  ];

  return mockConditions;
}

// ルート状態の動的更新
function updateRouteStatus(routeId: string, newStatus: Partial<RouteStatus>) {
  setRoutes(prevRoutes => 
    prevRoutes.map(route => 
      route.status.id === routeId 
        ? { ...route, status: { ...route.status, ...newStatus }}
        : route
    )
  );

  // 地図上のルート表示も更新
  updateRouteLayer(routeId, newStatus);
}
```

#### 8.5 複数の中継地点対応

```typescript
async function calculateRouteWithWaypoints(
  start: [number, number],
  waypoints: [number, number][],
  end: [number, number]
) {
  const allPoints = [start, ...waypoints, end];
  const routes = [];

  for (let i = 0; i < allPoints.length - 1; i++) {
    const routeSegment = await calculateRoute(allPoints[i], allPoints[i + 1]);
    routes.push(routeSegment);
  }

  return routes;
}
```

#### 8.6 通行禁止地点（Avoid Areas）の設定

AWS Location Serviceでは、ルート計算時に特定のエリアを回避する「Avoid Areas」機能を提供しています。

##### 8.6.1 基本的な通行禁止エリア設定

```typescript
interface AvoidArea {
  id: string;
  name: string;
  geometry: {
    BoundingBox?: [number, number, number, number]; // [MinLng, MinLat, MaxLng, MaxLat]
    Polygon?: [number, number][][]; // 複雑な形状の場合
  };
  reason?: string;
  priority: number; // 優先度（高いほど厳格に回避）
}

async function calculateRouteWithAvoidAreas(
  start: [number, number],
  end: [number, number],
  avoidAreas: AvoidArea[]
): Promise<any> {
  // AWS Location Service の AvoidAreas パラメータを構築
  const avoidAreasParam = avoidAreas.map(area => ({
    Geometry: area.geometry.BoundingBox 
      ? { BoundingBox: area.geometry.BoundingBox }
      : { Polygon: area.geometry.Polygon }
  }));

  const params = {
    CalculatorName: calculatorName,
    DeparturePosition: start,
    DestinationPosition: end,
    TravelMode: 'Car',
    DepartNow: true,
    IncludeLegGeometry: true,
    DistanceUnit: 'Kilometers',
    // 通行禁止エリアを指定
    AvoidAreas: avoidAreasParam.slice(0, 23), // AWS制限: 最大23エリア
  };

  try {
    const command = new CalculateRouteCommand(params);
    const response = await locationClient.send(command);
    return response;
  } catch (error) {
    if (error.name === 'ValidationException') {
      throw new Error('通行禁止エリアの設定が無効です。エリア数や形状を確認してください。');
    }
    throw error;
  }
}
```

##### 8.6.2 制限事項と仕様

```typescript
// AWS Location Service の AvoidAreas 制限
const AVOID_AREAS_CONSTRAINTS = {
  maxAreas: 23,                    // 1回のリクエストで最大23エリア
  maxPolygonPoints: 1000,          // ポリゴン1つあたりの最大頂点数
  maxTotalArea: 100000,            // 総面積の制限（平方キロメートル）
  coordinatePrecision: 6,          // 座標の小数点精度
};

// 通行禁止エリアのバリデーション
function validateAvoidAreas(areas: AvoidArea[]): ValidationResult {
  const errors: string[] = [];
  
  if (areas.length > AVOID_AREAS_CONSTRAINTS.maxAreas) {
    errors.push(`通行禁止エリアは最大${AVOID_AREAS_CONSTRAINTS.maxAreas}個まで設定可能です`);
  }

  areas.forEach((area, index) => {
    // ポリゴンの頂点数チェック
    if (area.geometry.Polygon) {
      const totalPoints = area.geometry.Polygon.reduce((sum, ring) => sum + ring.length, 0);
      if (totalPoints > AVOID_AREAS_CONSTRAINTS.maxPolygonPoints) {
        errors.push(`エリア${index + 1}: ポリゴンの頂点数が制限を超えています`);
      }
    }

    // BoundingBoxの妥当性チェック
    if (area.geometry.BoundingBox) {
      const [minLng, minLat, maxLng, maxLat] = area.geometry.BoundingBox;
      if (minLng >= maxLng || minLat >= maxLat) {
        errors.push(`エリア${index + 1}: BoundingBoxの座標が無効です`);
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}
```

##### 8.6.3 動的な通行禁止エリア管理

```typescript
interface AvoidAreaManager {
  areas: Map<string, AvoidArea>;
  addArea: (area: AvoidArea) => boolean;
  removeArea: (id: string) => boolean;
  updateArea: (id: string, updates: Partial<AvoidArea>) => boolean;
  getActiveAreas: () => AvoidArea[];
  clear: () => void;
}

class AvoidAreaManager implements AvoidAreaManager {
  areas = new Map<string, AvoidArea>();

  addArea(area: AvoidArea): boolean {
    if (this.areas.size >= AVOID_AREAS_CONSTRAINTS.maxAreas) {
      console.warn('通行禁止エリアの上限に達しています');
      return false;
    }

    // バリデーション
    const validation = validateAvoidAreas([...this.areas.values(), area]);
    if (!validation.isValid) {
      console.error('エリア追加エラー:', validation.errors);
      return false;
    }

    this.areas.set(area.id, area);
    this.notifyChange();
    return true;
  }

  removeArea(id: string): boolean {
    const removed = this.areas.delete(id);
    if (removed) {
      this.notifyChange();
    }
    return removed;
  }

  updateArea(id: string, updates: Partial<AvoidArea>): boolean {
    const existing = this.areas.get(id);
    if (!existing) return false;

    const updated = { ...existing, ...updates };
    const validation = validateAvoidAreas([
      ...Array.from(this.areas.values()).filter(a => a.id !== id),
      updated
    ]);

    if (!validation.isValid) {
      console.error('エリア更新エラー:', validation.errors);
      return false;
    }

    this.areas.set(id, updated);
    this.notifyChange();
    return true;
  }

  getActiveAreas(): AvoidArea[] {
    return Array.from(this.areas.values())
      .sort((a, b) => b.priority - a.priority); // 優先度順
  }

  clear(): void {
    this.areas.clear();
    this.notifyChange();
  }

  private notifyChange(): void {
    // ルート再計算のトリガー
    window.dispatchEvent(new CustomEvent('avoidAreasChanged', {
      detail: { areas: this.getActiveAreas() }
    }));
  }
}
```

##### 8.6.4 地図上での通行禁止エリア描画・編集

```typescript
function AvoidAreaEditor({ map, onAreasChange }: {
  map: maplibregl.Map;
  onAreasChange: (areas: AvoidArea[]) => void;
}) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawMode, setDrawMode] = useState<'rectangle' | 'polygon'>('rectangle');
  const areaManager = useRef(new AvoidAreaManager());

  useEffect(() => {
    let draw: MapboxDraw | null = null;

    // 描画ライブラリの初期化（MapboxDrawを使用）
    if (typeof window !== 'undefined') {
      import('@mapbox/mapbox-gl-draw').then((MapboxDraw) => {
        draw = new MapboxDraw.default({
          displayControlsDefault: false,
          controls: {
            polygon: true,
            trash: true
          }
        });
        
        map.addControl(draw);

        // 描画完了イベント
        map.on('draw.create', (e) => {
          const feature = e.features[0];
          const area: AvoidArea = {
            id: `area-${Date.now()}`,
            name: `禁止エリア ${areaManager.current.areas.size + 1}`,
            geometry: {
              Polygon: feature.geometry.coordinates
            },
            reason: '通行禁止',
            priority: 1
          };

          if (areaManager.current.addArea(area)) {
            onAreasChange(areaManager.current.getActiveAreas());
          } else {
            // 追加失敗時は描画を削除
            draw?.delete(feature.id);
          }
        });

        // 削除イベント
        map.on('draw.delete', (e) => {
          e.features.forEach(feature => {
            const areaId = feature.properties?.areaId;
            if (areaId) {
              areaManager.current.removeArea(areaId);
              onAreasChange(areaManager.current.getActiveAreas());
            }
          });
        });
      });
    }

    return () => {
      if (draw && map.hasControl(draw)) {
        map.removeControl(draw);
      }
    };
  }, [map]);

  // 既存エリアの表示
  useEffect(() => {
    const areas = areaManager.current.getActiveAreas();
    
    // 地図上にエリアを表示
    areas.forEach(area => {
      const sourceId = `avoid-area-${area.id}`;
      const layerId = `avoid-area-layer-${area.id}`;

      if (map.getSource(sourceId)) {
        map.removeLayer(layerId);
        map.removeSource(sourceId);
      }

      map.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: { ...area },
          geometry: area.geometry.Polygon 
            ? { type: 'Polygon', coordinates: area.geometry.Polygon }
            : { 
                type: 'Polygon', 
                coordinates: [rectangleToPolygon(area.geometry.BoundingBox!)]
              }
        }
      });

      map.addLayer({
        id: layerId,
        type: 'fill',
        source: sourceId,
        paint: {
          'fill-color': '#ff0000',
          'fill-opacity': 0.3
        }
      });

      map.addLayer({
        id: `${layerId}-border`,
        type: 'line',
        source: sourceId,
        paint: {
          'line-color': '#ff0000',
          'line-width': 2
        }
      });
    });
  }, []);

  return (
    <div className="avoid-area-controls bg-white p-4 rounded-lg shadow-lg">
      <h4 className="font-medium mb-3">通行禁止エリア設定</h4>
      
      <div className="space-y-2">
        <div className="text-sm text-gray-600">
          設定可能エリア数: {areaManager.current.areas.size} / {AVOID_AREAS_CONSTRAINTS.maxAreas}
        </div>
        
        <button
          onClick={() => setIsDrawing(!isDrawing)}
          disabled={areaManager.current.areas.size >= AVOID_AREAS_CONSTRAINTS.maxAreas}
          className={`w-full py-2 px-4 rounded ${
            isDrawing 
              ? 'bg-red-600 text-white' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          } disabled:bg-gray-400`}
        >
          {isDrawing ? 'キャンセル' : 'エリア追加'}
        </button>

        <button
          onClick={() => {
            areaManager.current.clear();
            onAreasChange([]);
          }}
          className="w-full py-2 px-4 rounded bg-gray-600 text-white hover:bg-gray-700"
        >
          すべてクリア
        </button>
      </div>

      {/* エリア一覧 */}
      <div className="mt-4 space-y-2">
        {areaManager.current.getActiveAreas().map(area => (
          <div key={area.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span className="text-sm">{area.name}</span>
            <button
              onClick={() => {
                areaManager.current.removeArea(area.id);
                onAreasChange(areaManager.current.getActiveAreas());
              }}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              削除
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function rectangleToPolygon(bbox: [number, number, number, number]): [number, number][] {
  const [minLng, minLat, maxLng, maxLat] = bbox;
  return [
    [minLng, minLat],
    [maxLng, minLat],
    [maxLng, maxLat],
    [minLng, maxLat],
    [minLng, minLat] // 閉じる
  ];
}
```

##### 8.6.5 制限と注意点

**AWS Location Service制限:**
- **最大エリア数**: 23個/リクエスト
- **ポリゴン頂点数**: 1,000点/エリア
- **座標精度**: 小数点6桁まで
- **形状制限**: 自己交差するポリゴンは不可

**パフォーマンス考慮事項:**
- エリア数が多いほど計算時間が増加
- 複雑な形状ほど処理負荷が高い
- キャッシュ機能でAPI呼び出しを最適化

**回避策:**
- 23個を超える場合は複数回のAPI呼び出しで対応
- 大きなエリアは分割して設定
- 優先度による段階的な回避設定

#### 8.7 リアルタイム位置追跡

```typescript
function useCurrentLocation() {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setPosition([pos.coords.longitude, pos.coords.latitude]);
        },
        (error) => console.error('Geolocation error:', error),
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  return position;
}
```

### 9. 注意点とベストプラクティス

#### 9.1 パフォーマンス最適化

- **遅延読み込み**: MapLibreコンポーネントは動的インポートを使用
- **メモ化**: 計算結果のキャッシュを実装
- **デバウンシング**: 連続したAPI呼び出しを制限

#### 9.2 エラーハンドリング

```typescript
const [error, setError] = useState<string | null>(null);

try {
  const route = await calculateRoute(start, end);
  setError(null);
  displayRoute(route);
} catch (err) {
  setError('ルートを計算できませんでした。再試行してください。');
  console.error('Route calculation error:', err);
}
```

#### 9.3 コスト最適化

- API呼び出し頻度の制限
- 不要な地図タイル要求の削減
- キャッシュの効果的活用

### 10. 参考リソース

- **AWS Location Service公式ドキュメント**: https://docs.aws.amazon.com/location/
- **MapLibre GL JS公式ドキュメント**: https://maplibre.org/maplibre-gl-js/docs/
- **AWS SDK for JavaScript v3**: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/
- **AWS Samplesリポジトリ**: https://github.com/aws-samples/amazon-location-service-iot-asset-tracking
- **MapLibre Examples**: https://maplibre.org/maplibre-gl-js/docs/examples/

---

調査日: 2025年9月13日