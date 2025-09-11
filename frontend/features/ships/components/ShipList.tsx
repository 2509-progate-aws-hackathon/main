import { useState } from 'react';
import { Ship } from '@/types/ship';
import { useShips, useShipComparison } from '@/hooks/useShips';
import { ShipCard } from './ShipCard';
import { SearchFilter } from './SearchFilter';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select, Option } from '@/components/ui/Select';
import { 
  Grid3x3, 
  List, 
  ArrowUpDown, 
  Users, 
  Anchor,
  BarChart3,
  Eye,
  GitCompare
} from 'lucide-react';

type SortField = 'ship_ID' | 'ship_weight' | 'Maximum_Speed' | 'Overall_Length' | 'capacity_passengers';
type SortOrder = 'asc' | 'desc';
type ViewMode = 'grid' | 'list';

interface ShipListProps {
  onShipSelect?: (ship: Ship) => void;
  onCompareClick?: () => void;
}

export function ShipList({ onShipSelect, onCompareClick }: ShipListProps) {
  const { filteredShips, filteredCount, totalCount } = useShips();
  const { selectedShips, selectedCount } = useShipComparison();
  
  const [sortField, setSortField] = useState<SortField>('ship_ID');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // ソート処理
  const sortedShips = [...filteredShips].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    // 数値の場合
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }

    // 文字列の場合
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      // 定員の場合は数値として比較
      if (sortField === 'capacity_passengers') {
        const aNum = parseInt(aValue) || 0;
        const bNum = parseInt(bValue) || 0;
        return sortOrder === 'asc' ? aNum - bNum : bNum - aNum;
      }
      
      return sortOrder === 'asc' 
        ? aValue.localeCompare(bValue, 'ja')
        : bValue.localeCompare(aValue, 'ja');
    }

    return 0;
  });

  const handleSortChange = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4" />;
    return (
      <ArrowUpDown 
        className={`w-4 h-4 ${sortOrder === 'asc' ? 'rotate-0' : 'rotate-180'}`} 
      />
    );
  };

  return (
    <div className="space-y-6">
      {/* 検索・フィルター */}
      <SearchFilter />

      {/* ツールバー */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* 結果表示 */}
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                {filteredCount}件 / 全{totalCount}件
              </div>
              {selectedCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onCompareClick}
                  className="flex items-center gap-1"
                >
                  <GitCompare className="w-4 h-4" />
                  比較する ({selectedCount})
                </Button>
              )}
            </div>

            {/* 表示・ソート設定 */}
            <div className="flex items-center gap-2">
              {/* 表示モード */}
              <div className="flex bg-gray-100 rounded-md p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              {/* ソート */}
              <Select
                value={sortField}
                onChange={(e) => setSortField(e.target.value as SortField)}
              >
                <Option value="ship_ID">船舶ID順</Option>
                <Option value="ship_weight">総トン数順</Option>
                <Option value="Maximum_Speed">最高速力順</Option>
                <Option value="Overall_Length">全長順</Option>
                <Option value="capacity_passengers">定員順</Option>
              </Select>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {getSortIcon(sortField)}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 船舶一覧 */}
      {filteredCount === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Anchor className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              該当する船舶が見つかりません
            </h3>
            <p className="text-gray-600">
              検索条件を変更してお試しください
            </p>
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedShips.map(ship => (
            <ShipCard
              key={ship.ship_ID}
              ship={ship}
              onViewDetail={onShipSelect}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      船舶情報
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      スペック
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      詳細
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      アクション
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sortedShips.map(ship => (
                    <tr key={ship.ship_ID} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{ship.ship_ID}</div>
                          <div className="text-sm text-blue-600">{ship.ship_kind}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm space-y-1">
                          <div>{ship.ship_weight}トン</div>
                          <div>{ship.Maximum_Speed}ノット</div>
                          <div>{ship.Overall_Length}m</div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm space-y-1">
                          <div>{ship.ship_quality}</div>
                          <div>{ship.navigation_area}</div>
                          <div>{ship.capacity_passengers}人</div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onShipSelect?.(ship)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 統計情報 */}
      {filteredCount > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              <h3 className="text-lg font-semibold">表示中の船舶統計</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(sortedShips.reduce((sum, ship) => sum + ship.ship_weight, 0) / sortedShips.length)}
                </div>
                <div className="text-sm text-gray-600">平均総トン数</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(sortedShips.reduce((sum, ship) => sum + ship.Maximum_Speed, 0) / sortedShips.length)}
                </div>
                <div className="text-sm text-gray-600">平均最高速力</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(sortedShips.reduce((sum, ship) => sum + ship.Overall_Length, 0) / sortedShips.length)}
                </div>
                <div className="text-sm text-gray-600">平均全長(m)</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round(sortedShips.reduce((sum, ship) => sum + (parseInt(ship.capacity_passengers) || 0), 0) / sortedShips.length)}
                </div>
                <div className="text-sm text-gray-600">平均定員</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
