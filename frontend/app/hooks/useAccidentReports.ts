// 交通事故レポート用カスタムフック
// GraphQLクエリフックとモックデータ統合

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { 
  AccidentReport, 
  AccidentReportFilter, 
  AccidentReportSort, 
  AccidentReportPagination,
  AccidentReportListResponse,
  AccidentReportStats 
} from '../types/AccidentReport';
import { 
  mockAccidentReports, 
  getFilteredAccidentReports, 
  getAccidentReportsStats 
} from '../data/mockAccidentReports';

// 事故レポート一覧取得・フィルタリング用フック
export function useAccidentReports() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reports, setReports] = useState<AccidentReport[]>(mockAccidentReports);
  const [filter, setFilter] = useState<AccidentReportFilter>({});
  const [sort, setSort] = useState<AccidentReportSort>({ 
    field: 'occurrenceDateTime', 
    direction: 'desc' 
  });
  const [pagination, setPagination] = useState<AccidentReportPagination>({
    page: 1,
    limit: 10,
  });

  // フィルタリングされたレポート
  const filteredReports = useMemo(() => {
    return getFilteredAccidentReports(mockAccidentReports, filter);
  }, [filter]);

  // ソートされたレポート
  const sortedReports = useMemo(() => {
    return [...filteredReports].sort((a, b) => {
      const aValue = a[sort.field];
      const bValue = b[sort.field];
      
      // null/undefined の処理
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sort.direction === 'asc' ? 1 : -1;
      if (bValue == null) return sort.direction === 'asc' ? -1 : 1;
      
      // 型に応じた比較
      let comparison = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }
      
      return sort.direction === 'asc' ? comparison : -comparison;
    });
  }, [filteredReports, sort]);

  // ページネーション適用
  const paginatedReports = useMemo(() => {
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    return sortedReports.slice(startIndex, endIndex);
  }, [sortedReports, pagination]);

  // レスポンス形式
  const response: AccidentReportListResponse = useMemo(() => ({
    items: paginatedReports,
    pagination: {
      ...pagination,
      total: sortedReports.length,
    },
  }), [paginatedReports, pagination, sortedReports.length]);

  // フィルター更新関数
  const updateFilter = useCallback((newFilter: Partial<AccidentReportFilter>) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
    setPagination(prev => ({ ...prev, page: 1 })); // フィルター変更時は1ページ目に戻る
  }, []);

  // ソート更新関数
  const updateSort = useCallback((field: keyof AccidentReport) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  // ページネーション更新関数
  const updatePagination = useCallback((newPagination: Partial<AccidentReportPagination>) => {
    setPagination(prev => ({ ...prev, ...newPagination }));
  }, []);

  // フィルターリセット関数
  const resetFilter = useCallback(() => {
    setFilter({});
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  // 再読み込み関数（将来的にAPIコールに置き換える）
  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 現在はモックデータなので即座に完了
      // 将来的にはここでGraphQLクエリを実行
      await new Promise(resolve => setTimeout(resolve, 300)); // ローディング状態を見るための遅延
      setReports(mockAccidentReports);
    } catch (err) {
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
    } finally {
      setLoading(false);
    }
  }, []);

  // 統計情報取得
  const stats = useMemo(() => {
    return getAccidentReportsStats(filteredReports);
  }, [filteredReports]);

  return {
    // データ
    data: response,
    stats,
    
    // 状態
    loading,
    error,
    
    // フィルター・ソート状態
    filter,
    sort,
    pagination: response.pagination,
    
    // 操作関数
    updateFilter,
    updateSort,
    updatePagination,
    resetFilter,
    refetch,
  };
}

// 単一事故レポート取得用フック
export function useAccidentReport(id: string | null) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<AccidentReport | null>(null);

  const fetchReport = useCallback(async (reportId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // 現在はモックデータから検索
      // 将来的にはここでGraphQLクエリを実行
      await new Promise(resolve => setTimeout(resolve, 200)); // ローディング状態を見るための遅延
      
      const foundReport = mockAccidentReports.find(r => r.id === reportId);
      if (!foundReport) {
        throw new Error(`ID ${reportId} の事故レポートが見つかりません`);
      }
      
      setReport(foundReport);
    } catch (err) {
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
      setReport(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // id が変更されたら自動的に再取得
  useEffect(() => {
    if (id) {
      fetchReport(id);
    } else {
      setReport(null);
      setError(null);
    }
  }, [id, fetchReport]);

  // 再読み込み関数
  const refetch = useCallback(() => {
    if (id) {
      fetchReport(id);
    }
  }, [id, fetchReport]);

  return {
    data: report,
    loading,
    error,
    refetch,
  };
}

// 事故レポート作成用フック（将来的な実装）
export function useCreateAccidentReport() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createReport = useCallback(async (reportData: Omit<AccidentReport, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    
    try {
      // 現在はモックなので新しいIDを生成
      const newId = String(mockAccidentReports.length + 1);
      const now = new Date().toISOString();
      
      const newReport: AccidentReport = {
        ...reportData,
        id: newId,
        createdAt: now,
        updatedAt: now,
      };
      
      // 実際の実装ではここでGraphQL Mutationを実行
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // モックデータに追加（実際の実装では不要）
      mockAccidentReports.push(newReport);
      
      return newReport;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '作成に失敗しました';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createReport,
    loading,
    error,
  };
}

// 事故レポート更新用フック（将来的な実装）
export function useUpdateAccidentReport() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateReport = useCallback(async (id: string, updates: Partial<AccidentReport>) => {
    setLoading(true);
    setError(null);
    
    try {
      // 現在はモックデータから更新
      const reportIndex = mockAccidentReports.findIndex(r => r.id === id);
      if (reportIndex === -1) {
        throw new Error(`ID ${id} の事故レポートが見つかりません`);
      }
      
      const updatedReport: AccidentReport = {
        ...mockAccidentReports[reportIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      
      // 実際の実装ではここでGraphQL Mutationを実行
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // モックデータを更新（実際の実装では不要）
      mockAccidentReports[reportIndex] = updatedReport;
      
      return updatedReport;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '更新に失敗しました';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    updateReport,
    loading,
    error,
  };
}

// 事故レポート削除用フック（将来的な実装）
export function useDeleteAccidentReport() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteReport = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const reportIndex = mockAccidentReports.findIndex(r => r.id === id);
      if (reportIndex === -1) {
        throw new Error(`ID ${id} の事故レポートが見つかりません`);
      }
      
      // 実際の実装ではここでGraphQL Mutationを実行
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // モックデータから削除（実際の実装では不要）
      mockAccidentReports.splice(reportIndex, 1);
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '削除に失敗しました';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    deleteReport,
    loading,
    error,
  };
}