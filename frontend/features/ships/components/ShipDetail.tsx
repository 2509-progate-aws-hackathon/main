import { Ship } from '@/types/ship';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useShipComparison } from '@/hooks/useShips';
import { 
  Ship as ShipIcon, 
  Anchor, 
  Gauge, 
  Users, 
  Zap, 
  Ruler, 
  Building2,
  Radio,
  Navigation,
  Settings,
  Accessibility,
  ArrowLeft,
  Plus,
  Minus,
  GitCompare
} from 'lucide-react';

interface ShipDetailProps {
  ship: Ship;
  onBack?: () => void;
  onCompare?: () => void;
}

export function ShipDetail({ ship, onBack, onCompare }: ShipDetailProps) {
  const { isSelected, canAddMore, addShip, removeShip } = useShipComparison();
  
  const selected = isSelected(ship.ship_ID);

  const handleComparisonToggle = () => {
    if (selected) {
      removeShip(ship.ship_ID);
    } else {
      addShip(ship);
    }
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              {onBack && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  className="mt-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              <div className="bg-blue-100 p-3 rounded-full">
                <ShipIcon className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{ship.ship_ID}</h1>
                <p className="text-lg text-blue-600 font-medium">{ship.ship_kind}</p>
                <p className="text-gray-600">{ship.purpose}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={selected ? "secondary" : "primary"}
                onClick={handleComparisonToggle}
                disabled={!selected && !canAddMore()}
                className="flex items-center gap-2"
              >
                {selected ? (
                  <>
                    <Minus className="w-4 h-4" />
                    比較から削除
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    比較に追加
                  </>
                )}
              </Button>
              
              {onCompare && (
                <Button
                  variant="outline"
                  onClick={onCompare}
                  className="flex items-center gap-2"
                >
                  <GitCompare className="w-4 h-4" />
                  比較する
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 基本情報 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Anchor className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold">基本情報</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">船舶ID</div>
                  <div className="font-semibold">{ship.ship_ID}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">船舶種類</div>
                  <div className="font-semibold">{ship.ship_kind}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">船質</div>
                  <div className="font-semibold">{ship.ship_quality}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">用途</div>
                  <div className="font-semibold">{ship.purpose}</div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-700 font-medium mb-1">航行区域</div>
                <div className="text-blue-900 font-semibold">{ship.navigation_area}</div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">船舶保有者ID</div>
                <div className="font-semibold">{ship.ship_owner_ID}</div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">造船所ID</div>
                <div className="font-semibold">{ship.SHIPYARD_ID}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 寸法・重量 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Ruler className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-semibold">寸法・重量</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-green-700 font-medium mb-1">総トン数</div>
                <div className="text-2xl font-bold text-green-900">{ship.ship_weight}トン</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">全長</div>
                  <div className="font-semibold">{ship.Overall_Length}m</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">幅</div>
                  <div className="font-semibold">{ship.Width}m</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">最大高</div>
                  <div className="font-semibold">{ship.Maximum_Height}m</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">最大喫水</div>
                  <div className="font-semibold">{ship.Maximum_Full_Load_Draft}m</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 性能・エンジン */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold">エンジン・性能</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-purple-700 font-medium mb-1">主機の種類</div>
                <div className="text-purple-900 font-semibold">{ship.main_engine_type}</div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">連続最大出力</div>
                <div className="font-semibold">{ship.Continuous_Maximum_Output}ps</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 p-3 rounded-lg">
                  <div className="text-sm text-red-700 font-medium">最高速力</div>
                  <div className="text-xl font-bold text-red-900">{ship.Maximum_Speed}ノット</div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-sm text-blue-700 font-medium">航海速力</div>
                  <div className="text-xl font-bold text-blue-900">{ship.Cruising_Speed}ノット</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 定員 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg font-semibold">定員情報</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-sm text-orange-700 font-medium mb-1">旅客定員</div>
                <div className="text-2xl font-bold text-orange-900">{ship.capacity_passengers}人</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">船員定員</div>
                  <div className="font-semibold">{ship.capacity_crew}人</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">その他乗船者</div>
                  <div className="font-semibold">{ship.capacity_other_boarders}人</div>
                </div>
              </div>
              
              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="text-sm text-gray-600">総定員</div>
                <div className="text-lg font-bold text-gray-900">
                  {parseInt(ship.capacity_passengers) + parseInt(ship.capacity_crew) + parseInt(ship.capacity_other_boarders)}人
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 設備・装備 */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold">設備・装備</h2>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-green-600" />
                <span className="font-medium text-gray-900">無線設備</span>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-green-900 font-semibold">{ship.Radio_Equipment}</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-gray-900">運動性能 (旋回径)</span>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-blue-900 font-semibold">{ship.Maneuverability_Turning_Radius}</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Accessibility className="w-4 h-4 text-purple-600" />
                <span className="font-medium text-gray-900">バリアフリー対応</span>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="text-purple-900 font-semibold">{ship.Barrier_Free_Support_Status}</div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-gray-600" />
              <span className="font-medium text-gray-900">運動性能 (惰力)</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-gray-900">{ship.Maneuverability_Drift_Distance}</div>
            </div>
          </div>
          
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-gray-600" />
              <span className="font-medium text-gray-900">操船上の特殊設備</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-gray-900">{ship.Special_Maneuvering_Equipment}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* スペック比較チャート */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Gauge className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold">スペック概要</h2>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-2">
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-lg font-bold text-blue-600">
                    {Math.round((ship.ship_weight / 1000) * 10) / 10}K
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-600">総トン数</div>
              <div className="font-semibold">{ship.ship_weight}t</div>
            </div>
            
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-2">
                <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-lg font-bold text-red-600">{ship.Maximum_Speed}</span>
                </div>
              </div>
              <div className="text-sm text-gray-600">最高速力</div>
              <div className="font-semibold">{ship.Maximum_Speed}ノット</div>
            </div>
            
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-2">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-lg font-bold text-green-600">{ship.Overall_Length}</span>
                </div>
              </div>
              <div className="text-sm text-gray-600">全長</div>
              <div className="font-semibold">{ship.Overall_Length}m</div>
            </div>
            
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-2">
                <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center">
                  <span className="text-lg font-bold text-orange-600">{ship.capacity_passengers}</span>
                </div>
              </div>
              <div className="text-sm text-gray-600">旅客定員</div>
              <div className="font-semibold">{ship.capacity_passengers}人</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
