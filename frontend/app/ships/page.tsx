'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Ship } from '@/types/ship';
import { ShipList } from '@/features/ships/components/ShipList';
import { useShipComparison, useShips } from '@/hooks/useShips';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Ship as ShipIcon, GitCompare, X, ArrowLeft } from 'lucide-react';

export default function ShipsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedShip, setSelectedShip] = useState<Ship | null>(null);
  const { selectedShips, selectedCount, removeShip, clearAll } = useShipComparison();
  const { ships } = useShips();

  // URLパラメータから選択中の船舶を取得
  useEffect(() => {
    const shipId = searchParams.get('selected');
    if (shipId) {
      const ship = ships.find(s => s.ship_ID === shipId);
      if (ship) {
        setSelectedShip(ship);
      }
    }
  }, [searchParams, ships]);

  const handleShipSelect = (ship: Ship) => {
    setSelectedShip(ship);
    // URLパラメータを更新して選択状態を反映
    const params = new URLSearchParams(searchParams.toString());
    params.set('selected', ship.ship_ID);
    router.replace(`/ships?${params.toString()}`);
  };

  const handleCompareClick = () => {
    router.push('/ships/compare');
  };

  const clearSelection = () => {
    setSelectedShip(null);
    const params = new URLSearchParams(searchParams.toString());
    params.delete('selected');
    router.replace(`/ships${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/')}
                className="text-gray-600 hover:text-blue-600"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                ホーム
              </Button>
              <ShipIcon className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">船舶情報検索</h1>
                <div className="flex items-center gap-2 text-gray-600">
                  <span>船舶スペックの比較・検索システム</span>
                  {selectedShip && (
                    <>
                      <span>•</span>
                      <span className="text-blue-600 font-medium">
                        {selectedShip.ship_ID} を表示中
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearSelection}
                        className="h-auto p-1 text-gray-400 hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* 比較中の船舶表示 */}
            {selectedCount > 0 && (
              <Card className="min-w-64">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GitCompare className="w-4 h-4" />
                      <span className="text-sm font-medium">比較中 ({selectedCount}/3)</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={clearAll}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-1">
                    {selectedShips.map(ship => (
                      <div 
                        key={ship.ship_ID} 
                        className="flex items-center justify-between text-xs bg-gray-50 px-2 py-1 rounded"
                      >
                        <span className="truncate">{ship.ship_ID}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeShip(ship.ship_ID)}
                          className="h-4 w-4 p-0"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  {selectedCount >= 2 && (
                    <Button
                      size="sm"
                      onClick={handleCompareClick}
                      className="w-full mt-2"
                    >
                      比較する
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* 船舶一覧 */}
          <div className="flex-1">
            <ShipList
              onShipSelect={handleShipSelect}
              onCompareClick={handleCompareClick}
              selectedShipId={selectedShip?.ship_ID}
            />
          </div>

          {/* 詳細サイドバー（選択時のみ表示） */}
          {selectedShip && (
            <div className="w-80">
              <Card className="sticky top-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">船舶詳細</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedShip(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* 基本情報 */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">基本情報</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">船舶ID:</span>
                          <span className="font-medium">{selectedShip.ship_ID}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">種類:</span>
                          <span>{selectedShip.ship_kind}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">用途:</span>
                          <span>{selectedShip.purpose}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">船質:</span>
                          <span>{selectedShip.ship_quality}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">航行区域:</span>
                          <span>{selectedShip.navigation_area}</span>
                        </div>
                      </div>
                    </div>

                    {/* 仕様 */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">仕様</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">総トン数:</span>
                          <span className="font-medium">{selectedShip.ship_weight}トン</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">全長:</span>
                          <span>{selectedShip.Overall_Length}m</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">幅:</span>
                          <span>{selectedShip.Width}m</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">最大高:</span>
                          <span>{selectedShip.Maximum_Height}m</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">最大喫水:</span>
                          <span>{selectedShip.Maximum_Full_Load_Draft}m</span>
                        </div>
                      </div>
                    </div>

                    {/* 性能 */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">性能</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">主機:</span>
                          <span>{selectedShip.main_engine_type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">連続最大出力:</span>
                          <span>{selectedShip.Continuous_Maximum_Output}ps</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">最高速力:</span>
                          <span className="font-medium">{selectedShip.Maximum_Speed}ノット</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">航海速力:</span>
                          <span>{selectedShip.Cruising_Speed}ノット</span>
                        </div>
                      </div>
                    </div>

                    {/* 定員 */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">定員</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">旅客:</span>
                          <span>{selectedShip.capacity_passengers}人</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">船員:</span>
                          <span>{selectedShip.capacity_crew}人</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">その他:</span>
                          <span>{selectedShip.capacity_other_boarders}人</span>
                        </div>
                      </div>
                    </div>

                    {/* 詳細ボタン */}
                    <Button 
                      className="w-full"
                      onClick={() => router.push(`/ships/${selectedShip.ship_ID}`)}
                    >
                      詳細ページを見る
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
