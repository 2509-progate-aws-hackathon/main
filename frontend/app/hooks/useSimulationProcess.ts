import { useState, useCallback } from 'react';
import { useRouteCalculation } from './useRouteCalculation';

interface Point {
  lng: number;
  lat: number;
}

export type SimulationStage = 'idle' | 'searching-route' | 'searching-accidents' | 'simulating' | 'completed';

interface UseSimulationProcessResult {
  currentStage: SimulationStage;
  isRunning: boolean;
  error: string | null;
  routeResult: any; // useRouteCalculationからの結果
  startSimulation: (startPoint: Point, endPoint: Point) => Promise<void>;
  resetSimulation: () => void;
}

export function useSimulationProcess(): UseSimulationProcessResult {
  const [currentStage, setCurrentStage] = useState<SimulationStage>('idle');
  const [error, setError] = useState<string | null>(null);
  
  // 既存のルート計算フックを使用
  const { result: routeResult, loading: routeLoading, error: routeError, calculateRoute } = useRouteCalculation();

  const isRunning = currentStage !== 'idle' && currentStage !== 'completed';

  const startSimulation = useCallback(async (startPoint: Point, endPoint: Point) => {
    setError(null);
    
    try {
      // 段階1: ルート検索
      setCurrentStage('searching-route');
      await calculateRoute(startPoint, endPoint);
      
      // ルート計算エラーをチェック
      if (routeError) {
        throw new Error(routeError);
      }

      // 段階2: 事故情報検索（空実装）
      setCurrentStage('searching-accidents');
      // 1.5秒の待機で検索をシミュレート
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 段階3: シミュレーション実行（空実装）  
      setCurrentStage('simulating');
      // 2秒の待機でシミュレーションをシミュレート
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 完了
      setCurrentStage('completed');
      
    } catch (err: any) {
      console.error('Simulation error:', err);
      setError(err.message || 'シミュレーション中にエラーが発生しました');
      setCurrentStage('idle');
    }
  }, [calculateRoute, routeError]);

  const resetSimulation = useCallback(() => {
    setCurrentStage('idle');
    setError(null);
  }, []);

  return {
    currentStage,
    isRunning,
    error,
    routeResult,
    startSimulation,
    resetSimulation,
  };
}