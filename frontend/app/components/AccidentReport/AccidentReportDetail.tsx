'use client';

// 事故レポート詳細表示コンポーネント
// 58項目の適切な分類表示とモーダル対応

import React from 'react';
import type { AccidentReport } from '../../types/AccidentReport';

interface AccidentReportDetailProps {
  report: AccidentReport;
  isModal?: boolean;
  onClose?: () => void;
}

interface SectionData {
  title: string;
  icon: string;
  fields: Array<{
    label: string;
    value: any;
    type?: 'text' | 'number' | 'boolean' | 'date' | 'datetime';
  }>;
}

export default function AccidentReportDetail({ 
  report, 
  isModal = false, 
  onClose 
}: AccidentReportDetailProps) {
  
  // データを構造化してセクション分け
  const sections: SectionData[] = [
    {
      title: '基本情報',
      icon: '📋',
      fields: [
        { label: '発生日時', value: report.occurrenceDateTime, type: 'datetime' },
        { label: '天候', value: report.weather },
        { label: '場所', value: report.location },
        { label: '緯度', value: report.latitude, type: 'number' },
        { label: '経度', value: report.longitude, type: 'number' },
        { label: '車両ID', value: report.vehicleId },
      ]
    },
    {
      title: '事故詳細',
      icon: '🚨',
      fields: [
        { label: '事故種別', value: report.accidentTypeCategory },
        { label: '発生順序', value: report.orderOfAccidentOccurrence, type: 'number' },
        { label: '落下高度', value: report.fallHeight, type: 'number' },
        { label: '水深', value: report.waterDepth, type: 'number' },
        { label: '衝突状況', value: report.collisionCondition },
        { label: '事故場所', value: report.accidentLocation },
      ]
    },
    {
      title: '車両情報',
      icon: '🚗',
      fields: [
        { label: '車種名', value: report.vehicle1ModelName },
        { label: '車両タイプ', value: report.vehicle1ModelType },
        { label: '車体形状', value: report.vehicle1BodyType },
        { label: '初回登録年', value: report.vehicle1YearOfRegistration, type: 'number' },
        { label: '乗車定員', value: report.vehicle1SeatingCapacity, type: 'number' },
        { label: '事故時積載量', value: report.vehicle1LoadAtTime, type: 'number' },
        { label: '最大積載量', value: report.vehicle1MaxLoadCapacity, type: 'number' },
        { label: '積荷内容', value: report.cargoContents },
      ]
    },
    {
      title: '危険物情報',
      icon: '⚠️',
      fields: [
        { label: '危険物輸送', value: report.transportOfHazardousMaterial, type: 'boolean' },
        { label: '危険物種別', value: report.typeOfHazardousMaterial },
      ]
    },
    {
      title: '道路環境',
      icon: '🛣️',
      fields: [
        { label: '道路種別', value: report.roadType },
        { label: '路面状況', value: report.roadSurfaceCondition },
        { label: '警告標識設置', value: report.warningSignsInstalled, type: 'boolean' },
        { label: '制限速度', value: report.speedLimitOnRoad, type: 'number' },
        { label: '踏切状況', value: report.railwayCrossingCondition },
      ]
    },
    {
      title: 'リスク認識・行動',
      icon: '🎯',
      fields: [
        { label: '危険認識時速度', value: report.speedAtRiskRecognition, type: 'number' },
        { label: '危険認識距離', value: report.distanceAtRiskRecognition, type: 'number' },
        { label: 'スリップ距離', value: report.slipDistance, type: 'number' },
        { label: '事故時車両挙動', value: report.vehicleBehaviorAtAccident },
      ]
    },
    {
      title: '負傷・損害状況',
      icon: '🏥',
      fields: [
        { label: '死傷者状況', value: report.conditionOfInjuredOrDeceased },
        { label: '故障箇所', value: report.faultLocation },
        { label: '永久・一時', value: report.permanentTemporary },
        { label: '損害レベル', value: report.damageLevel },
      ]
    },
    {
      title: '運転者情報',
      icon: '👤',
      fields: [
        { label: '前月休日数', value: report.daysOffInPastMonth, type: 'number' },
        { label: '事故まで労働時間', value: report.workingHoursUntilAccident, type: 'number' },
        { label: '事故まで運転距離', value: report.distanceDrivenUntilAccident, type: 'number' },
        { label: '最終休日からの勤務日数', value: report.daysWorkedSinceLastDayOff, type: 'number' },
        { label: '最終休日からの走行距離', value: report.totalDistanceDrivenSinceLastDayOff, type: 'number' },
        { label: 'シートベルト使用', value: report.seatbeltUsage, type: 'boolean' },
      ]
    },
    {
      title: '統計情報',
      icon: '📊',
      fields: [
        { label: '事故回数', value: report.numberOfAccidents, type: 'number' },
        { label: '違反回数', value: report.numberOfViolations, type: 'number' },
        { label: '死亡者数', value: report.numberOfDeaths, type: 'number' },
        { label: '死亡者数（乗客）', value: report.numberOfDeathsPassengers, type: 'number' },
        { label: '重傷者数', value: report.numberOfSeriousInjuries, type: 'number' },
        { label: '重傷者数（乗客）', value: report.numberOfSeriousInjuriesPassengers, type: 'number' },
        { label: '軽傷者数', value: report.numberOfMinorInjuries, type: 'number' },
        { label: '軽傷者数（乗客）', value: report.numberOfMinorInjuriesPassengers, type: 'number' },
      ]
    },
    {
      title: '走行・改造情報',
      icon: '🔧',
      fields: [
        { label: '総走行距離', value: report.totalDrivenDistance, type: 'number' },
        { label: '改造内容', value: report.modificationContents },
        { label: '改造日', value: report.dateOfModification, type: 'date' },
        { label: '破損・脱落部位', value: report.brokenOrDetachedPartName },
        { label: '設置後走行距離', value: report.drivenDistanceSinceInstallation, type: 'number' },
        { label: '改造日1', value: report.modificationDate1, type: 'date' },
        { label: '改造日2', value: report.modificationDate2, type: 'date' },
        { label: '改造日3', value: report.modificationDate3, type: 'date' },
      ]
    },
    {
      title: 'その他',
      icon: '📝',
      fields: [
        { label: '疲労・急激破損種別', value: report.fatigueOrSuddenBreakageType },
        { label: 'タイトル', value: report.title },
        { label: '説明', value: report.description },
      ]
    }
  ];

  // 値のフォーマット関数
  const formatValue = (value: any, type?: string): string => {
    if (value === null || value === undefined || value === '') {
      return '-';
    }

    switch (type) {
      case 'boolean':
        return value ? 'はい' : 'いいえ';
      case 'number':
        return typeof value === 'number' ? value.toLocaleString() : String(value);
      case 'date':
        if (typeof value === 'string') {
          try {
            return new Date(value).toLocaleDateString('ja-JP');
          } catch {
            return value;
          }
        }
        return String(value);
      case 'datetime':
        if (typeof value === 'string') {
          try {
            return new Date(value).toLocaleString('ja-JP', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            });
          } catch {
            return value;
          }
        }
        return String(value);
      default:
        return String(value);
    }
  };

  // 重要度に応じたスタイリング
  const getSeverityColor = (sectionTitle: string) => {
    switch (sectionTitle) {
      case '事故詳細':
        return 'border-l-red-500 bg-red-50';
      case '負傷・損害状況':
        return 'border-l-orange-500 bg-orange-50';
      case '統計情報':
        return 'border-l-yellow-500 bg-yellow-50';
      case '基本情報':
        return 'border-l-blue-500 bg-blue-50';
      default:
        return 'border-l-gray-300 bg-gray-50';
    }
  };

  const content = (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {report.title || `事故レポート #${report.id}`}
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              {formatValue(report.occurrenceDateTime, 'datetime')} | {report.location || '場所不明'}
            </p>
          </div>
          {isModal && onClose && (
            <button
              onClick={onClose}
              className="rounded-md bg-white text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span className="sr-only">閉じる</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        {/* サマリーバッジ */}
        <div className="mt-3 flex flex-wrap gap-2">
          {report.accidentTypeCategory && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {report.accidentTypeCategory}
            </span>
          )}
          {report.damageLevel && (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              report.damageLevel === '重大' ? 'bg-red-100 text-red-800' :
              report.damageLevel === '中程度' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              損害: {report.damageLevel}
            </span>
          )}
          {report.weather && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {report.weather}
            </span>
          )}
        </div>
      </div>

      {/* セクション */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sections.map((section) => (
          <div
            key={section.title}
            className={`border-l-4 rounded-lg p-4 ${getSeverityColor(section.title)}`}
          >
            <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
              <span className="mr-2">{section.icon}</span>
              {section.title}
            </h3>
            
            <div className="space-y-3">
              {section.fields.map((field) => {
                const formattedValue = formatValue(field.value, field.type);
                const hasValue = formattedValue !== '-';
                
                return (
                  <div key={field.label} className="flex justify-between items-start">
                    <dt className="text-sm font-medium text-gray-600 min-w-0 flex-1 pr-4">
                      {field.label}
                    </dt>
                    <dd className={`text-sm text-right min-w-0 flex-1 ${
                      hasValue ? 'text-gray-900 font-medium' : 'text-gray-400'
                    }`}>
                      {field.type === 'boolean' && hasValue ? (
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          field.value 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {formattedValue}
                        </span>
                      ) : (
                        <span className={
                          field.type === 'number' && hasValue && Number(field.value) > 0 
                            ? 'font-mono' 
                            : ''
                        }>
                          {formattedValue}
                        </span>
                      )}
                    </dd>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* システム情報 */}
      <div className="border-t border-gray-200 pt-4 text-xs text-gray-500">
        <div className="flex justify-between">
          <span>作成日時: {formatValue(report.createdAt, 'datetime')}</span>
          <span>更新日時: {formatValue(report.updatedAt, 'datetime')}</span>
        </div>
      </div>
    </div>
  );

  // モーダル表示の場合
  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
          
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-6xl">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6">
              {content}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 通常表示の場合
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {content}
    </div>
  );
}