import { useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import { calculateRoutesResponseToFeatureCollections } from '@aws/amazon-location-utilities-datatypes';
import { decode } from '@here/flexpolyline';
import type { CalculateRoutesResponse } from '@aws-sdk/client-geo-routes';

interface UseRouteVisualizationProps {
  map: maplibregl.Map | null;
}

export function useRouteVisualization({ map }: UseRouteVisualizationProps) {
  // AWS Geo RoutesレスポンスからGeoJSON座標を抽出
  const extractRouteCoordinates = useCallback((routeResponse: CalculateRoutesResponse): number[][] => {
    try {
      // 方法1: AWS公式ライブラリでFeatureCollectionに変換を試行
      try {
        const featureCollections = calculateRoutesResponseToFeatureCollections(routeResponse, {
          flattenProperties: true,
          includeLegs: true,           // ルート区間を含む
          includeSpans: false,         // 詳細区間は除外
          includeTravelStepGeometry: false,
          includeTravelStepStartPositions: false,
          includeLegArrivalDeparturePositions: false
        });

        const coordinates: number[][] = [];
        
        // 最初のルートのFeatureCollectionを使用
        if (featureCollections && featureCollections.length > 0) {
          const featureCollection = featureCollections[0];
          
          // Legタイプ（LineString）のフィーチャーから座標を抽出
          featureCollection.features.forEach(feature => {
            if (feature.properties?.FeatureType === 'Leg' && 
                feature.geometry.type === 'LineString') {
              coordinates.push(...feature.geometry.coordinates);
            }
          });
        }
        
        if (coordinates.length > 0) {
          console.log('AWS公式ライブラリで座標抽出成功:', coordinates.length, '座標');
          console.log('座標サンプル:', coordinates.slice(0, 3)); // 最初の3座標をログ出力
          return coordinates;
        }
      } catch (awsLibraryError) {
        console.warn('AWS公式ライブラリでの変換に失敗、FlexiblePolyline直接デコードを試行:', awsLibraryError);
      }

      // 方法2: FlexiblePolylineを直接デコード（フォールバック）
      const coordinates: number[][] = [];
      
      if (routeResponse.Routes && routeResponse.Routes[0]?.Legs) {
        routeResponse.Routes[0].Legs.forEach(leg => {
          if (leg.Geometry?.Polyline) {
            try {
              // FlexiblePolylineをデコード
              const decoded = decode(leg.Geometry.Polyline);
              console.log('FlexiblePolylineデコード成功:', decoded.polyline.length, '座標');
              
              // [lat, lng] → [lng, lat]の順序で変換
              const legCoordinates = decoded.polyline.map(point => [point[1], point[0]]);
              coordinates.push(...legCoordinates);
            } catch (decodeError) {
              console.error('FlexiblePolylineデコード失敗:', decodeError);
            }
          }
        });
      }
      
      return coordinates;
    } catch (error) {
      console.error('座標抽出でエラーが発生:', error);
      return [];
    }
  }, []);

  // ルートを地図上に描画
  const displayRoute = useCallback((routeResponse: CalculateRoutesResponse) => {
    if (!map) return;

    const rawCoordinates = extractRouteCoordinates(routeResponse);
    
    if (rawCoordinates.length === 0) {
      console.warn('ルート座標が見つかりません');
      return;
    }

    // 座標データの検証とクリーニング
    const coordinates = rawCoordinates.filter(coord => {
      // 座標が配列で、2つの数値を持っているかチェック
      if (!Array.isArray(coord) || coord.length !== 2) {
        console.warn('無効な座標形式をスキップ:', coord);
        return false;
      }
      
      const [lng, lat] = coord;
      
      // 数値かつ有効な範囲内かチェック
      if (typeof lng !== 'number' || typeof lat !== 'number' ||
          isNaN(lng) || isNaN(lat) ||
          lng < -180 || lng > 180 || lat < -90 || lat > 90) {
        console.warn('無効な座標値をスキップ:', coord);
        return false;
      }
      
      return true;
    });

    console.log('検証後の座標数:', coordinates.length, '/ 元の座標数:', rawCoordinates.length);
    
    if (coordinates.length === 0) {
      console.error('有効な座標が見つかりません');
      return;
    }

    // 既存のルートレイヤーとソースを削除
    if (map.getLayer('route-line')) {
      map.removeLayer('route-line');
    }
    if (map.getSource('route')) {
      map.removeSource('route');
    }

    // ルートデータソースを追加
    map.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: coordinates
        }
      }
    });

    // ルートレイヤーを追加（最下層に配置）
    map.addLayer({
      id: 'route-line',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#3887be',
        'line-width': 8,
        'line-opacity': 0.8,
      }
    });

    // ルート全体が見えるようにマップを調整
    const bounds = new maplibregl.LngLatBounds();
    coordinates.forEach(coord => bounds.extend(coord as [number, number]));
    
    map.fitBounds(bounds, { 
      padding: 50,
      duration: 1000 // アニメーション時間
    });

    // マーカーを最前面に表示
    setTimeout(() => {
      if (!map) return;
      try {
        const mapContainer = map.getContainer();
        const markerElements = mapContainer.querySelectorAll('.maplibregl-marker');
        
        markerElements.forEach(marker => {
          (marker as HTMLElement).style.zIndex = '1000';
        });
        
        console.log('マーカーを最前面に移動:', markerElements.length, '個');
      } catch (error) {
        console.warn('マーカー前面移動でエラー:', error);
      }
    }, 100); // 少し遅延させてレイヤー描画完了後に実行

  }, [map, extractRouteCoordinates]);

  // マーカーを最前面に移動（シンプル版）
  const bringMarkersToFront = useCallback(() => {
    if (!map) return;

    try {
      // マーカー要素をDOM上で最前面に移動
      const mapContainer = map.getContainer();
      const markerElements = mapContainer.querySelectorAll('.maplibregl-marker');
      
      console.log('マーカーを最前面に移動:', markerElements.length, '個');
    } catch (error) {
      console.warn('マーカー前面移動でエラー:', error);
    }
  }, [map]);

  // ルートを削除
  const clearRoute = useCallback(() => {
    if (!map) return;

    if (map.getLayer('route-line')) {
      map.removeLayer('route-line');
    }
    if (map.getSource('route')) {
      map.removeSource('route');
    }
  }, [map]);

  // ルートラインにホバー効果を追加
  const addRouteInteraction = useCallback(() => {
    if (!map) return;

    // ホバー時にカーソル変更
    map.on('mouseenter', 'route-line', () => {
      map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'route-line', () => {
      map.getCanvas().style.cursor = '';
    });

    // クリック時のポップアップ表示（将来の拡張用）
    map.on('click', 'route-line', (e) => {
      // 将来的にルート詳細を表示する機能を追加可能
      console.log('Route clicked at:', e.lngLat);
    });
  }, [map]);

  return {
    displayRoute,
    clearRoute,
    addRouteInteraction,
    extractRouteCoordinates,
    bringMarkersToFront
  };
}