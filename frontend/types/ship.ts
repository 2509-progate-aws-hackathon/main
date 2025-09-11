/**
 * 船舶情報の型定義
 */
export interface Ship {
  /** 船舶ID */
  ship_ID: string;
  /** 船舶の種類 */
  ship_kind: string;
  /** 船質 */
  ship_quality: string;
  /** 航行区域 */
  navigation_area: string;
  /** 船舶保有者ID */
  ship_owner_ID: string;
  /** 用途 */
  purpose: string;
  /** 総トン数 */
  ship_weight: number;
  /** 定員(旅客) */
  capacity_passengers: string;
  /** 定員(船員) */
  capacity_crew: string;
  /** 定員(その他の乗船者) */
  capacity_other_boarders: string;
  /** 主機の種類 */
  main_engine_type: string;
  /** 連続最大出力 */
  Continuous_Maximum_Output: number;
  /** 最高速力 */
  Maximum_Speed: number;
  /** 航海速力 */
  Cruising_Speed: number;
  /** 全長 */
  Overall_Length: number;
  /** 幅 */
  Width: number;
  /** 最大高 */
  Maximum_Height: number;
  /** 最大（満載）喫水 */
  Maximum_Full_Load_Draft: number;
  /** 造船所ID */
  SHIPYARD_ID: number;
  /** 無線設備 */
  Radio_Equipment: string;
  /** 運動性能(旋回径) */
  Maneuverability_Turning_Radius: string;
  /** 運動性能(惰力) */
  Maneuverability_Drift_Distance: string;
  /** 操船上の特殊設備 */
  Special_Maneuvering_Equipment: string;
  /** バリフリ対応状況 */
  Barrier_Free_Support_Status: string;
}

/**
 * 検索フィルターの型定義
 */
export interface SearchFilters {
  /** 船舶の種類 */
  ship_kind?: string;
  /** 総トン数（最小） */
  weight_min?: number;
  /** 総トン数（最大） */
  weight_max?: number;
  /** 最高速力（最小） */
  speed_min?: number;
  /** 最高速力（最大） */
  speed_max?: number;
  /** キーワード検索 */
  keyword?: string;
}

/**
 * 船舶表示用の簡略データ型
 */
export interface ShipSummary {
  ship_ID: string;
  ship_kind: string;
  ship_weight: number;
  Maximum_Speed: number;
  Overall_Length: number;
  capacity_passengers: string;
}
