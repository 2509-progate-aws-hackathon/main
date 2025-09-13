// 交通事故レポート関連の型定義
// 58個のCSVカラムに対応したTypeScript型定義

export interface AccidentReport {
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
  orderOfAccidentOccurrence?: number;
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

// フィルタリング用の型定義
export interface AccidentReportFilter {
  // 日付範囲
  startDate?: string;
  endDate?: string;
  
  // 基本フィルター
  weather?: string;
  location?: string;
  accidentTypeCategory?: string;
  damageLevel?: string;
  
  // 地理的フィルター
  minLatitude?: number;
  maxLatitude?: number;
  minLongitude?: number;
  maxLongitude?: number;
  
  // 車両フィルター
  vehicle1ModelType?: string;
  vehicle1BodyType?: string;
  
  // 道路環境フィルター
  roadType?: string;
  roadSurfaceCondition?: string;
  
  // 被害フィルター
  hasDeaths?: boolean;
  hasSeriousInjuries?: boolean;
  
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