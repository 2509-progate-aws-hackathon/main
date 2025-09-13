import { useCallback, useRef, useEffect, useState } from 'react';
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

// ツールチップ作成
const createTooltip = (report: AccidentReport, map: maplibregl.Map): HTMLElement => {
  const tooltip = document.createElement('div');
  tooltip.className = 'accident-tooltip';
  tooltip.style.position = 'absolute';
  tooltip.style.top = '20px';
  tooltip.style.left = '50%';
  tooltip.style.transform = 'translateX(-50%)';
  tooltip.style.backgroundColor = 'white';
  tooltip.style.border = '2px solid #333';
  tooltip.style.borderRadius = '8px';
  tooltip.style.padding = '12px';
  tooltip.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
  tooltip.style.zIndex = '10000';
  tooltip.style.minWidth = '200px';
  tooltip.style.maxWidth = '300px';
  tooltip.style.fontSize = '14px';
  tooltip.style.lineHeight = '1.4';
  
  tooltip.innerHTML = `
    <div style="font-weight: bold; margin-bottom: 8px; color: #333;">
      ${report.title || '事故情報'}
    </div>
    <div style="margin-bottom: 4px;">
      <strong>場所:</strong> ${report.location || '不明'}
    </div>
    <div style="margin-bottom: 4px;">
      <strong>種別:</strong> ${report.accidentTypeCategory || 'その他'}
    </div>
    <div style="margin-bottom: 4px;">
      <strong>天候:</strong> ${report.weather || '不明'}
    </div>
    <div style="margin-bottom: 8px;">
      <strong>日時:</strong> ${new Date(report.occurrenceDateTime).toLocaleDateString('ja-JP')}
    </div>
    <div style="text-align: center;">
      <button style="
        background: #f44336; 
        color: white; 
        border: none; 
        padding: 4px 8px; 
        border-radius: 4px; 
        cursor: pointer;
        font-size: 12px;
      ">閉じる</button>
    </div>
  `;
  
  // 閉じるボタンのクリックイベント
  const closeBtn = tooltip.querySelector('button');
  closeBtn?.addEventListener('click', () => {
    tooltip.remove();
  });
  
  // マップ外クリックで閉じる
  const closeOnMapClick = (e: any) => {
    if (!tooltip.contains(e.target)) {
      tooltip.remove();
      map.off('click', closeOnMapClick);
    }
  };
  
  setTimeout(() => {
    map.on('click', closeOnMapClick);
  }, 100);
  
  return tooltip;
};

// 事故種別による色設定
const getMarkerColor = (report: AccidentReport): string => {
  return "#ff0000"
};

// マーカーサイズ設定
const getMarkerSize = (report: AccidentReport): number => {
  return 25;
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
      
      // 既存のツールチップを削除
      const existingTooltips = map.getContainer().querySelectorAll('.accident-tooltip');
      existingTooltips.forEach(tooltip => tooltip.remove());
      
      // 新しいツールチップを表示
      const tooltip = createTooltip(report, map);
      map.getContainer().appendChild(tooltip);
      
      // 元のコールバックも実行
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