import { Ship } from '@/types/ship';
import { useShipComparison } from '@/hooks/useShips';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Ship as ShipIcon, 
  X, 
  Users, 
  Gauge, 
  Ruler, 
  Scale, 
  Navigation,
  MapPin,
  Shield,
  Wifi,
  Accessibility,
  ArrowLeft,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import Link from 'next/link';

interface ShipComparisonProps {
  ships?: Ship[];
  showBackButton?: boolean;
}

export function ShipComparison({ ships: propShips, showBackButton = true }: ShipComparisonProps) {
  const { selectedShips, removeShip, clearAll } = useShipComparison();
  const ships = propShips || selectedShips;

  if (ships.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <ShipIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            比較する船舶を選択してください
          </h3>
          <p className="text-gray-600 mb-6">
            船舶一覧から最大3隻まで選択して比較できます
          </p>
          <Link href="/ships">
            <Button>
              船舶を選択する
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  // 比較用のフィールド定義
  const comparisonFields = [
    {
      key: 'ship_ID',
      label: '船舶ID',
      icon: ShipIcon,
      type: 'text' as const
    },
    {
      key: 'ship_kind',
      label: '船舶種類',
      icon: Navigation,
      type: 'text' as const
    },
    {
      key: 'ship_quality',
      label: '船質',
      icon: Shield,
      type: 'text' as const
    },
    {
      key: 'ship_weight',
      label: '総トン数',
      icon: Scale,
      type: 'number' as const,
      unit: 'トン'
    },
    {
      key: 'Overall_Length',
      label: '全長',
      icon: Ruler,
      type: 'number' as const,
      unit: 'm'
    },
    {
      key: 'Breadth',
      label: '全幅',
      icon: Ruler,
      type: 'number' as const,
      unit: 'm'
    },
    {
      key: 'Depth',
      label: '全深',
      icon: Ruler,
      type: 'number' as const,
      unit: 'm'
    },
    {
      key: 'Maximum_Speed',
      label: '最高速力',
      icon: Gauge,
      type: 'number' as const,
      unit: 'ノット'
    },
    {
      key: 'capacity_passengers',
      label: '定員',
      icon: Users,
      type: 'number' as const,
      unit: '人'
    },
    {
      key: 'navigation_area',
      label: '航行区域',
      icon: MapPin,
      type: 'text' as const
    },
    {
      key: 'Communication_Equipment',
      label: '通信設備',
      icon: Wifi,
      type: 'text' as const
    },
    {
      key: 'Barrier_Free_Support_Status',
      label: 'バリアフリー対応',
      icon: Accessibility,
      type: 'text' as const
    }
  ];

  // 数値フィールドの比較結果を取得
  const getComparisonResult = (field: string, value: number, allValues: number[]) => {
    const max = Math.max(...allValues);
    const min = Math.min(...allValues);
    
    if (value === max && value !== min) {
      return { icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' };
    } else if (value === min && value !== max) {
      return { icon: TrendingDown, color: 'text-red-600', bg: 'bg-red-50' };
    }
    return { icon: Minus, color: 'text-gray-400', bg: 'bg-gray-50' };
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          {showBackButton && (
            <Link href="/ships">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-1" />
                戻る
              </Button>
            </Link>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">船舶比較</h1>
            <p className="text-gray-600">{ships.length}隻の船舶を比較中</p>
          </div>
        </div>
        {!propShips && ships.length > 0 && (
          <Button variant="outline" onClick={clearAll}>
            すべてクリア
          </Button>
        )}
      </div>

      {/* 比較テーブル */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 w-48">
                    項目
                  </th>
                  {ships.map((ship, index) => (
                    <th key={ship.ship_ID} className="px-4 py-3 text-center min-w-48">
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2">
                          <span className="font-semibold text-gray-900">{ship.ship_ID}</span>
                          {!propShips && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeShip(ship.ship_ID)}
                              className="text-gray-400 hover:text-red-600 p-1 h-auto"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                        <div className="text-xs text-blue-600">{ship.ship_kind}</div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {comparisonFields.map((field) => {
                  const Icon = field.icon;
                  const values = ships.map(ship => ship[field.key as keyof Ship]);
                  const numericValues = field.type === 'number' 
                    ? values.map(v => typeof v === 'number' ? v : parseInt(String(v)) || 0)
                    : [];

                  return (
                    <tr key={field.key} className="hover:bg-gray-50">
                      <td className="px-4 py-4 border-r bg-gray-50">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-gray-500" />
                          <span className="font-medium text-gray-700">{field.label}</span>
                        </div>
                      </td>
                      {ships.map((ship, index) => {
                        const value = ship[field.key as keyof Ship];
                        const displayValue = field.unit && typeof value === 'number' 
                          ? `${value.toLocaleString()}${field.unit}`
                          : field.unit && typeof value === 'string' && !isNaN(parseInt(value))
                          ? `${parseInt(value).toLocaleString()}${field.unit}`
                          : String(value);

                        let comparison = null;
                        if (field.type === 'number' && numericValues.length > 1) {
                          const numValue = typeof value === 'number' ? value : parseInt(String(value)) || 0;
                          comparison = getComparisonResult(field.key, numValue, numericValues);
                        }

                        return (
                          <td key={`${ship.ship_ID}-${field.key}`} className="px-4 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <span className="font-medium">{displayValue}</span>
                              {comparison && (
                                <div className={`p-1 rounded-full ${comparison.bg}`}>
                                  <comparison.icon className={`w-3 h-3 ${comparison.color}`} />
                                </div>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 統計サマリー */}
      {ships.length > 1 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              <h3 className="text-lg font-semibold">比較統計</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600 mb-1">
                  {Math.round(ships.reduce((sum, ship) => sum + ship.ship_weight, 0) / ships.length).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">平均総トン数</div>
                <div className="text-xs text-gray-500 mt-1">
                  範囲: {Math.min(...ships.map(s => s.ship_weight)).toLocaleString()} - {Math.max(...ships.map(s => s.ship_weight)).toLocaleString()}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-xl font-bold text-green-600 mb-1">
                  {Math.round(ships.reduce((sum, ship) => sum + ship.Maximum_Speed, 0) / ships.length)}
                </div>
                <div className="text-sm text-gray-600">平均最高速力</div>
                <div className="text-xs text-gray-500 mt-1">
                  範囲: {Math.min(...ships.map(s => s.Maximum_Speed))} - {Math.max(...ships.map(s => s.Maximum_Speed))}ノット
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-xl font-bold text-purple-600 mb-1">
                  {Math.round(ships.reduce((sum, ship) => sum + ship.Overall_Length, 0) / ships.length)}
                </div>
                <div className="text-sm text-gray-600">平均全長</div>
                <div className="text-xs text-gray-500 mt-1">
                  範囲: {Math.min(...ships.map(s => s.Overall_Length))} - {Math.max(...ships.map(s => s.Overall_Length))}m
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-xl font-bold text-orange-600 mb-1">
                  {Math.round(ships.reduce((sum, ship) => sum + (parseInt(ship.capacity_passengers) || 0), 0) / ships.length).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">平均定員</div>
                <div className="text-xs text-gray-500 mt-1">
                  範囲: {Math.min(...ships.map(s => parseInt(s.capacity_passengers) || 0)).toLocaleString()} - {Math.max(...ships.map(s => parseInt(s.capacity_passengers) || 0)).toLocaleString()}人
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* アクション */}
      {ships.length < 3 && !propShips && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="py-6 text-center">
            <p className="text-blue-800 mb-4">
              さらに船舶を追加して比較できます（現在{ships.length}/3隻）
            </p>
            <Link href="/ships">
              <Button variant="outline">
                船舶を追加する
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
