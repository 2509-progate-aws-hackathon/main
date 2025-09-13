'use client';

// 事故レポートフィルタリングコンポーネント
// 日付範囲、事故種別、地域での基本的なフィルタリングUI

import React, { useState } from 'react';
import type { AccidentReportFilter } from '../../types/AccidentReport';
import { 
  ACCIDENT_CATEGORIES, 
  WEATHER_CONDITIONS, 
  DAMAGE_LEVELS, 
  ROAD_TYPES 
} from '../../types/AccidentReport';

interface AccidentReportFilterProps {
  filter: AccidentReportFilter;
  onFilterChange: (filter: Partial<AccidentReportFilter>) => void;
  onReset: () => void;
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
}

export default function AccidentReportFilter({
  filter,
  onFilterChange,
  onReset,
  isExpanded = false,
  onToggleExpanded
}: AccidentReportFilterProps) {
  const [localFilter, setLocalFilter] = useState<AccidentReportFilter>(filter);

  // ローカル状態更新
  const updateLocalFilter = (updates: Partial<AccidentReportFilter>) => {
    const newFilter = { ...localFilter, ...updates };
    setLocalFilter(newFilter);
    onFilterChange(updates);
  };

  // 日付フィルター
  const handleDateChange = (type: 'startDate' | 'endDate', value: string) => {
    updateLocalFilter({ [type]: value || undefined });
  };

  // 選択フィルター
  const handleSelectChange = (key: keyof AccidentReportFilter, value: string) => {
    updateLocalFilter({ [key]: value || undefined });
  };

  // チェックボックスフィルター
  const handleCheckboxChange = (key: keyof AccidentReportFilter, checked: boolean) => {
    updateLocalFilter({ [key]: checked || undefined });
  };

  // 地理的範囲フィルター
  const handleLocationRangeChange = (key: keyof AccidentReportFilter, value: string) => {
    const numValue = value ? parseFloat(value) : undefined;
    updateLocalFilter({ [key]: numValue });
  };

  // フィルターリセット
  const handleReset = () => {
    setLocalFilter({});
    onReset();
  };

  // アクティブなフィルター数をカウント
  const activeFilterCount = Object.values(filter).filter(v => v !== undefined && v !== '').length;

  return (
    <div className="bg-white rounded-lg shadow">
      {/* ヘッダー */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-gray-900">フィルター</h3>
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {activeFilterCount}個適用中
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {activeFilterCount > 0 && (
              <button
                onClick={handleReset}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                すべてリセット
              </button>
            )}
            {onToggleExpanded && (
              <button
                onClick={onToggleExpanded}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <svg 
                  className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* フィルター内容 */}
      <div className={`px-6 py-4 ${!isExpanded && onToggleExpanded ? 'hidden' : ''}`}>
        <div className="space-y-6">
          {/* 日付範囲 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">発生日時</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-xs text-gray-600 mb-1">開始日</label>
                <input
                  id="startDate"
                  type="date"
                  value={localFilter.startDate || ''}
                  onChange={(e) => handleDateChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-xs text-gray-600 mb-1">終了日</label>
                <input
                  id="endDate"
                  type="date"
                  value={localFilter.endDate || ''}
                  onChange={(e) => handleDateChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* 基本フィルター */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 事故種別 */}
            <div>
              <label htmlFor="accidentType" className="block text-sm font-medium text-gray-700 mb-1">
                事故種別
              </label>
              <select
                id="accidentType"
                value={localFilter.accidentTypeCategory || ''}
                onChange={(e) => handleSelectChange('accidentTypeCategory', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">すべて</option>
                {ACCIDENT_CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* 天候 */}
            <div>
              <label htmlFor="weather" className="block text-sm font-medium text-gray-700 mb-1">
                天候
              </label>
              <select
                id="weather"
                value={localFilter.weather || ''}
                onChange={(e) => handleSelectChange('weather', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">すべて</option>
                {WEATHER_CONDITIONS.map(weather => (
                  <option key={weather} value={weather}>{weather}</option>
                ))}
              </select>
            </div>

            {/* 損害レベル */}
            <div>
              <label htmlFor="damageLevel" className="block text-sm font-medium text-gray-700 mb-1">
                損害レベル
              </label>
              <select
                id="damageLevel"
                value={localFilter.damageLevel || ''}
                onChange={(e) => handleSelectChange('damageLevel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">すべて</option>
                {DAMAGE_LEVELS.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            {/* 道路種別 */}
            <div>
              <label htmlFor="roadType" className="block text-sm font-medium text-gray-700 mb-1">
                道路種別
              </label>
              <select
                id="roadType"
                value={localFilter.roadType || ''}
                onChange={(e) => handleSelectChange('roadType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">すべて</option>
                {ROAD_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 地理的範囲フィルター */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">地理的範囲</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="minLat" className="block text-xs text-gray-600 mb-1">最小緯度</label>
                <input
                  id="minLat"
                  type="number"
                  step="0.000001"
                  placeholder="35.000000"
                  value={localFilter.minLatitude || ''}
                  onChange={(e) => handleLocationRangeChange('minLatitude', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label htmlFor="maxLat" className="block text-xs text-gray-600 mb-1">最大緯度</label>
                <input
                  id="maxLat"
                  type="number"
                  step="0.000001"
                  placeholder="36.000000"
                  value={localFilter.maxLatitude || ''}
                  onChange={(e) => handleLocationRangeChange('maxLatitude', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label htmlFor="minLng" className="block text-xs text-gray-600 mb-1">最小経度</label>
                <input
                  id="minLng"
                  type="number"
                  step="0.000001"
                  placeholder="139.000000"
                  value={localFilter.minLongitude || ''}
                  onChange={(e) => handleLocationRangeChange('minLongitude', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label htmlFor="maxLng" className="block text-xs text-gray-600 mb-1">最大経度</label>
                <input
                  id="maxLng"
                  type="number"
                  step="0.000001"
                  placeholder="140.000000"
                  value={localFilter.maxLongitude || ''}
                  onChange={(e) => handleLocationRangeChange('maxLongitude', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* 車両フィルター */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">車両情報</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="vehicleType" className="block text-xs text-gray-600 mb-1">車両タイプ</label>
                <select
                  id="vehicleType"
                  value={localFilter.vehicle1ModelType || ''}
                  onChange={(e) => handleSelectChange('vehicle1ModelType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="">すべて</option>
                  <option value="乗用車">乗用車</option>
                  <option value="貨物車">貨物車</option>
                  <option value="バス">バス</option>
                  <option value="二輪車">二輪車</option>
                </select>
              </div>
              <div>
                <label htmlFor="bodyType" className="block text-xs text-gray-600 mb-1">車体形状</label>
                <select
                  id="bodyType"
                  value={localFilter.vehicle1BodyType || ''}
                  onChange={(e) => handleSelectChange('vehicle1BodyType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="">すべて</option>
                  <option value="セダン">セダン</option>
                  <option value="ハッチバック">ハッチバック</option>
                  <option value="SUV">SUV</option>
                  <option value="ミニバン">ミニバン</option>
                  <option value="トラック">トラック</option>
                </select>
              </div>
            </div>
          </div>

          {/* 被害フィルター */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">被害状況</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={localFilter.hasDeaths || false}
                  onChange={(e) => handleCheckboxChange('hasDeaths', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">死亡事故のみ</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={localFilter.hasSeriousInjuries || false}
                  onChange={(e) => handleCheckboxChange('hasSeriousInjuries', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">重傷事故を含む</span>
              </label>
            </div>
          </div>

          {/* 場所フィルター */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              場所（部分一致）
            </label>
            <input
              id="location"
              type="text"
              placeholder="都道府県、市区町村、住所など"
              value={localFilter.location || ''}
              onChange={(e) => handleSelectChange('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>
      </div>

      {/* フッター（簡潔表示時） */}
      {!isExpanded && onToggleExpanded && activeFilterCount > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{activeFilterCount}個のフィルターが適用されています</span>
            <button
              onClick={handleReset}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              リセット
            </button>
          </div>
        </div>
      )}
    </div>
  );
}