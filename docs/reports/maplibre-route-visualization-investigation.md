# MapLibre GLを使用したルート可視化方法 調査レポート

## 概要
MapLibre GLでルートを可視化する方法を調査し、AWS Geo RoutesのレスポンスをMapLibre GLで描画する実装方法をまとめました。

## MapLibre GLでのルート描画方法

### 1. GeoJSON LineString方式（推奨）

#### 基本的な実装
```javascript
map.on('load', () => {
  // ルートデータソースを追加
  map.addSource('route', {
    'type': 'geojson',
    'data': {
      'type': 'Feature',
      'properties': {},
      'geometry': {
        'type': 'LineString',
        'coordinates': routeCoordinates // [[lng, lat], [lng, lat], ...]
      }
    }
  });

  // ルートレイヤーを追加
  map.addLayer({
    'id': 'route',
    'type': 'line',
    'source': 'route',
    'layout': {
      'line-join': 'round',
      'line-cap': 'round'
    },
    'paint': {
      'line-color': '#3887be',
      'line-width': 5,
      'line-opacity': 0.75
    }
  });
});
```

#### スタイルオプション
- **line-color**: ルートの色
- **line-width**: ルートの太さ
- **line-opacity**: 透明度
- **line-dasharray**: 破線パターン `[2, 2]`
- **line-gradient**: グラデーション効果

### 2. アニメーション付きルート描画

#### 段階的に描画するアニメーション
```javascript
function animateRoute(coordinates) {
  let step = 0;
  const numSteps = coordinates.length;
  
  function addNextCoordinate() {
    if (step < numSteps) {
      const currentCoords = coordinates.slice(0, step + 1);
      
      map.getSource('route').setData({
        'type': 'Feature',
        'geometry': {
          'type': 'LineString',
          'coordinates': currentCoords
        }
      });
      
      step++;
      requestAnimationFrame(addNextCoordinate);
    }
  }
  
  addNextCoordinate();
}
```

### 3. 複数ルートの表示

#### 代替ルートの表示
```javascript
// メインルート
map.addLayer({
  'id': 'main-route',
  'type': 'line',
  'source': 'main-route',
  'paint': {
    'line-color': '#3887be',
    'line-width': 6
  }
});

// 代替ルート
map.addLayer({
  'id': 'alt-route',
  'type': 'line',
  'source': 'alt-route',
  'paint': {
    'line-color': '#888888',
    'line-width': 4,
    'line-opacity': 0.6
  }
});
```

## AWS Geo Routes レスポンスとの統合

### 1. Geo Routes API レスポンス形式
```json
{
  "Routes": [
    {
      "Summary": {
        "Distance": 12345,
        "Duration": 1234
      },
      "Legs": [
        {
          "Geometry": {
            "LineString": [
              [139.767, 35.681],
              [139.768, 35.682]
            ]
          }
        }
      ]
    }
  ]
}
```

### 2. レスポンス変換関数
```javascript
function extractRouteCoordinates(routeResponse) {
  const coordinates = [];
  
  if (routeResponse.Routes && routeResponse.Routes[0]) {
    const legs = routeResponse.Routes[0].Legs || [];
    
    legs.forEach(leg => {
      if (leg.Geometry && leg.Geometry.LineString) {
        coordinates.push(...leg.Geometry.LineString);
      }
    });
  }
  
  return coordinates;
}
```

### 3. Map統合関数
```javascript
function displayRoute(routeCoordinates) {
  if (!routeCoordinates || routeCoordinates.length === 0) return;
  
  // 既存のルートを削除
  if (map.getSource('route')) {
    map.removeLayer('route');
    map.removeSource('route');
  }
  
  // 新しいルートを追加
  map.addSource('route', {
    'type': 'geojson',
    'data': {
      'type': 'Feature',
      'geometry': {
        'type': 'LineString',
        'coordinates': routeCoordinates
      }
    }
  });
  
  map.addLayer({
    'id': 'route',
    'type': 'line',
    'source': 'route',
    'layout': {
      'line-join': 'round',
      'line-cap': 'round'
    },
    'paint': {
      'line-color': '#3887be',
      'line-width': 5,
      'line-opacity': 0.75
    }
  });
  
  // ルート全体が見えるようにマップを調整
  const bounds = new maplibregl.LngLatBounds();
  routeCoordinates.forEach(coord => bounds.extend(coord));
  map.fitBounds(bounds, { padding: 50 });
}
```

## 高度な機能

### 1. ルート方向矢印
```javascript
// 矢印シンボルレイヤーを追加
map.addLayer({
  'id': 'route-arrows',
  'type': 'symbol',
  'source': 'route',
  'layout': {
    'symbol-placement': 'line',
    'symbol-spacing': 100,
    'icon-image': 'arrow-icon',
    'icon-size': 0.5
  }
});
```

### 2. 交通状況の色分け
```javascript
// 交通渋滞に応じた色分け
const trafficColors = [
  'case',
  ['<', ['get', 'speed'], 10], '#ff0000', // 渋滞: 赤
  ['<', ['get', 'speed'], 30], '#ff8800', // 混雑: オレンジ  
  '#00ff00' // 順調: 緑
];

map.addLayer({
  'id': 'route',
  'type': 'line',
  'source': 'route',
  'paint': {
    'line-color': trafficColors,
    'line-width': 6
  }
});
```

### 3. インタラクティブ機能
```javascript
// ルートクリック時の詳細表示
map.on('click', 'route', (e) => {
  const popup = new maplibregl.Popup()
    .setLngLat(e.lngLat)
    .setHTML(`
      <div>
        <h4>ルート詳細</h4>
        <p>距離: ${routeInfo.distance}km</p>
        <p>時間: ${routeInfo.duration}分</p>
      </div>
    `)
    .addTo(map);
});

// ホバー効果
map.on('mouseenter', 'route', () => {
  map.getCanvas().style.cursor = 'pointer';
});

map.on('mouseleave', 'route', () => {
  map.getCanvas().style.cursor = '';
});
```

## 実装推奨パターン

### 1. useRouteVisualization カスタムフック
```javascript
function useRouteVisualization(map) {
  const displayRoute = useCallback((routeData) => {
    const coordinates = extractRouteCoordinates(routeData);
    displayRouteOnMap(map, coordinates);
  }, [map]);
  
  const clearRoute = useCallback(() => {
    if (map.getSource('route')) {
      map.removeLayer('route');
      map.removeSource('route');
    }
  }, [map]);
  
  return { displayRoute, clearRoute };
}
```

### 2. パフォーマンス最適化
- **座標の間引き**: 長距離ルートでは座標数を制限
- **レベル別表示**: ズームレベルに応じた詳細度調整
- **バッファリング**: 複数ルートの効率的な管理

## 参考資料
- [MapLibre GL JS Examples](https://maplibre.org/maplibre-gl-js/docs/examples/)
- [GeoJSON LineString Specification](https://tools.ietf.org/html/rfc7946#section-3.1.4)
- [MapLibre GL JS API Documentation](https://maplibre.org/maplibre-gl-js/docs/API/)

## 実装の次ステップ
1. **基本ルート描画**: GeoJSON LineStringでのシンプル実装
2. **レスポンス統合**: AWS Geo RoutesのGeometryデータ活用
3. **UI連携**: 現在のMapコンポーネントへの統合
4. **スタイル改善**: ブランドカラーに合わせたデザイン
5. **アニメーション追加**: UX向上のための演出効果