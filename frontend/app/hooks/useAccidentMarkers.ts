import { useCallback, useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import type { AccidentReport } from '../types/AccidentReport';

interface UseAccidentMarkersProps {
  map: maplibregl.Map | null;
  reports: AccidentReport[];
  onMarkerClick?: (report: AccidentReport) => void;
}

interface AccidentMarkerRef {
  marker: maplibregl.Marker;
  report: AccidentReport;
}

// 事故種別による色設定
const getMarkerColor = (report: AccidentReport): string => {
  const { accidentTypeCategory, damageLevel, numberOfDeaths, numberOfSeriousInjuries } = report;
  
  // 死亡事故は黒
  if ((numberOfDeaths || 0) > 0) {
    return '#000000';
  }
  
  // 重傷事故は赤
  if ((numberOfSeriousInjuries || 0) > 0) {
    return '#ff0000';
  }
  
  // 損害レベルによる色分け
  switch (damageLevel) {
    case '重大':
      return '#ff4444';
    case '中程度':
      return '#ff8800';
    case '軽微':
      return '#ffcc00';
    default:
      break;
  }
  
  // 事故種別による色分け
  switch (accidentTypeCategory) {
    case '追突':
      return '#ff6b6b';
    case '出会い頭':
      return '#4ecdc4';
    case '右折時':
      return '#45b7d1';
    case '左折時':
      return '#96ceb4';
    case '横断中':
      return '#feca57';
    case '単独':
      return '#ff9ff3';
    case 'その他':
    default:
      return '#74b9ff';
  }
};

// マーカーサイズ設定
const getMarkerSize = (report: AccidentReport): number => {
  const { numberOfDeaths, numberOfSeriousInjuries, numberOfMinorInjuries } = report;
  
  const totalInjuries = (numberOfDeaths || 0) + (numberOfSeriousInjuries || 0) + (numberOfMinorInjuries || 0);
  
  if (totalInjuries >= 5) return 16;
  if (totalInjuries >= 3) return 14;
  if (totalInjuries >= 1) return 12;
  return 10;
};

// マーカーエレメント作成
const createMarkerElement = (report: AccidentReport): HTMLElement => {
  const element = document.createElement('div');
  const color = getMarkerColor(report);
  const size = getMarkerSize(report);
  
  element.className = 'accident-report-marker';
  element.style.width = `${size}px`;
  element.style.height = `${size}px`;
  element.style.backgroundColor = color;
  element.style.borderRadius = '50%';
  element.style.border = '2px solid white';
  element.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
  element.style.cursor = 'pointer';
  element.style.zIndex = '1000';
  
  // ツールチップ設定
  element.title = `${report.title || '事故情報'}\n場所: ${report.location || '不明'}\n種別: ${report.accidentTypeCategory || 'その他'}`;
  
  return element;
};

export function useAccidentMarkers({ map, reports, onMarkerClick }: UseAccidentMarkersProps) {
  const markersRef = useRef<AccidentMarkerRef[]>([]);

  // 既存マーカーをすべて削除
  const clearMarkers = useCallback(() => {
    markersRef.current.forEach(({ marker }) => {
      marker.remove();
    });
    markersRef.current = [];
  }, []);

  // マーカーを追加
  const addMarker = useCallback((report: AccidentReport) => {
    if (!map || !report.latitude || !report.longitude) return null;

    const element = createMarkerElement(report);
    
    const marker = new maplibregl.Marker({ element })
      .setLngLat([report.longitude, report.latitude])
      .addTo(map);

    // クリックイベント
    element.addEventListener('click', (e) => {
      e.stopPropagation();
      onMarkerClick?.(report);
    });

    const markerRef: AccidentMarkerRef = { marker, report };
    markersRef.current.push(markerRef);
    
    return markerRef;
  }, [map, onMarkerClick]);

  // 複数マーカーを一括追加
  const addMarkers = useCallback((reportsToAdd: AccidentReport[]) => {
    clearMarkers();
    
    const validReports = reportsToAdd.filter(report => 
      report.latitude && report.longitude
    );

    console.log(`🗺️ ${validReports.length}件の事故マーカーを地図に追加`);
    
    validReports.forEach(report => {
      addMarker(report);
    });

    // 全マーカーが表示されるように地図の範囲を調整
    if (validReports.length > 0 && map) {
      const bounds = new maplibregl.LngLatBounds();
      validReports.forEach(report => {
        if (report.latitude && report.longitude) {
          bounds.extend([report.longitude, report.latitude]);
        }
      });
      
      map.fitBounds(bounds, { 
        padding: 50,
        maxZoom: 15
      });
    }
  }, [map, addMarker, clearMarkers]);

  // 特定のマーカーを削除
  const removeMarker = useCallback((reportId: string) => {
    const markerIndex = markersRef.current.findIndex(({ report }) => report.id === reportId);
    if (markerIndex >= 0) {
      markersRef.current[markerIndex].marker.remove();
      markersRef.current.splice(markerIndex, 1);
    }
  }, []);

  // マーカー数を取得
  const getMarkerCount = useCallback(() => {
    return markersRef.current.length;
  }, []);

  // reportsが変更されたときにマーカーを更新
  useEffect(() => {
    if (map && reports.length > 0) {
      addMarkers(reports);
    } else {
      clearMarkers();
    }
  }, [map, reports, addMarkers, clearMarkers]);

  // コンポーネントアンマウント時にクリーンアップ
  useEffect(() => {
    return () => {
      clearMarkers();
    };
  }, [clearMarkers]);

  return {
    addMarker,
    addMarkers,
    removeMarker,
    clearMarkers,
    getMarkerCount,
    markers: markersRef.current
  };
}