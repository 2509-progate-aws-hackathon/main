// 交通事故レポート関連の型定義
// 実際のDBスキーマに基づく完全な事故データ構造

/**
 * データベースの実際のスキーマに基づく事故データの型定義
 */
export interface AccidentReport {
  // 基本情報
  OCCURRENCE_DATE_AND_TIME?: string;
  WEATHER?: string;
  LOCATION?: string;
  VEHICLE_ID?: string;
  ACCIDENT_TYPE_CATEGORY?: string;
  ORDER_OF_ACCIDENT_OCCURRENCE?: string;
  
  // 事故状況
  FALL_HEIGHT?: number;
  WATER_DEPTH?: number;
  COLLISION_CONDITION?: string;
  
  // 車両情報
  VEHICLE_1_MODEL_NAME?: string;
  VEHICLE_1_MODEL_TYPE?: string;
  VEHICLE_1_BODY_TYPE?: string;
  VEHICLE_1_YEAR_OF_INITIAL_REGISTRATION_INSPECTION?: number;
  VEHICLE_1_SEATING_CAPACITY?: number;
  VEHICLE_1_LOAD_AT_THE_TIME?: number;
  VEHICLE_1_MAXIMUM_LOAD_CAPACITY?: number;
  
  // 貨物情報
  CARGO_CONTENTS?: string;
  TRANSPORT_OF_HAZARDOUS_MATERIAL?: boolean;
  TYPE_OF_HAZARDOUS_MATERIAL?: string;
  
  // 道路情報
  ROAD_TYPE?: string;
  ROAD_SURFACE_CONDITION?: string;
  WARNING_SIGNS_INSTALLED?: boolean;
  SPEED_LIMIT_ON_ROAD?: number;
  RAILWAY_CROSSING_CONDITION?: string;
  
  // 事故時の状況
  SPEED_AT_RISK_RECOGNITION?: number;
  DISTANCE_AT_RISK_RECOGNITION?: number;
  SLIP_DISTANCE?: number;
  VEHICLE_BEHAVIOR_AT_ACCIDENT?: string;
  ACCIDENT_LOCATION?: string;
  
  // 被害状況
  CONDITION_OF_INJURED_OR_DECEASED?: string;
  FAULT_LOCATION?: string;
  PERMANENT_TEMPORARY?: string;
  
  // 運転手の状況
  DAYS_OFF_IN_THE_PAST_MONTH_BEFORE_ACCIDENT?: number;
  WORKING_HOURS_UNTIL_ACCIDENT?: number;
  DISTANCE_DRIVEN_UNTIL_ACCIDENT?: number;
  DAYS_WORKED_SINCE_LAST_DAY_OFF?: number;
  TOTAL_DISTANCE_DRIVEN_SINCE_LAST_DAY_OFF?: number;
  
  // 損害・被害統計
  DAMAGE_LEVEL?: string;
  SEATBELT_USAGE?: boolean;
  NUMBER_OF_ACCIDENTS?: number;
  NUMBER_OF_VIOLATIONS?: number;
  NUMBER_OF_DEATHS?: number;
  NUMBER_OF_DEATHS_PASSENGERS?: number;
  NUMBER_OF_SERIOUS_INJURIES?: number;
  NUMBER_OF_SERIOUS_INJURIES_PASSENGERS?: number;
  NUMBER_OF_MINOR_INJURIES?: number;
  NUMBER_OF_MINOR_INJURIES_PASSENGERS?: number;
  
  // 車両履歴
  TOTAL_DRIVEN_DISTANCE?: number;
  MODIFICATION_CONTENTS?: string;
  DATE_OF_MODIFICATION?: string;
  BROKEN_OR_DETACHED_PART_NAME?: string;
  DRIVEN_DISTANCE_SINCE_INSTALLATION?: number;
  MODIFICATION_DATE_1?: string;
  MODIFICATION_DATE_2?: string;
  MODIFICATION_DATE_3?: string;
  FATIGUE_OR_SUDDEN_BREAKAGE_TYPE?: string;
  
  // レポート情報
  TITLE?: string;
  DESCRIPTION?: string;
  GEOG?: string; // PostGIS geography column
  
  // 計算フィールド
  distance_meters?: number;
}

/**
 * 古い型定義との互換性のための型エイリアス
 * @deprecated 新しいコードではAccidentReportを使用してください
 */
export interface LegacyAccidentReport {
  id: string;
  
  // 基本情報 (6項目)
  occurrenceDateTime: string;
  weather?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  vehicleId?: string;
  
  // 事故詳細 (6項目)
  accidentTypeCategory?: string;
  orderOfAccidentOccurrence?: string;
  fallHeight?: number;
  waterDepth?: number;
  collisionCondition?: string;
  accidentLocation?: string;
  
  // 車両情報 (8項目)
  vehicle1ModelName?: string;
  vehicle1ModelType?: string;
  vehicle1BodyType?: string;
  vehicle1YearOfRegistration?: number;
  vehicle1SeatingCapacity?: number;
  vehicle1LoadAtTime?: number;
  vehicle1MaxLoadCapacity?: number;
  cargoContents?: string;
  
