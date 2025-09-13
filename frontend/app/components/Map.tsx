import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useRef, useEffect, useState } from 'react';
import { useRouteCalculation } from '../hooks/useRouteCalculation';

interface Point {
  lng: number;
  lat: number;
}

interface MapProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function Map({ className, style }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [endPoint, setEndPoint] = useState<Point | null>(null);
  const startMarkerRef = useRef<maplibregl.Marker | null>(null);
  const endMarkerRef = useRef<maplibregl.Marker | null>(null);

  // ルート計算フックを使用
  const { result: routeResult, loading: routeLoading, error: routeError, calculateRoute } = useRouteCalculation();

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
          
          <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
            <div style={{ marginBottom: '8px' }}>
              出発地: {startPoint ? '設定済み ✓' : '地図をクリックして選択'}
            </div>
            <div style={{ marginBottom: '12px' }}>
              目的地: {endPoint ? '設定済み ✓' : '地図をクリックして選択'}
            </div>
            
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