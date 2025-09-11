'use client';

import { useShips, useShipComparison } from '@/hooks/useShips';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function Home() {
  const { ships, filteredShips, totalCount, filteredCount } = useShips();
  const { selectedShips, selectedCount, addShip, removeShip, clearAll } = useShipComparison();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        船舶情報比較・検索アプリ
      </h1>
      
      {/* 統計情報 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalCount}</div>
            <div className="text-sm text-gray-600">総船舶数</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{filteredCount}</div>
            <div className="text-sm text-gray-600">表示中</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{selectedCount}/3</div>
            <div className="text-sm text-gray-600">比較選択中</div>
          </CardContent>
        </Card>
      </div>

      {/* 比較選択中の船舶 */}
      {selectedCount > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">比較選択中の船舶</h2>
              <Button variant="outline" size="sm" onClick={clearAll}>
                すべてクリア
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {selectedShips.map(ship => (
                <div key={ship.ship_ID} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span>{ship.ship_ID} - {ship.ship_kind}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeShip(ship.ship_ID)}
                  >
                    削除
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 船舶一覧 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredShips.map(ship => (
          <Card key={ship.ship_ID}>
            <CardHeader>
              <h3 className="font-semibold">{ship.ship_ID}</h3>
              <p className="text-sm text-gray-600">{ship.ship_kind}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>総トン数:</span>
                  <span>{ship.ship_weight}トン</span>
                </div>
                <div className="flex justify-between">
                  <span>最高速力:</span>
                  <span>{ship.Maximum_Speed}ノット</span>
                </div>
                <div className="flex justify-between">
                  <span>全長:</span>
                  <span>{ship.Overall_Length}m</span>
                </div>
                <div className="flex justify-between">
                  <span>定員:</span>
                  <span>{ship.capacity_passengers}人</span>
                </div>
              </div>
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => addShip(ship)}
                  disabled={selectedCount >= 3}
                  className="w-full"
                >
                  比較に追加
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
