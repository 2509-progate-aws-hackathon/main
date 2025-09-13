import { useState, useCallback } from 'react';
import { GeoRoutesClient, CalculateRoutesCommand, type CalculateRoutesResponse } from '@aws-sdk/client-geo-routes';
import { withAPIKey } from '@aws/amazon-location-utilities-auth-helper';

interface Point {
  lng: number;
  lat: number;
}

interface RouteResult {
  distance: number; // メートル
  duration: number; // 秒
  geometry?: CalculateRoutesResponse; // ルート描画用の正確なレスポンス型
}

interface UseRouteCalculationResult {
  result: RouteResult | null;
  loading: boolean;
  error: string | null;
  calculateRoute: (start: Point, end: Point) => Promise<void>;
}

export function useRouteCalculation(): UseRouteCalculationResult {
  const [result, setResult] = useState<RouteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateRoute = useCallback(async (start: Point, end: Point) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // API Key認証でGeoRoutesClient を初期化
      const apiKey = process.env.NEXT_PUBLIC_MAP_API_KEY;
      const region = process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1';
      
      if (!apiKey) {
        throw new Error('API Keyが設定されていません');
      }
      
      const authHelper = withAPIKey(apiKey, region);
      const client = new GeoRoutesClient(authHelper.getClientConfig());

      // CalculateRoutesCommand を作成
      const command = new CalculateRoutesCommand({
        Origin: [start.lng, start.lat],
        Destination: [end.lng, end.lat],
        TravelMode: 'Car',
        OptimizeRoutingFor: 'FastestRoute',
      });

      // ルート計算を実行
      const response = await client.send(command);

      if (response.Routes && response.Routes.length > 0) {
        const route = response.Routes[0];
        if (route.Summary) {
          setResult({
            distance: route.Summary.Distance || 0,
            duration: route.Summary.Duration || 0,
            geometry: response, // 描画用に全レスポンスを保存
          });
        }
        console.log(response);
      } else {
        setError('ルートが見つかりませんでした');
      }
    } catch (err: any) {
      console.error('Route calculation error:', err);
      
      if (err.name === 'AccessDeniedException') {
        setError('アクセスが拒否されました。AWS認証情報を確認してください。');
      } else if (err.name === 'ValidationException') {
        setError('座標が不正です。正しい座標を選択してください。');
      } else if (err.name === 'ThrottlingException') {
        setError('リクエストが制限されています。しばらく待ってから再試行してください。');
      } else if (err.message && err.message.includes('403')) {
        setError('API Keyの権限が不足しています。Routes APIへのアクセス権限を確認してください。');
      } else {
        setError('ルート計算でエラーが発生しました: ' + (err.message || '不明なエラー'));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    result,
    loading,
    error,
    calculateRoute,
  };
}