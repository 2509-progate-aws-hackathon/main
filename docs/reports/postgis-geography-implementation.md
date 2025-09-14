# PostGIS Geography カラム実装調査レポート

## 概要
PostGISを使用して、既存のlocationとlatitudeカラムを統合したgeographyカラムを作成し、Amplify Gen2のスキーマに反映する方法を調査しました。

## 調査結果

### 1. PostGIS Geographyカラムについて

#### Geography型の特徴
- 地理座標系（緯度経度）での計算に最適化
- WGS84座標系（SRID 4326）をデフォルトで使用
- 実際の地球の曲面を考慮した距離・面積計算が可能
- Pointタイプを使用して緯度経度を1つのカラムに格納

#### 基本的な使用方法
```sql
-- PostGISエクステンションの有効化
CREATE EXTENSION IF NOT EXISTS postgis;

-- テーブル作成時の例
CREATE TABLE accident_reports (
    id SERIAL PRIMARY KEY,
    location TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    geolocation GEOGRAPHY(POINT, 4326)  -- 新しいgeographyカラム
);

-- 既存の緯度経度からgeographyカラムを生成
UPDATE accident_reports 
SET geolocation = ST_Point(longitude, latitude)::geography
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- 空間インデックスの作成（性能向上）
CREATE INDEX idx_accident_reports_geolocation 
ON accident_reports USING GIST (geolocation);
```

### 2. Aurora PostgreSQLでのPostGIS対応状況

#### サポート状況
- Aurora PostgreSQL 16.6ではPostGIS 3.4.0がサポート済み
- PostGISエクステンションは標準で利用可能
- Geography型とGeometry型の両方をサポート
- 空間インデックス（GiST、SP-GiST）も利用可能

### 3. Amplify Gen2スキーマでの実装方法

#### 問題点と制約
1. **Amplify Gen2の型制限**: 現在のAmplify Gen2では、PostGISのGEOGRAPHY型を直接サポートしていない
2. **GraphQLスキーマの制限**: GraphQLの標準型にはgeography型が存在しない
3. **カスタム型の制限**: Amplifyの`a.model()`では限られた型のみサポート

#### 解決方法の選択肢

##### 選択肢1: カスタムスカラー型の定義（推奨）
```typescript
// amplify/data/resource.ts
const schema = a.schema({
  AccidentReport: a.model({
    // 既存フィールドは維持
    location: a.string(),
    latitude: a.float(),
    longitude: a.float(),
    
    // WKT（Well-Known Text）形式でGeographyを文字列として格納
    geolocation: a.string(), // 例: "POINT(-122.4194 37.7749)"
    
    // その他のフィールド...
  })
});
```

##### 選択肢2: データベースビューの使用
```sql
-- データベース側でビューを作成し、geography計算を隠蔽
CREATE VIEW accident_reports_with_geography AS
SELECT *,
       ST_Point(longitude, latitude)::geography AS geolocation,
       ST_AsText(ST_Point(longitude, latitude)::geography) AS geolocation_wkt
FROM accident_reports;
```

##### 選択肢3: Lambda リゾルバーでの変換
```typescript
// Lambda関数内でgeography型を扱い、GraphQL側では文字列として返却
const handler = async (event) => {
  // データベースクエリでgeography型を処理
  const result = await executeSQL(`
    SELECT ST_AsText(geolocation) as geolocation_wkt,
           ST_X(geolocation::geometry) as longitude,
           ST_Y(geolocation::geometry) as latitude
    FROM accident_reports 
    WHERE ST_DWithin(geolocation, ST_Point($1, $2)::geography, $3)
  `, [centerLng, centerLat, radiusMeters]);
  
  return result;
};
```

### 4. 実装推奨アプローチ

#### フェーズ1: データベース側の準備
1. PostGISエクステンションの有効化
2. 既存テーブルにgeographyカラム追加
3. 既存データからgeography値を生成
4. 空間インデックスの作成

#### フェーズ2: Amplifyスキーマの更新
```typescript
const schema = a.schema({
  AccidentReport: a.model({
    // 基本情報
    occurrenceDateTime: a.datetime().required(),
    weather: a.string(),
    location: a.string(),
    latitude: a.float(),
    longitude: a.float(),
    
    // Geography情報（WKT形式）
    geolocation: a.string(), // "POINT(longitude latitude)" 形式
    
    // 空間検索用の計算フィールド（必要に応じて）
    distanceFromCenter: a.float(), // 中心点からの距離（メートル）
    
    // その他のフィールド...
  }).authorization((allow) => [allow.guest()])
});
```

#### フェーズ3: Lambda関数での空間クエリ実装
```typescript
// 範囲検索の例
export const searchNearbyAccidents = async (centerLat, centerLng, radiusKm) => {
  const sql = `
    SELECT *,
           ST_AsText(geolocation) as geolocation_wkt,
           ST_Distance(geolocation, ST_Point($2, $1)::geography) as distance_meters
    FROM accident_reports 
    WHERE ST_DWithin(geolocation, ST_Point($2, $1)::geography, $3 * 1000)
    ORDER BY distance_meters
  `;
  
  return await executeSQL(sql, [centerLat, centerLng, radiusKm]);
};
```

### 5. 利点と注意点

#### 利点
- 高精度な地理空間クエリが可能
- 距離計算、範囲検索、最近傍検索が効率的
- 既存のlatitude/longitudeデータを活用可能
- 空間インデックスによる高速検索

#### 注意点
- GraphQLスキーマでは文字列として扱う必要がある
- フロントエンド側でWKT形式の解析が必要
- 複雑な空間クエリはLambda関数で実装する必要

## 次のアクション

1. データベース側でPostGISエクステンション有効化
2. 既存テーブルへのgeographyカラム追加
3. Amplifyスキーマの更新（geolocation文字列フィールド追加）
4. 空間検索用Lambda関数の実装

この方法により、PostGISの強力な地理空間機能を活用しながら、Amplify Gen2の制約内で実装が可能です。