  // 危険物情報 (2項目)
  transportOfHazardousMaterial?: boolean;
  typeOfHazardousMaterial?: string;
  
  // 道路環境 (6項目)
  roadType?: string;
  roadSurfaceCondition?: string;
  warningSignsInstalled?: boolean;
  speedLimitOnRoad?: number;
  railwayCrossingCondition?: string;
  
  // リスク認識・行動 (4項目)
  speedAtRiskRecognition?: number;
  distanceAtRiskRecognition?: number;
  slipDistance?: number;
  vehicleBehaviorAtAccident?: string;
  
  // 負傷・損害情報 (4項目)
  conditionOfInjuredOrDeceased?: string;
  faultLocation?: string;
  permanentTemporary?: string;
  damageLevel?: string;
  
  // 運転者情報 (6項目)
  daysOffInPastMonth?: number;
  workingHoursUntilAccident?: number;
  distanceDrivenUntilAccident?: number;
  daysWorkedSinceLastDayOff?: number;
  totalDistanceDrivenSinceLastDayOff?: number;
  seatbeltUsage?: boolean;
  
  // 統計情報 (8項目)
  numberOfAccidents?: number;
  numberOfViolations?: number;
  numberOfDeaths?: number;
  numberOfDeathsPassengers?: number;
  numberOfSeriousInjuries?: number;
  numberOfSeriousInjuriesPassengers?: number;
  numberOfMinorInjuries?: number;
  numberOfMinorInjuriesPassengers?: number;
  
  // 総走行距離・改造情報 (8項目)
  totalDrivenDistance?: number;
  modificationContents?: string;
  dateOfModification?: string;
  brokenOrDetachedPartName?: string;
  drivenDistanceSinceInstallation?: number;
  modificationDate1?: string;
  modificationDate2?: string;
  modificationDate3?: string;
  
  // その他 (3項目)
  fatigueOrSuddenBreakageType?: string;
  title?: string;
  description?: string;
  
  // システムフィールド
  createdAt: string;
  updatedAt: string;
}

// フィルタリング用の型定義（実際のスキーマに基づく）
export interface AccidentReportFilter {
  // 日付範囲
  startDate?: string;
  endDate?: string;
  
  // 基本フィルター（実際のカラム名を使用）
  WEATHER?: string;
  LOCATION?: string;
  ACCIDENT_TYPE_CATEGORY?: string;
  DAMAGE_LEVEL?: string;
  
  // 車両フィルター
  VEHICLE_1_MODEL_TYPE?: string;
  VEHICLE_1_BODY_TYPE?: string;
  VEHICLE_1_MODEL_NAME?: string;
  
  // 道路環境フィルター
  ROAD_TYPE?: string;
  ROAD_SURFACE_CONDITION?: string;
  
  // 被害フィルター
  hasDeaths?: boolean;
  hasSeriousInjuries?: boolean;
  hasMinorInjuries?: boolean;
  
  // 地理的フィルター（PostGIS使用）
  boundingBox?: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  };
  
  // ルート周辺検索
  routeLine?: string;
  distanceMeters?: number;
  
  // 検索クエリ
  searchQuery?: string;
}

// ソート用の型定義
export interface AccidentReportSort {
  field: keyof AccidentReport;
  direction: 'asc' | 'desc';
}

// ページネーション用の型定義
export interface AccidentReportPagination {
  page: number;
  limit: number;
  total?: number;
}

// リスト表示用のレスポンス型
export interface AccidentReportListResponse {
  items: AccidentReport[];
  pagination: AccidentReportPagination & { total: number };
}

// 統計情報用の型定義
export interface AccidentReportStats {
  totalReports: number;
  totalDeaths: number;
  totalSeriousInjuries: number;
  totalMinorInjuries: number;
  mostCommonAccidentType?: string;
  mostCommonWeather?: string;
  mostCommonRoadType?: string;
}

// 事故種別の定数
export const ACCIDENT_CATEGORIES = [
  '追突',
  '出会い頭',
  '左折時',
  '右折時',
  '横断中',
  '単独',
  '転落・転倒',
  'その他',
] as const;

export type AccidentCategory = typeof ACCIDENT_CATEGORIES[number];

// 天候の定数
export const WEATHER_CONDITIONS = [
  '晴れ',
  '曇り',
  '雨',
  '雪',
  '霧',
  'その他',
] as const;

export type WeatherCondition = typeof WEATHER_CONDITIONS[number];

// 損害レベルの定数
export const DAMAGE_LEVELS = [
  '軽微',
  '中程度',
  '重大',
  '全損',
] as const;

export type DamageLevel = typeof DAMAGE_LEVELS[number];

// 道路種別の定数
export const ROAD_TYPES = [
  '高速道路',
  '国道',
  '県道',
  '市道',
  '私道',
  'その他',
] as const;

export type RoadType = typeof ROAD_TYPES[number];