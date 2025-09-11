import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { 
  shipsAtom, 
  filteredShipsAtom, 
  filtersAtom, 
  selectedShipsAtom,
  shipKindsAtom,
  addToComparisonAtom,
  removeFromComparisonAtom,
  clearComparisonAtom,
  resetFiltersAtom
} from '@/stores/shipAtoms';
import { Ship, SearchFilters } from '@/types/ship';

/**
 * 船舶データ管理のカスタムフック
 */
export const useShips = () => {
  const ships = useAtomValue(shipsAtom);
  const filteredShips = useAtomValue(filteredShipsAtom);
  const [filters, setFilters] = useAtom(filtersAtom);
  const shipKinds = useAtomValue(shipKindsAtom);
  const resetFilters = useSetAtom(resetFiltersAtom);

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    resetFilters();
  };

  return {
    ships,
    filteredShips,
    filters,
    shipKinds,
    setFilters,
    updateFilters,
    clearFilters,
    totalCount: ships.length,
    filteredCount: filteredShips.length
  };
};

/**
 * 船舶比較管理のカスタムフック
 */
export const useShipComparison = () => {
  const selectedShips = useAtomValue(selectedShipsAtom);
  const addToComparison = useSetAtom(addToComparisonAtom);
  const removeFromComparison = useSetAtom(removeFromComparisonAtom);
  const clearComparison = useSetAtom(clearComparisonAtom);

  const isSelected = (shipId: string): boolean => {
    return selectedShips.some(ship => ship.ship_ID === shipId);
  };

  const canAddMore = (): boolean => {
    return selectedShips.length < 3;
  };

  const addShip = (ship: Ship): boolean => {
    return addToComparison(ship);
  };

  const removeShip = (shipId: string): void => {
    removeFromComparison(shipId);
  };

  const clearAll = (): void => {
    clearComparison();
  };

  return {
    selectedShips,
    selectedCount: selectedShips.length,
    maxCount: 3,
    isSelected,
    canAddMore,
    addShip,
    removeShip,
    clearAll
  };
};
