import { useState, useCallback } from 'react';
import { directRDSClient } from '@/app/libs/directRDSClient';
import { AccidentData } from '@/app/libs/directRDSClient';

type Accident = AccidentData;

interface UseDirectRDSResult {
  accidents: Accident[];
  loading: boolean;
  error: string | null;
  searchNearRoute: (routeLine: string, distanceMeters?: number) => Promise<void>;
  getAllAccidents: (limit?: number) => Promise<void>;
  searchInBounds: (minLat: number, maxLat: number, minLng: number, maxLng: number) => Promise<void>;
  clearResults: () => void;
}

/**
 * RDS Data API に直接アクセスするフック
 * セキュリティを無視してフロントエンドから直接データベースにアクセス
 */
export const useDirectRDS = (): UseDirectRDSResult => {
  const [accidents, setAccidents] = useState<Accident[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchNearRoute = useCallback(async (routeLine: string, distanceMeters = 100) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Searching accidents near route:', { routeLine, distanceMeters });
      const result = await directRDSClient.searchAccidentsNearRoute(routeLine, distanceMeters);
      
      if (result.success) {
        setAccidents(result.accidents);
        console.log(`Found ${result.accidents.length} accidents near route`);
      } else {
        throw new Error('Failed to search accidents near route');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Route search error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllAccidents = useCallback(async (limit = 1000) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching all accidents, limit:', limit);
      const result = await directRDSClient.getAllAccidents(limit);
      
      if (result.success) {
        setAccidents(result.accidents);
        console.log(`Loaded ${result.count} accidents`);
      } else {
        throw new Error('Failed to fetch all accidents');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Get all accidents error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchInBounds = useCallback(async (
    minLat: number, 
    maxLat: number, 
    minLng: number, 
    maxLng: number
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Searching accidents in bounds:', { minLat, maxLat, minLng, maxLng });
      const result = await directRDSClient.searchAccidentsInBounds(minLat, maxLat, minLng, maxLng);
      
      if (result.success) {
        setAccidents(result.accidents);
        console.log(`Found ${result.accidents.length} accidents in bounds`);
      } else {
        throw new Error('Failed to search accidents in bounds');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Bounds search error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setAccidents([]);
    setError(null);
  }, []);

  return {
    accidents,
    loading,
    error,
    searchNearRoute,
    getAllAccidents,
    searchInBounds,
    clearResults
  };
};