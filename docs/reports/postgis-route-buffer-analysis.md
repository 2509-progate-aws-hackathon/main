# PostGISを使用したルート周辺事故データ取得の実装調査レポート

作成日：2024年12月14日

## 概要

ルートをクエリに含めてPostGISデータベースから100m圏内の事故データを効率的に取得する処理について調査しました。現在のプロジェクトでのルート形式と合わせて、PostGISでの実装パターンを分析します。

## 現在のプロジェクトにおけるルート形式

### 1. ルートデータの入力形式
- **API**: AWS Geo Routes の `CalculateRoutes` API
- **入力**: 出発地・目的地の座標 (`[longitude, latitude]`)
- **レスポンス形式**: `CalculateRoutesResponse` オブジェクト

### 2. ルートレスポンスの内部構造
```typescript
interface CalculateRoutesResponse {
  Routes: Route[]
}

interface Route {
  Summary: {
    Distance: number      // メートル
    Duration: number      // 秒
  }
  Legs: Leg[]            // ルート区間の配列
}

interface Leg {
  Geometry: {
    Polyline: string     // FlexiblePolyline形式（エンコード済み）
  }
  StartPosition: [number, number]
  EndPosition: [number, number]
  Distance: number
  Duration: number
}
```

### 3. 現在の座標抽出処理
プロジェクトでは2つの方法でルート座標を抽出：

#### 方法1: AWS公式ライブラリ使用（推奨）
```typescript
import { calculateRoutesResponseToFeatureCollections } from '@aws/amazon-location-utilities-datatypes';

const featureCollections = calculateRoutesResponseToFeatureCollections(routeResponse, {
  flattenProperties: true,
  includeLegs: true,           // ルート区間を含む
  includeSpans: false,         // 詳細区間は除外
  includeTravelStepGeometry: false,
  includeTravelStepStartPositions: false,
  includeLegArrivalDeparturePositions: false
});

// Legタイプ（LineString）のフィーチャーから座標を抽出
featureCollection.features.forEach(feature => {
  if (feature.properties?.FeatureType === 'Leg' && 
      feature.geometry.type === 'LineString') {
    coordinates.push(...feature.geometry.coordinates);
  }
});
```

#### 方法2: FlexiblePolyline直接デコード（フォールバック）
```typescript
import { decode } from '@here/flexpolyline';

routeResponse.Routes[0].Legs.forEach(leg => {
  if (leg.Geometry?.Polyline) {
    const decoded = decode(leg.Geometry.Polyline);
    // [lat, lng] → [lng, lat]の順序で変換
    const legCoordinates = decoded.polyline.map(point => [point[1], point[0]]);
    coordinates.push(...legCoordinates);
  }
});
```

### 4. 最終的なルート形式
- **GeoJSON LineString**: `coordinates: [[lng, lat], [lng, lat], ...]`
- **座標系**: WGS84 (SRID: 4326)
- **用途**: MapLibre GL JSでの地図表示

## PostGISでのルート周辺検索実装パターン

### パターン1: ST_DWithin関数を使用した直接検索（推奨）

#### 基本実装
```sql
-- ルートから100m以内の事故を検索
SELECT 
    a.id,
    a.location,
    a.accident_date,
    a.severity,
    ST_Distance(ST_Transform(a.location, 3857), ST_Transform(route_line, 3857)) as distance_meters
FROM accidents a
WHERE ST_DWithin(
    ST_Transform(a.location, 3857),    -- 事故地点をメートル単位座標系に変換
    ST_Transform(route_line, 3857),     -- ルートをメートル単位座標系に変換
    100                                 -- 100メートル
)
ORDER BY distance_meters;
```

#### 動的ルート指定版
```sql
-- パラメータ化されたクエリ
WITH route_geom AS (
  SELECT ST_GeomFromText($1, 4326) AS geom  -- $1: 'LINESTRING(lng1 lat1, lng2 lat2, ...)'
)
SELECT 
    a.id,
    a.location,
    a.accident_date,
    a.severity,
    ST_Distance(
        ST_Transform(a.location, 3857), 
        ST_Transform(route_geom.geom, 3857)
    ) as distance_meters
FROM accidents a, route_geom
WHERE ST_DWithin(
    ST_Transform(a.location, 3857),
    ST_Transform(route_geom.geom, 3857),
    100
);
```

### パターン2: ST_Buffer関数でバッファ領域作成

#### バッファ作成アプローチ
```sql
-- ルート周辺100mのバッファを作成して検索
WITH route_buffer AS (
  SELECT ST_Buffer(
    ST_Transform(ST_GeomFromText($1, 4326), 3857),  -- WGS84からメートル系に変換
    100                                              -- 100mバッファ
  ) AS buffer_geom
)
SELECT 
    a.id,
    a.location,
    a.accident_date,
    a.severity
FROM accidents a, route_buffer
WHERE ST_Intersects(
    ST_Transform(a.location, 3857),
    route_buffer.buffer_geom
);
```

