'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Ship } from '@/types/ship';
import { getMockShipById } from '@/app/mocks/ships';
import { ShipDetail } from '@/features/ships/components/ShipDetail';
import { useShipComparison } from '@/hooks/useShips';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Ship as ShipIcon, AlertCircle, ArrowLeft } from 'lucide-react';

interface ShipDetailPageProps {
  params: {
    id: string;
  };
}

export default function ShipDetailPage({ params }: ShipDetailPageProps) {
  const router = useRouter();
  const [ship, setShip] = useState<Ship | null>(null);
  const [loading, setLoading] = useState(true);
  const { selectedShips } = useShipComparison();

  useEffect(() => {
    const fetchShip = async () => {
      try {
        setLoading(true);
        // モックデータから船舶情報を取得
        const shipData = getMockShipById(params.id);
        setShip(shipData || null);
      } catch (error) {
        console.error('船舶データの取得に失敗しました:', error);
        setShip(null);
      } finally {
        setLoading(false);
      }
    };

    fetchShip();
  }, [params.id]);

  const handleBack = () => {
    router.back();
  };

  const handleCompare = () => {
    router.push('/ships/compare');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">船舶情報を読み込み中...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!ship) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* ヘッダー */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                戻る
              </Button>
              <ShipIcon className="w-8 h-8 text-gray-400" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">船舶が見つかりません</h1>
                <p className="text-gray-600">指定された船舶ID: {params.id}</p>
              </div>
            </div>
          </div>
        </div>

        {/* エラー表示 */}
        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-12 text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                船舶情報が見つかりませんでした
              </h2>
              <p className="text-gray-600 mb-8">
                指定された船舶ID「{params.id}」に該当する船舶が存在しません。<br />
                船舶IDをご確認いただくか、一覧ページから検索してください。
              </p>
              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={handleBack}>
                  前のページに戻る
                </Button>
                <Button onClick={() => router.push('/ships')}>
                  船舶一覧に戻る
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <nav className="flex items-center gap-2 text-sm text-gray-600">
              <button 
                onClick={() => router.push('/ships')}
                className="hover:text-blue-600 transition-colors"
              >
                船舶一覧
              </button>
              <span>/</span>
              <span className="text-gray-900 font-medium">{ship.ship_ID}</span>
            </nav>
            
            {/* 比較中の船舶表示 */}
            {selectedShips.length > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">比較中:</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {selectedShips.length}隻
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCompare}
                  disabled={selectedShips.length < 2}
                >
                  比較する
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="container mx-auto px-4 py-6">
        <ShipDetail
          ship={ship}
          onBack={handleBack}
          onCompare={selectedShips.length >= 2 ? handleCompare : undefined}
        />
      </div>

      {/* フローティング比較ボタン */}
      {selectedShips.length >= 2 && (
        <div className="fixed bottom-6 right-6">
          <Button
            onClick={handleCompare}
            className="shadow-lg hover:shadow-xl transition-shadow"
            size="lg"
          >
            <ShipIcon className="w-5 h-5 mr-2" />
            {selectedShips.length}隻を比較する
          </Button>
        </div>
      )}
    </div>
  );
}
