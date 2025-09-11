import { atom } from 'jotai';
import { Ship, SearchFilters } from '@/types/ship';
import { getMockShips } from '@/app/mocks/ships';

/**
 * 基本的なatoms
 */

// 全船舶データ
export const shipsAtom = atom<Ship[]>(getMockShips());

// 比較対象として選択された船舶（最大3隻）
export const selectedShipsAtom = atom<Ship[]>([]);

// 検索・フィルタリング条件
export const filtersAtom = atom<SearchFilters>({});

/**
 * 派生atoms
 */

// フィルタリングされた船舶一覧
export const filteredShipsAtom = atom((get) => {
  const ships = get(shipsAtom);
  const filters = get(filtersAtom);

  return ships.filter(ship => {
    // 船舶種類フィルター
    if (filters.ship_kind && ship.ship_kind !== filters.ship_kind) {
      return false;
    }

    // 総トン数範囲フィルター
    if (filters.weight_min !== undefined && ship.ship_weight < filters.weight_min) {
      return false;
    }
    if (filters.weight_max !== undefined && ship.ship_weight > filters.weight_max) {
      return false;
    }

    // 最高速力範囲フィルター
    if (filters.speed_min !== undefined && ship.Maximum_Speed < filters.speed_min) {
      return false;
    }
    if (filters.speed_max !== undefined && ship.Maximum_Speed > filters.speed_max) {
      return false;
    }

    // キーワード検索
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      const searchText = [
        ship.ship_ID,
        ship.ship_kind,
        ship.ship_owner_ID,
        ship.purpose,
        ship.main_engine_type
      ].join(' ').toLowerCase();
      
      if (!searchText.includes(keyword)) {
        return false;
      }
    }

    return true;
  });
});

// 船舶種類の一覧（フィルター用）
export const shipKindsAtom = atom((get) => {
  const ships = get(shipsAtom);
  return Array.from(new Set(ships.map(ship => ship.ship_kind))).sort();
});

/**
 * アクション atoms
 */

// 比較に船舶を追加
export const addToComparisonAtom = atom(
  null,
  (get, set, ship: Ship) => {
    const current = get(selectedShipsAtom);
    
    // 最大3隻まで、重複なしで追加
    if (current.length < 3 && !current.find(s => s.ship_ID === ship.ship_ID)) {
      set(selectedShipsAtom, [...current, ship]);
      return true;
    }
    return false;
  }
);

// 比較から船舶を削除
export const removeFromComparisonAtom = atom(
  null,
  (get, set, shipId: string) => {
    const current = get(selectedShipsAtom);
    set(selectedShipsAtom, current.filter(s => s.ship_ID !== shipId));
  }
);

// 比較リストをクリア
export const clearComparisonAtom = atom(
  null,
  (get, set) => {
    set(selectedShipsAtom, []);
  }
);

// フィルターをリセット
export const resetFiltersAtom = atom(
  null,
  (get, set) => {
    set(filtersAtom, {});
  }
);