### パターン3: 地理座標系での直接計算（geography型使用）

#### Geography型アプローチ
```sql
-- Geography型で直接メートル計算
SELECT 
    a.id,
    a.location,
    a.accident_date,
    a.severity,
    ST_Distance(a.location::geography, route_line::geography) as distance_meters
FROM accidents a
WHERE ST_DWithin(
    a.location::geography,
    route_line::geography,
    100,                    -- メートル単位
    true                    -- 球体計算使用
)
ORDER BY distance_meters;
```

## 実装のベストプラクティス

### 1. インデックス戦略
```sql
-- 空間インデックスの作成
CREATE INDEX idx_accidents_location_gist ON accidents USING GIST (location);

-- 投影座標系用の関数インデックス
CREATE INDEX idx_accidents_location_3857 ON accidents USING GIST (ST_Transform(location, 3857));
```

### 2. パフォーマンス最適化
```sql
-- エクステンション有効化
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;

-- 統計情報更新
ANALYZE accidents;
```

### 3. 座標系選択指針
- **WGS84 (SRID: 4326)**: 入力データ形式
- **Web Mercator (SRID: 3857)**: 距離計算用（近似メートル）
- **UTM系**: 正確なメートル計算が必要な場合
- **Geography型**: 簡単な球面距離計算

### 4. プロジェクトとの統合考慮点

#### フロントエンドからのクエリパターン
```typescript
// 1. ルート座標配列をLINESTRINGに変換
const coordinates = extractRouteCoordinates(routeResponse);
const linestring = `LINESTRING(${coordinates.map(coord => coord.join(' ')).join(', ')})`;

// 2. API経由でPostGISクエリ実行
const nearbyAccidents = await fetch('/api/accidents/near-route', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    route: linestring,
    distance: 100  // メートル
  })
});
```

#### バックエンドAPI実装例
```typescript
// API Route Handler
export async function POST(request: Request) {
  const { route, distance } = await request.json();
  
  const query = `
    WITH route_geom AS (
      SELECT ST_GeomFromText($1, 4326) AS geom
    )
    SELECT 
        a.id,
        ST_X(a.location) as longitude,
        ST_Y(a.location) as latitude,
        a.accident_date,
        a.severity,
        ST_Distance(
            ST_Transform(a.location, 3857), 
            ST_Transform(route_geom.geom, 3857)
        ) as distance_meters
    FROM accidents a, route_geom
    WHERE ST_DWithin(
        ST_Transform(a.location, 3857),
        ST_Transform(route_geom.geom, 3857),
        $2
    )
    ORDER BY distance_meters
  `;
  
  const result = await db.query(query, [route, distance]);
  return Response.json(result.rows);
}
```

## 推奨実装方針

### 1. 基本アーキテクチャ
- **座標系**: WGS84 (4326) → Web Mercator (3857) 変換
- **検索手法**: `ST_DWithin` 関数による直接検索
- **インデックス**: GIST空間インデックス活用

### 2. 実装ステップ
1. **データベーススキーマ準備**
   - PostGIS拡張の有効化
   - 事故テーブルの空間インデックス作成
   
2. **API エンドポイント作成**
   - ルート座標を受け取るREST API
   - PostGISクエリの実行
   
3. **フロントエンド統合**
   - 既存のルート座標抽出機能活用
   - 事故データの地図表示

### 3. パフォーマンス考慮点
- **バッチ処理**: 複数ルートの一括検索対応
- **キャッシュ戦略**: 同一ルートの結果キャッシュ
- **距離制限**: 過度に長いルートの処理制限

## 次のステップ

1. **データベース設計**: 事故データテーブルのPostGIS対応
2. **API実装**: ルート周辺検索エンドポイントの作成
3. **フロントエンド統合**: 既存ルート表示機能との連携
4. **テスト実装**: パフォーマンステストとデータ検証

## 参考資料

- [PostGIS ST_DWithin Documentation](https://postgis.net/docs/ST_DWithin.html)
- [PostGIS ST_Buffer Documentation](https://postgis.net/docs/ST_Buffer.html)
- [AWS Location Service Routes API](https://docs.aws.amazon.com/location/latest/APIReference/API_CalculateRoutes.html)
- [FlexiblePolyline Documentation](https://github.com/heremaps/flexible-polyline)
- [AWS Location Utilities Datatypes](https://github.com/aws-geospatial/amazon-location-utilities-datatypes-js)