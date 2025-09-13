'use client';

// 事故レポート一覧表示コンポーネント
// レスポンシブテーブル、ページネーション、ソート機能付き

import React, { useState } from 'react';
import { useAccidentReports } from '../../hooks/useAccidentReports';
import type { AccidentReport } from '../../types/AccidentReport';

interface AccidentReportListProps {
  onSelectReport?: (report: AccidentReport) => void;
  showFilters?: boolean;
}

export default function AccidentReportList({ 
  onSelectReport,
  showFilters = true 
}: AccidentReportListProps) {
  const {
    data,
    stats,
    loading,
    error,
    filter,
    sort,
    updateFilter,
    updateSort,
    updatePagination,
    resetFilter,
    refetch
  } = useAccidentReports();

  // 詳細表示用の状態
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  // レポート選択ハンドラー
  const handleSelectReport = (report: AccidentReport) => {
    setSelectedReportId(report.id);
    onSelectReport?.(report);
  };

  // ページ変更ハンドラー
  const handlePageChange = (newPage: number) => {
    updatePagination({ page: newPage });
  };

  // ソートハンドラー
  const handleSort = (field: keyof AccidentReport) => {
    updateSort(field);
  };

  // 検索ハンドラー
  const handleSearch = (searchQuery: string) => {
    updateFilter({ searchQuery: searchQuery || undefined });
  };

  // ローディング状態
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">読み込み中...</span>
      </div>
    );
  }

  // エラー状態
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">エラーが発生しました</h3>
            <p className="mt-2 text-sm text-red-700">{error}</p>
            <button
              onClick={refetch}
              className="mt-2 text-sm font-medium text-red-800 hover:text-red-600"
            >
              再試行
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 統計情報 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">統計情報</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalReports}</div>
            <div className="text-sm text-gray-600">総事故件数</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{stats.totalDeaths}</div>
            <div className="text-sm text-gray-600">死亡者数</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.totalSeriousInjuries}</div>
            <div className="text-sm text-gray-600">重傷者数</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.totalMinorInjuries}</div>
            <div className="text-sm text-gray-600">軽傷者数</div>
          </div>
        </div>
      </div>

      {/* 検索・フィルター */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* 検索ボックス */}
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                検索
              </label>
              <input
                id="search"
                type="text"
                placeholder="タイトル、説明、場所、車両IDで検索..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={filter.searchQuery || ''}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            {/* フィルターボタン */}
            <div className="flex gap-2">
              <button
                onClick={resetFilter}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
              >
                リセット
              </button>
            </div>
          </div>
        </div>
      )}

      {/* テーブル */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            事故レポート一覧 ({data.pagination.total}件)
          </h2>
        </div>
        
        {data.items.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">データがありません</h3>
            <p className="mt-1 text-sm text-gray-500">条件に合致する事故レポートが見つかりませんでした。</p>
          </div>
        ) : (
          <>
            {/* テーブル本体 */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort('occurrenceDateTime')}
                        className="flex items-center space-x-1 hover:text-gray-700"
                      >
                        <span>発生日時</span>
                        {sort.field === 'occurrenceDateTime' && (
                          <svg className={`w-4 h-4 ${sort.direction === 'asc' ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                          </svg>
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      事故種別
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      場所
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      天候
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort('damageLevel')}
                        className="flex items-center space-x-1 hover:text-gray-700"
                      >
                        <span>損害レベル</span>
                        {sort.field === 'damageLevel' && (
                          <svg className={`w-4 h-4 ${sort.direction === 'asc' ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                          </svg>
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      被害者数
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">操作</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.items.map((report) => (
                    <tr
                      key={report.id}
                      className={`hover:bg-gray-50 cursor-pointer ${
                        selectedReportId === report.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => handleSelectReport(report)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(report.occurrenceDateTime).toLocaleDateString('ja-JP', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {report.accidentTypeCategory || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="max-w-xs truncate">
                          {report.location || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {report.weather || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          report.damageLevel === '重大' ? 'bg-red-100 text-red-800' :
                          report.damageLevel === '中程度' ? 'bg-yellow-100 text-yellow-800' :
                          report.damageLevel === '軽微' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {report.damageLevel || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex space-x-2">
                          {report.numberOfDeaths ? (
                            <span className="text-red-600 font-medium">死:{report.numberOfDeaths}</span>
                          ) : null}
                          {report.numberOfSeriousInjuries ? (
                            <span className="text-orange-600 font-medium">重:{report.numberOfSeriousInjuries}</span>
                          ) : null}
                          {report.numberOfMinorInjuries ? (
                            <span className="text-yellow-600 font-medium">軽:{report.numberOfMinorInjuries}</span>
                          ) : null}
                          {!report.numberOfDeaths && !report.numberOfSeriousInjuries && !report.numberOfMinorInjuries && '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900">
                          詳細
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ページネーション */}
            {data.pagination.total > data.pagination.limit && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(data.pagination.page - 1)}
                    disabled={data.pagination.page === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-50 disabled:text-gray-400"
                  >
                    前へ
                  </button>
                  <button
                    onClick={() => handlePageChange(data.pagination.page + 1)}
                    disabled={data.pagination.page * data.pagination.limit >= data.pagination.total}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-50 disabled:text-gray-400"
                  >
                    次へ
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">{((data.pagination.page - 1) * data.pagination.limit) + 1}</span>
                      {' '}〜{' '}
                      <span className="font-medium">
                        {Math.min(data.pagination.page * data.pagination.limit, data.pagination.total)}
                      </span>
                      {' '}件 / 全{' '}
                      <span className="font-medium">{data.pagination.total}</span>
                      {' '}件
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => handlePageChange(data.pagination.page - 1)}
                        disabled={data.pagination.page === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-50 disabled:text-gray-300"
                      >
                        <span className="sr-only">前のページ</span>
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      {/* ページ番号 */}
                      {Array.from({ 
                        length: Math.min(5, Math.ceil(data.pagination.total / data.pagination.limit)) 
                      }, (_, i) => {
                        const pageNum = data.pagination.page - 2 + i;
                        const totalPages = Math.ceil(data.pagination.total / data.pagination.limit);
                        const adjustedPageNum = Math.max(1, Math.min(pageNum, totalPages - 4 + i));
                        
                        if (adjustedPageNum < 1 || adjustedPageNum > totalPages) return null;
                        
                        return (
                          <button
                            key={adjustedPageNum}
                            onClick={() => handlePageChange(adjustedPageNum)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              adjustedPageNum === data.pagination.page
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {adjustedPageNum}
                          </button>
                        );
                      })}

                      <button
                        onClick={() => handlePageChange(data.pagination.page + 1)}
                        disabled={data.pagination.page * data.pagination.limit >= data.pagination.total}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-50 disabled:text-gray-300"
                      >
                        <span className="sr-only">次のページ</span>
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}