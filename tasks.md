# 船舶情報比較・検索アプリ モック実装計画

## 要件分析

### 基本機能
1. **船舶情報一覧表示**
   - 船舶データのリスト形式表示
   - 基本情報（船舶ID、種類、総トン数、最高速力等）のカード表示

2. **船舶詳細表示**
   - 個別船舶の全詳細情報表示
   - スペック情報の見やすい表示

3. **検索・フィルタリング機能**
   - 船舶種類での絞り込み
   - 総トン数範囲での絞り込み
   - 最高速力範囲での絞り込み
   - キーワード検索（船舶ID、所有者ID等）

4. **比較機能**
   - 複数船舶の選択
   - 比較表での並列表示

## ファイル構成計画

### 1. types/ship.ts
```typescript
// 船舶データの型定義
export interface Ship {
  ship_ID: string;
  ship_kind: string;
  ship_quality: string;
  navigation_area: string;
  ship_owner_ID: string;
  purpose: string;
  ship_weight: number;
  capacity_passengers: string;
  capacity_crew: string;
  capacity_other_boarders: string;
  main_engine_type: string;
  Continuous_Maximum_Output: number;
  Maximum_Speed: number;
  Cruising_Speed: number;
  Overall_Length: number;
  Width: number;
  Maximum_Height: number;
  Maximum_Full_Load_Draft: number;
  SHIPYARD_ID: number;
  Radio_Equipment: string;
  Maneuverability_Turning_Radius: string;
  Maneuverability_Drift_Distance: string;
  Special_Maneuvering_Equipment: string;
  Barrier_Free_Support_Status: string;
}

export interface SearchFilters {
  ship_kind?: string;
  weight_min?: number;
  weight_max?: number;
  speed_min?: number;
  speed_max?: number;
  keyword?: string;
}
```

### 2. app/mocks/ships.ts
```typescript
// モックデータの定義
export const mockShips: Ship[] = [
  // サンプルデータを複数定義
];

// モックデータ用のヘルパー関数
export const getMockShips = (): Ship[] => mockShips;
export const getMockShipById = (id: string): Ship | undefined => 
  mockShips.find(ship => ship.ship_ID === id);
```

### 3. features/ships/
#### 3.1 components/ShipCard.tsx
- 船舶情報のカード表示コンポーネント
- 一覧画面で使用

#### 3.2 components/ShipDetail.tsx
- 船舶詳細情報表示コンポーネント
- 詳細画面で使用

#### 3.3 components/ShipList.tsx
- 船舶一覧表示コンポーネント
- 検索・フィルタリング機能を含む

#### 3.4 components/ShipComparison.tsx
- 船舶比較表示コンポーネント
- 複数船舶の並列比較

#### 3.5 components/SearchFilter.tsx
- 検索・フィルタリングUIコンポーネント

### 4. hooks/useShips.ts
```typescript
// 船舶データ管理のカスタムフック
import { useAtom, useAtomValue } from 'jotai';
import { shipsAtom, filteredShipsAtom, filtersAtom } from '@/stores/shipAtoms';

export const useShips = () => {
  const [ships, setShips] = useAtom(shipsAtom);
  const filteredShips = useAtomValue(filteredShipsAtom);
  const [filters, setFilters] = useAtom(filtersAtom);

  // データ取得、検索、フィルタリングロジック
  return {
    ships,
    filteredShips,
    filters,
    setFilters,
    // その他のヘルパー関数
  };
};

export const useShipComparison = () => {
  const [selectedShips, setSelectedShips] = useAtom(selectedShipsAtom);
  const addToComparison = useSetAtom(addToComparisonAtom);
  const removeFromComparison = useSetAtom(removeFromComparisonAtom);

  return {
    selectedShips,
    addToComparison,
    removeFromComparison,
    clearComparison: () => setSelectedShips([]),
  };
};
```

### 5. stores/shipAtoms.ts
```typescript
// Jotai使用の状態管理
import { atom } from 'jotai';
import { Ship, SearchFilters } from '@/types/ship';

// 基本的なatom
export const shipsAtom = atom<Ship[]>([]);
export const selectedShipsAtom = atom<Ship[]>([]);
export const filtersAtom = atom<SearchFilters>({});

// 派生atom
export const filteredShipsAtom = atom((get) => {
  const ships = get(shipsAtom);
  const filters = get(filtersAtom);
  // フィルタリングロジック
  return ships.filter(ship => {
    // フィルタリング処理
  });
});

// アクション用atom
export const addToComparisonAtom = atom(null, (get, set, ship: Ship) => {
  const current = get(selectedShipsAtom);
  if (current.length < 3 && !current.find(s => s.ship_ID === ship.ship_ID)) {
    set(selectedShipsAtom, [...current, ship]);
  }
});

export const removeFromComparisonAtom = atom(null, (get, set, shipId: string) => {
  const current = get(selectedShipsAtom);
  set(selectedShipsAtom, current.filter(s => s.ship_ID !== shipId));
});
```

### 6. pages/
#### 6.1 app/ships/page.tsx
- 船舶一覧ページ（メインページ）

#### 6.2 app/ships/[id]/page.tsx
- 船舶詳細ページ

#### 6.3 app/ships/compare/page.tsx
- 船舶比較ページ

### 7. components/ui/ (共通UIコンポーネント)
#### 7.1 components/ui/Card.tsx
- 再利用可能なカードコンポーネント

#### 7.2 components/ui/Button.tsx
- 再利用可能なボタンコンポーネント

#### 7.3 components/ui/Input.tsx
- 再利用可能なインプットコンポーネント

#### 7.4 components/ui/Select.tsx
- 再利用可能なセレクトコンポーネント

## 実装優先順位

### Phase 1: 基本構造とモックデータ
1. 型定義 (types/ship.ts)
2. モックデータ作成 (app/mocks/ships.ts)
3. 基本UIコンポーネント作成
4. Jotai atoms設定 (stores/shipAtoms.ts)

### Phase 2: 一覧画面
1. ShipCard.tsx
2. ShipList.tsx
3. app/ships/page.tsx

### Phase 3: 詳細画面
1. ShipDetail.tsx
2. app/ships/[id]/page.tsx

### Phase 4: 検索・フィルタリング
1. SearchFilter.tsx
2. useShips.ts (検索ロジック)
3. 状態管理 (stores/shipAtoms.ts の拡張)

### Phase 5: 比較機能
1. ShipComparison.tsx
2. app/ships/compare/page.tsx
3. useShipComparison フック
4. 比較用Jotai atoms

## 技術スタック
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Jotai (状態管理)
- Lucide React (アイコン)

## 画面仕様

### 一覧画面
- ヘッダー: 検索・フィルタリングUI
- メイン: 船舶カードのグリッド表示
- 各カード: 船舶ID、種類、総トン数、最高速力、詳細リンク

### 詳細画面
- 船舶基本情報セクション
- 性能情報セクション
- 設備情報セクション
- 比較に追加ボタン

### 比較画面
- 選択した船舶の並列表示
- 項目別の比較表
- 差異の強調表示
