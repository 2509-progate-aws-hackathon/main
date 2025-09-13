import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useRef, useEffect, useState } from 'react';
import { useRouteCalculation } from '../hooks/useRouteCalculation';
import { useRouteVisualization } from '../hooks/useRouteVisualization';
import { useAccidentMarkers } from '../hooks/useAccidentMarkers';
import type { AccidentReport } from '../types/AccidentReport';

interface Point {
  lng: number;
  lat: number;
}

interface MapProps {
  className?: string;
  style?: React.CSSProperties;
  accidentReports?: AccidentReport[];
  onAccidentMarkerClick?: (report: AccidentReport) => void;
}

export default function Map({ 
  className, 
  style, 
  accidentReports = [], 
  onAccidentMarkerClick 
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [endPoint, setEndPoint] = useState<Point | null>(null);
  const startMarkerRef = useRef<maplibregl.Marker | null>(null);
  const endMarkerRef = useRef<maplibregl.Marker | null>(null);

  // ルート計算フックを使用
  const { result: routeResult, loading: routeLoading, error: routeError, calculateRoute } = useRouteCalculation();
  
  // ルート可視化フックを使用
  const { displayRoute, clearRoute, addRouteInteraction } = useRouteVisualization({
    map: mapInstanceRef.current
  });

  // 事故マーカー管理フックを使用
  const { getMarkerCount } = useAccidentMarkers({
    map: mapInstanceRef.current,
    reports: accidentReports,
    onMarkerClick: onAccidentMarkerClick
  });

  // マーカーとルートをリセットする関数
  const resetMarkers = () => {
    // マーカーを削除
    if (startMarkerRef.current) {
      startMarkerRef.current.remove();
      startMarkerRef.current = null;
    }
    if (endMarkerRef.current) {
      endMarkerRef.current.remove();
      endMarkerRef.current = null;
    }

    // ルートを削除
    clearRoute();

    // 状態をリセット
    setStartPoint(null);
    setEndPoint(null);
    
    console.log('マーカーとルートをリセットしました');
  };

  const region = process.env.NEXT_PUBLIC_AWS_REGION;
  const mapApiKey = process.env.NEXT_PUBLIC_MAP_API_KEY;
  const mapStyle = process.env.NEXT_PUBLIC_MAP_STYLE;

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapRef.current,
      style: `https://maps.geo.${region}.amazonaws.com/v2/styles/${mapStyle}/descriptor?key=${mapApiKey}`,
      center: [139.7166369797635, 35.63355477944539],
      zoom: 18,
    });

    mapInstanceRef.current = map;

    map.addControl(
      new maplibregl.NavigationControl({
        visualizePitch: true,
      })
    );

    // マップクリックイベントハンドラー
    const handleMapClick = (e: maplibregl.MapMouseEvent) => {
      const { lng, lat } = e.lngLat;
      
      setStartPoint(prevStart => {
        if (!prevStart) {
          // 最初のクリック: startPointを設定
          return { lng, lat };
        } else {
          setEndPoint(prevEnd => {
            if (!prevEnd) {
              // 二回目のクリック: endPointを設定
              return { lng, lat };
            }
            // 3回目以降のクリックは無視
            return prevEnd;
          });
          return prevStart;
        }
      });
    };

    map.on('click', handleMapClick);

    // クリーンアップ関数
    return () => {
      if (startMarkerRef.current) {
        startMarkerRef.current.remove();
      }
      if (endMarkerRef.current) {
        endMarkerRef.current.remove();
      }
      map.off('click', handleMapClick);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [region, mapApiKey, mapStyle]);

  // startPointマーカーの管理
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    
    // 既存マーカーを削除
    if (startMarkerRef.current) {
      startMarkerRef.current.remove();
    }

    // 新しいマーカーを作成
    // TODO: markerのデザインを改善
    if (startPoint) {
      const markerElement = document.createElement('div');
      markerElement.style.width = '20px';
      markerElement.style.height = '20px';
      markerElement.style.backgroundColor = 'red';
      markerElement.style.borderRadius = '50%';
      markerElement.style.border = '2px solid white';
      
      startMarkerRef.current = new maplibregl.Marker({ element: markerElement })
        .setLngLat([startPoint.lng, startPoint.lat])
        .addTo(mapInstanceRef.current);
    }
  }, [startPoint]);

  // endPointマーカーの管理
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    
    // 既存マーカーを削除
    if (endMarkerRef.current) {
      endMarkerRef.current.remove();
    }

    // 新しいマーカーを作成
    if (endPoint) {
      const markerElement = document.createElement('div');
      markerElement.style.width = '20px';
      markerElement.style.height = '20px';
      markerElement.style.backgroundColor = 'blue';
      markerElement.style.borderRadius = '50%';
      markerElement.style.border = '2px solid white';
      
      endMarkerRef.current = new maplibregl.Marker({ element: markerElement })
        .setLngLat([endPoint.lng, endPoint.lat])
        .addTo(mapInstanceRef.current);
    }
  }, [endPoint]);

  // startPointとendPointが両方設定されたときにルート計算を実行
  useEffect(() => {
    if (startPoint && endPoint) {
      calculateRoute(startPoint, endPoint);
    }
  }, [startPoint, endPoint, calculateRoute]);

  // ルート計算成功時に自動で可視化
  useEffect(() => {
    if (routeResult && routeResult.geometry && mapInstanceRef.current) {
      displayRoute(routeResult.geometry);
    }
  }, [routeResult, displayRoute]);

  // マップロード完了時にルートインタラクションを追加
  useEffect(() => {
    if (mapInstanceRef.current) {
      // マップがロードされたらルートインタラクションを設定
      const map = mapInstanceRef.current;
      map.on('load', () => {
        addRouteInteraction();
      });
      
      // 既にロード済みの場合は即座に設定
      if (map.isStyleLoaded()) {
        addRouteInteraction();
      }
    }
  }, [addRouteInteraction]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <div 
        ref={mapRef} 
        className={className}
        style={{ width: '100%', height: '100vh', ...style }}
      />
      
      {/* ルート情報表示パネル */}
      {(startPoint || endPoint || routeLoading || routeError || routeResult) && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          backgroundColor: 'white',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          minWidth: '250px',
          zIndex: 1000,
        }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 'bold' }}>
            ルート情報
          </h3>
          
          {/* 使用方法の説明 */}
          {!startPoint && !endPoint && (
            <div style={{ 
              backgroundColor: '#e3f2fd', 
              border: '1px solid #2196f3',
              padding: '8px', 
              borderRadius: '4px', 
              fontSize: '12px', 
              color: '#1976d2',
              marginBottom: '12px'
            }}>
              💡 地図を2回クリックして出発地と目的地を設定
            </div>
          )}
          
          <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
            <div style={{ marginBottom: '8px' }}>
              出発地: {startPoint ? '設定済み' : '地図をクリックして選択'}
            </div>
            <div style={{ marginBottom: '12px' }}>
              目的地: {endPoint ? '設定済み' : '地図をクリックして選択'}
            </div>

            {/* リセットボタン */}
            {(startPoint || endPoint) && (
              <div style={{ marginBottom: '12px' }}>
                <button
                  onClick={resetMarkers}
                  style={{
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px 12px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d32f2f'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f44336'}
                >
                  🗑️ マーカーをリセット
                </button>
              </div>
            )}
            
            {routeLoading && (
              <div style={{ color: '#666', fontStyle: 'italic' }}>
                ルート計算中...
              </div>
            )}
            
            {routeError && (
              <div style={{ color: '#d32f2f', fontSize: '13px' }}>
                エラー: {routeError}
              </div>
            )}
            
            {routeResult && (
              <div style={{ borderTop: '1px solid #eee', paddingTop: '12px' }}>
                <div style={{ marginBottom: '4px' }}>
                  <strong>距離:</strong> {(routeResult.distance / 1000).toFixed(2)} km
                </div>
                <div>
                  <strong>所要時間:</strong> {Math.round(routeResult.duration / 60)} 分
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}