import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useRef, useEffect, useState } from 'react';
import { useRouteCalculation } from '../hooks/useRouteCalculation';
import { useRouteVisualization } from '../hooks/useRouteVisualization';
import { useAccidentMarkers } from '../hooks/useAccidentMarkers';
import { useSimulationProcess } from '../hooks/useSimulationProcess';
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
  
  // シミュレーション処理フックを使用
  const { 
    currentStage, 
    isRunning: simulationRunning, 
    error: simulationError, 
    routeResult: simulationRouteResult,
    startSimulation,
    resetSimulation 
  } = useSimulationProcess();
  
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

  // 自動ルート計算を無効化（手動でシミュレーション開始するため）
  // useEffect(() => {
  //   if (startPoint && endPoint) {
  //     calculateRoute(startPoint, endPoint);
  //   }
  // }, [startPoint, endPoint, calculateRoute]);

  // シミュレーション完了時にルートを可視化
  useEffect(() => {
    if (simulationRouteResult && simulationRouteResult.geometry && mapInstanceRef.current) {
      displayRoute(simulationRouteResult.geometry);
    }
  }, [simulationRouteResult, displayRoute]);

  // 通常のルート計算成功時の可視化（シミュレーション外）
  useEffect(() => {
    if (routeResult && routeResult.geometry && mapInstanceRef.current && currentStage === 'idle') {
      displayRoute(routeResult.geometry);
    }
  }, [routeResult, displayRoute, currentStage]);

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
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
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

            {/* シミュレーション開始ボタン */}
            {startPoint && endPoint && !simulationRunning && currentStage === 'idle' && (
              <div style={{ marginBottom: '12px' }}>
                <button
                  onClick={() => startSimulation(startPoint, endPoint)}
                  style={{
                    backgroundColor: '#2196f3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '12px 16px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    width: '100%'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1976d2'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2196f3'}
                >
                  🚀 シミュレーション開始
                </button>
              </div>
            )}

            {/* リセットボタン */}
            {(startPoint || endPoint) && (
              <div style={{ marginBottom: '12px' }}>
                <button
                  onClick={() => {
                    resetMarkers();
                    resetSimulation();
                  }}
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

            {/* シミュレーション段階表示 */}
            {simulationRunning && (
              <div style={{ 
                borderTop: '1px solid #eee', 
                paddingTop: '12px',
                marginBottom: '12px' 
              }}>
                <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
                  処理状況
                </div>
                
                {/* 段階1: ルート検索 */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '6px',
                  fontSize: '13px'
                }}>
                  {currentStage === 'searching-route' ? (
                    <div style={{ 
                      width: '16px', 
                      height: '16px', 
                      border: '2px solid #2196f3',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      marginRight: '8px'
                    }} />
                  ) : (
                    <span style={{ 
                      color: currentStage !== 'idle' ? '#4caf50' : '#ccc',
                      marginRight: '8px',
                      fontSize: '14px'
                    }}>
                      {currentStage !== 'idle' ? '✓' : '○'}
                    </span>
                  )}
                  <span style={{ 
                    color: currentStage === 'searching-route' ? '#2196f3' : 
                          (currentStage !== 'idle' ? '#4caf50' : '#666')
                  }}>
                    1. ルートを検索中...
                  </span>
                </div>

                {/* 段階2: 事故情報検索 */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '6px',
                  fontSize: '13px'
                }}>
                  {currentStage === 'searching-accidents' ? (
                    <div style={{ 
                      width: '16px', 
                      height: '16px', 
                      border: '2px solid #ff9800',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      marginRight: '8px'
                    }} />
                  ) : (
                    <span style={{ 
                      color: ['simulating', 'completed'].includes(currentStage) ? '#4caf50' : '#ccc',
                      marginRight: '8px',
                      fontSize: '14px'
                    }}>
                      {['simulating', 'completed'].includes(currentStage) ? '✓' : '○'}
                    </span>
                  )}
                  <span style={{ 
                    color: currentStage === 'searching-accidents' ? '#ff9800' : 
                          (['simulating', 'completed'].includes(currentStage) ? '#4caf50' : '#666')
                  }}>
                    2. 付近の事故情報を検索中...
                  </span>
                </div>

                {/* 段階3: シミュレーション */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '6px',
                  fontSize: '13px'
                }}>
                  {currentStage === 'simulating' ? (
                    <div style={{ 
                      width: '16px', 
                      height: '16px', 
                      border: '2px solid #9c27b0',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      marginRight: '8px'
                    }} />
                  ) : (
                    <span style={{ 
                      color: currentStage === 'completed' ? '#4caf50' : '#ccc',
                      marginRight: '8px',
                      fontSize: '14px'
                    }}>
                      {currentStage === 'completed' ? '✓' : '○'}
                    </span>
                  )}
                  <span style={{ 
                    color: currentStage === 'simulating' ? '#9c27b0' : 
                          (currentStage === 'completed' ? '#4caf50' : '#666')
                  }}>
                    3. シミュレーション中...
                  </span>
                </div>
              </div>
            )}
            
            {routeLoading && !simulationRunning && (
              <div style={{ color: '#666', fontStyle: 'italic' }}>
                ルート計算中...
              </div>
            )}
            
            {(routeError || simulationError) && (
              <div style={{ color: '#d32f2f', fontSize: '13px' }}>
                エラー: {simulationError || routeError}
              </div>
            )}
            
            {(routeResult || simulationRouteResult) && currentStage === 'completed' && (
              <div style={{ borderTop: '1px solid #eee', paddingTop: '12px' }}>
                <div style={{ marginBottom: '4px' }}>
                  <strong>距離:</strong> {((simulationRouteResult || routeResult)?.distance / 1000).toFixed(2)} km
                </div>
                <div>
                  <strong>所要時間:</strong> {Math.round(((simulationRouteResult || routeResult)?.duration || 0) / 60)} 分
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}