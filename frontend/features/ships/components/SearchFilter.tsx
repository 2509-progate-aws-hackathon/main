import { useState } from 'react';
import { SearchFilters } from '@/types/ship';
import { useShips } from '@/hooks/useShips';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, Option } from '@/components/ui/Select';
import { Search, X, Filter } from 'lucide-react';

interface SearchFilterProps {
  onFiltersChange?: (filters: SearchFilters) => void;
}

export function SearchFilter({ onFiltersChange }: SearchFilterProps) {
  const { filters, shipKinds, updateFilters, clearFilters } = useShips();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof SearchFilters, value: string | number | undefined) => {
    const newFilters = { ...filters, [key]: value };
    updateFilters({ [key]: value });
    onFiltersChange?.(newFilters);
  };

  const handleClearFilters = () => {
    clearFilters();
    onFiltersChange?.({});
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && value !== null
  );

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            <h2 className="text-lg font-semibold">検索・フィルター</h2>
            {hasActiveFilters && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                フィルター適用中
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                <X className="w-4 h-4 mr-1" />
                クリア
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? '簡易表示' : '詳細検索'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* キーワード検索 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="船舶ID、種類、所有者IDで検索..."
              value={filters.keyword || ''}
              onChange={(e) => handleFilterChange('keyword', e.target.value)}
              className="pl-10"
            />
          </div>

          {/* 基本フィルター */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="船舶の種類"
              value={filters.ship_kind || ''}
              onChange={(e) => handleFilterChange('ship_kind', e.target.value || undefined)}
            >
              <Option value="">すべて</Option>
              {shipKinds.map(kind => (
                <Option key={kind} value={kind}>{kind}</Option>
              ))}
            </Select>

            <div className="grid grid-cols-2 gap-2">
              <Input
                label="総トン数（最小）"
                type="number"
                placeholder="0"
                value={filters.weight_min || ''}
                onChange={(e) => handleFilterChange('weight_min', e.target.value ? Number(e.target.value) : undefined)}
              />
              <Input
                label="総トン数（最大）"
                type="number"
                placeholder="∞"
                value={filters.weight_max || ''}
                onChange={(e) => handleFilterChange('weight_max', e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Input
                label="最高速力（最小）"
                type="number"
                placeholder="0"
                value={filters.speed_min || ''}
                onChange={(e) => handleFilterChange('speed_min', e.target.value ? Number(e.target.value) : undefined)}
              />
              <Input
                label="最高速力（最大）"
                type="number"
                placeholder="∞"
                value={filters.speed_max || ''}
                onChange={(e) => handleFilterChange('speed_max', e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
          </div>

          {/* 詳細フィルター（展開時のみ） */}
          {isExpanded && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">詳細検索オプション</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="space-y-1">
                  <p>• 船質での絞り込み</p>
                  <p>• 航行区域での絞り込み</p>
                  <p>• 主機の種類での絞り込み</p>
                </div>
                <div className="space-y-1">
                  <p>• 全長・幅での範囲指定</p>
                  <p>• 定員での範囲指定</p>
                  <p>• 造船所での絞り込み</p>
                </div>
                <div className="space-y-1">
                  <p>• バリアフリー対応状況</p>
                  <p>• 無線設備の有無</p>
                  <p>• 建造年での絞り込み</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                ※ まだつくってないよーｗ
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
