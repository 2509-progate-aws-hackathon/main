import { Ship } from '@/types/ship';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useShipComparison } from '@/hooks/useShips';
import { Eye, Plus, Minus } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ShipCardProps {
  ship: Ship;
  onViewDetail?: (ship: Ship) => void;
  isCurrentlySelected?: boolean;
}

export function ShipCard({ ship, onViewDetail, isCurrentlySelected }: ShipCardProps) {
  const router = useRouter();
  const { isSelected, canAddMore, addShip, removeShip } = useShipComparison();
  
  const selected = isSelected(ship.ship_ID);

  const handleComparisonToggle = () => {
    if (selected) {
      removeShip(ship.ship_ID);
    } else {
      addShip(ship);
    }
  };

  const handleViewDetail = () => {
    if (onViewDetail) {
      onViewDetail(ship);
    } else {
      router.push(`/ships/${ship.ship_ID}`);
    }
  };

  return (
    <Card className={`transition-all hover:shadow-lg ${
      isCurrentlySelected 
        ? 'ring-2 ring-orange-500 bg-orange-50' 
        : selected 
        ? 'ring-2 ring-blue-500' 
        : ''
    }`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{ship.ship_ID}</h3>
            <p className="text-sm text-blue-600 font-medium">{ship.ship_kind}</p>
          </div>
          <div className="flex gap-1">
            {isCurrentlySelected && (
              <div className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                表示中
              </div>
            )}
            {selected && (
              <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                比較中
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {/* 基本スペック */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-50 p-2 rounded">
              <div className="text-gray-600 text-xs">総トン数</div>
              <div className="font-semibold">{ship.ship_weight}トン</div>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <div className="text-gray-600 text-xs">最高速力</div>
              <div className="font-semibold">{ship.Maximum_Speed}ノット</div>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <div className="text-gray-600 text-xs">全長</div>
              <div className="font-semibold">{ship.Overall_Length}m</div>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <div className="text-gray-600 text-xs">定員</div>
              <div className="font-semibold">{ship.capacity_passengers}人</div>
            </div>
          </div>

          {/* 追加情報 */}
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">船質:</span>
              <span>{ship.ship_quality}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">航行区域:</span>
              <span>{ship.navigation_area}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">主機:</span>
              <span>{ship.main_engine_type}</span>
            </div>
          </div>

          {/* アクションボタン */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewDetail}
              className="flex-1"
            >
              <Eye className="w-4 h-4 mr-1" />
              詳細
            </Button>
            <Button
              variant={selected ? "secondary" : "primary"}
              size="sm"
              onClick={handleComparisonToggle}
              disabled={!selected && !canAddMore()}
              className="flex-1"
            >
              {selected ? (
                <>
                  <Minus className="w-4 h-4 mr-1" />
                  削除
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-1" />
                  比較
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
