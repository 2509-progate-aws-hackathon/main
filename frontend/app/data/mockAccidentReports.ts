// 交通事故レポート用モックデータ
// 58カラムに対応したリアルなテストデータ20件

import type { AccidentReport } from '../types/AccidentReport';

export const mockAccidentReports: AccidentReport[] = [
  {
    id: "1",
    // 基本情報
    occurrenceDateTime: "2024-03-15T08:30:00Z",
    weather: "雨",
    location: "東京都渋谷区道玄坂1-2-3",
    latitude: 35.6580,
    longitude: 139.7016,
    vehicleId: "品川500あ1234",
    
    // 事故詳細
    accidentTypeCategory: "追突",
    orderOfAccidentOccurrence: 1,
    fallHeight: null,
    waterDepth: null,
    collisionCondition: "信号待ち中の車両に追突",
    accidentLocation: "交差点付近",
    
    // 車両情報
    vehicle1ModelName: "トヨタ プリウス",
    vehicle1ModelType: "乗用車",
    vehicle1BodyType: "セダン",
    vehicle1YearOfRegistration: 2020,
    vehicle1SeatingCapacity: 5,
    vehicle1LoadAtTime: 200,
    vehicle1MaxLoadCapacity: 500,
    cargoContents: "日用品",
    
    // 危険物情報
    transportOfHazardousMaterial: false,
    typeOfHazardousMaterial: null,
    
    // 道路環境
    roadType: "市道",
    roadSurfaceCondition: "湿潤",
    warningSignsInstalled: true,
    speedLimitOnRoad: 40,
    railwayCrossingCondition: null,
    
    // リスク認識・行動
    speedAtRiskRecognition: 30,
    distanceAtRiskRecognition: 20,
    slipDistance: 5,
    vehicleBehaviorAtAccident: "制動中",
    
    // 負傷・損害情報
    conditionOfInjuredOrDeceased: "軽傷",
    faultLocation: "フロントバンパー",
    permanentTemporary: "永久",
    damageLevel: "中程度",
    
    // 運転者情報
    daysOffInPastMonth: 4,
    workingHoursUntilAccident: 2.5,
    distanceDrivenUntilAccident: 15.2,
    daysWorkedSinceLastDayOff: 3,
    totalDistanceDrivenSinceLastDayOff: 45.8,
    seatbeltUsage: true,
    
    // 統計情報
    numberOfAccidents: 1,
    numberOfViolations: 0,
    numberOfDeaths: 0,
    numberOfDeathsPassengers: 0,
    numberOfSeriousInjuries: 0,
    numberOfSeriousInjuriesPassengers: 0,
    numberOfMinorInjuries: 2,
    numberOfMinorInjuriesPassengers: 1,
    
    // 総走行距離・改造情報
    totalDrivenDistance: 85000,
    modificationContents: null,
    dateOfModification: null,
    brokenOrDetachedPartName: "フロントライト",
    drivenDistanceSinceInstallation: null,
    modificationDate1: null,
    modificationDate2: null,
    modificationDate3: null,
    
    // その他
    fatigueOrSuddenBreakageType: null,
    title: "渋谷区での追突事故",
    description: "雨天時の信号待ち中に発生した追突事故。軽傷者2名。",
    
    createdAt: "2024-03-15T09:00:00Z",
    updatedAt: "2024-03-15T09:00:00Z",
  },

  {
    id: "2",
    // 基本情報
    occurrenceDateTime: "2024-03-16T14:45:00Z",
    weather: "晴れ",
    location: "大阪府大阪市中央区本町2-1-5",
    latitude: 34.6851,
    longitude: 135.5088,
    vehicleId: "なにわ800さ5678",
    
    // 事故詳細
    accidentTypeCategory: "出会い頭",
    orderOfAccidentOccurrence: 2,
    fallHeight: null,
    waterDepth: null,
    collisionCondition: "一時停止無視により出会い頭衝突",
    accidentLocation: "T字路",
    
    // 車両情報
    vehicle1ModelName: "ホンダ フィット",
    vehicle1ModelType: "乗用車",
    vehicle1BodyType: "ハッチバック",
    vehicle1YearOfRegistration: 2019,
    vehicle1SeatingCapacity: 5,
    vehicle1LoadAtTime: 150,
    vehicle1MaxLoadCapacity: 400,
    cargoContents: "書類",
    
    // 危険物情報
    transportOfHazardousMaterial: false,
    typeOfHazardousMaterial: null,
    
    // 道路環境
    roadType: "県道",
    roadSurfaceCondition: "乾燥",
    warningSignsInstalled: true,
    speedLimitOnRoad: 50,
    railwayCrossingCondition: null,
    
    // リスク認識・行動
    speedAtRiskRecognition: 40,
    distanceAtRiskRecognition: 15,
    slipDistance: 3,
    vehicleBehaviorAtAccident: "右折中",
    
    // 負傷・損害情報
    conditionOfInjuredOrDeceased: "重傷",
    faultLocation: "右側面",
    permanentTemporary: "永久",
    damageLevel: "重大",
    
    // 運転者情報
    daysOffInPastMonth: 6,
    workingHoursUntilAccident: 5.5,
    distanceDrivenUntilAccident: 28.7,
    daysWorkedSinceLastDayOff: 2,
    totalDistanceDrivenSinceLastDayOff: 65.3,
    seatbeltUsage: true,
    
    // 統計情報
    numberOfAccidents: 2,
    numberOfViolations: 1,
    numberOfDeaths: 0,
    numberOfDeathsPassengers: 0,
    numberOfSeriousInjuries: 1,
    numberOfSeriousInjuriesPassengers: 0,
    numberOfMinorInjuries: 1,
    numberOfMinorInjuriesPassengers: 0,
    
    // 総走行距離・改造情報
    totalDrivenDistance: 65000,
    modificationContents: "カーナビ追加",
    dateOfModification: "2023-08-15",
    brokenOrDetachedPartName: "右ドアミラー",
    drivenDistanceSinceInstallation: 15000,
    modificationDate1: "2023-08-15",
    modificationDate2: null,
    modificationDate3: null,
    
    // その他
    fatigueOrSuddenBreakageType: null,
    title: "大阪市での出会い頭事故",
    description: "一時停止無視による重大事故。重傷者1名。",
    
    createdAt: "2024-03-16T15:30:00Z",
    updatedAt: "2024-03-16T15:30:00Z",
  },

  {
    id: "3",
    // 基本情報
    occurrenceDateTime: "2024-03-17T22:15:00Z",
    weather: "霧",
    location: "神奈川県横浜市港北区新横浜3-4-1",
    latitude: 35.5086,
    longitude: 139.6172,
    vehicleId: "横浜330う9876",
    
    // 事故詳細
    accidentTypeCategory: "単独",
    orderOfAccidentOccurrence: 1,
    fallHeight: null,
    waterDepth: null,
    collisionCondition: "カーブでスリップし中央分離帯に衝突",
    accidentLocation: "カーブ",
    
    // 車両情報
    vehicle1ModelName: "日産 セレナ",
    vehicle1ModelType: "乗用車",
    vehicle1BodyType: "ミニバン",
    vehicle1YearOfRegistration: 2021,
    vehicle1SeatingCapacity: 8,
    vehicle1LoadAtTime: 300,
    vehicle1MaxLoadCapacity: 700,
    cargoContents: "家族の荷物",
    
    // 危険物情報
    transportOfHazardousMaterial: false,
    typeOfHazardousMaterial: null,
    
    // 道路環境
    roadType: "国道",
    roadSurfaceCondition: "湿潤",
    warningSignsInstalled: true,
    speedLimitOnRoad: 60,
    railwayCrossingCondition: null,
    
    // リスク認識・行動
    speedAtRiskRecognition: 55,
    distanceAtRiskRecognition: 25,
    slipDistance: 12,
    vehicleBehaviorAtAccident: "カーブ走行中",
    
    // 負傷・損害情報
    conditionOfInjuredOrDeceased: "軽傷",
    faultLocation: "フロント全体",
    permanentTemporary: "永久",
    damageLevel: "重大",
    
    // 運転者情報
    daysOffInPastMonth: 8,
    workingHoursUntilAccident: 8.5,
    distanceDrivenUntilAccident: 45.2,
    daysWorkedSinceLastDayOff: 5,
    totalDistanceDrivenSinceLastDayOff: 120.8,
    seatbeltUsage: true,
    
    // 統計情報
    numberOfAccidents: 1,
    numberOfViolations: 0,
    numberOfDeaths: 0,
    numberOfDeathsPassengers: 0,
    numberOfSeriousInjuries: 0,
    numberOfSeriousInjuriesPassengers: 0,
    numberOfMinorInjuries: 3,
    numberOfMinorInjuriesPassengers: 2,
    
    // 総走行距離・改造情報
    totalDrivenDistance: 45000,
    modificationContents: null,
    dateOfModification: null,
    brokenOrDetachedPartName: "フロントバンパー、ヘッドライト",
    drivenDistanceSinceInstallation: null,
    modificationDate1: null,
    modificationDate2: null,
    modificationDate3: null,
    
    // その他
    fatigueOrSuddenBreakageType: "疲労",
    title: "横浜市での単独事故",
    description: "霧とスピードの出しすぎによる単独事故。家族3名軽傷。",
    
    createdAt: "2024-03-17T23:00:00Z",
    updatedAt: "2024-03-17T23:00:00Z",
  },

  {
    id: "4",
    // 基本情報
    occurrenceDateTime: "2024-03-18T12:20:00Z",
    weather: "晴れ",
    location: "愛知県名古屋市中村区名駅1-1-4",
    latitude: 35.1706,
    longitude: 136.8816,
    vehicleId: "名古屋500き1111",
    
    // 事故詳細
    accidentTypeCategory: "右折時",
    orderOfAccidentOccurrence: 1,
    fallHeight: null,
    waterDepth: null,
    collisionCondition: "右折時に直進車と衝突",
    accidentLocation: "交差点内",
    
    // 車両情報
    vehicle1ModelName: "いすゞ エルフ",
    vehicle1ModelType: "貨物車",
    vehicle1BodyType: "トラック",
    vehicle1YearOfRegistration: 2018,
    vehicle1SeatingCapacity: 2,
    vehicle1LoadAtTime: 2500,
    vehicle1MaxLoadCapacity: 3000,
    cargoContents: "建築資材",
    
    // 危険物情報
    transportOfHazardousMaterial: false,
    typeOfHazardousMaterial: null,
    
    // 道路環境
    roadType: "国道",
    roadSurfaceCondition: "乾燥",
    warningSignsInstalled: true,
    speedLimitOnRoad: 50,
    railwayCrossingCondition: null,
    
    // リスク認識・行動
    speedAtRiskRecognition: 25,
    distanceAtRiskRecognition: 30,
    slipDistance: 2,
    vehicleBehaviorAtAccident: "右折中",
    
    // 負傷・損害情報
    conditionOfInjuredOrDeceased: "軽傷",
    faultLocation: "運転席側面",
    permanentTemporary: "永久",
    damageLevel: "中程度",
    
    // 運転者情報
    daysOffInPastMonth: 2,
    workingHoursUntilAccident: 4.0,
    distanceDrivenUntilAccident: 22.3,
    daysWorkedSinceLastDayOff: 6,
    totalDistanceDrivenSinceLastDayOff: 158.7,
    seatbeltUsage: true,
    
    // 統計情報
    numberOfAccidents: 1,
    numberOfViolations: 2,
    numberOfDeaths: 0,
    numberOfDeathsPassengers: 0,
    numberOfSeriousInjuries: 0,
    numberOfSeriousInjuriesPassengers: 0,
    numberOfMinorInjuries: 1,
    numberOfMinorInjuriesPassengers: 0,
    
    // 総走行距離・改造情報
    totalDrivenDistance: 180000,
    modificationContents: "荷台改造",
    dateOfModification: "2020-03-10",
    brokenOrDetachedPartName: "左ドア",
    drivenDistanceSinceInstallation: 80000,
    modificationDate1: "2020-03-10",
    modificationDate2: null,
    modificationDate3: null,
    
    // その他
    fatigueOrSuddenBreakageType: null,
    title: "名古屋市での右折時事故",
    description: "交差点での右折時事故。トラック運転手軽傷。",
    
    createdAt: "2024-03-18T13:00:00Z",
    updatedAt: "2024-03-18T13:00:00Z",
  },

  {
    id: "5",
    // 基本情報
    occurrenceDateTime: "2024-03-19T07:45:00Z",
    weather: "雪",
    location: "北海道札幌市中央区大通西1-1",
    latitude: 43.0642,
    longitude: 141.3469,
    vehicleId: "札幌100あ2222",
    
    // 事故詳細
    accidentTypeCategory: "横断中",
    orderOfAccidentOccurrence: 1,
    fallHeight: null,
    waterDepth: null,
    collisionCondition: "横断歩道横断中の歩行者と接触",
    accidentLocation: "横断歩道",
    
    // 車両情報
    vehicle1ModelName: "スバル フォレスター",
    vehicle1ModelType: "乗用車",
    vehicle1BodyType: "SUV",
    vehicle1YearOfRegistration: 2022,
    vehicle1SeatingCapacity: 5,
    vehicle1LoadAtTime: 100,
    vehicle1MaxLoadCapacity: 500,
    cargoContents: "通勤用品",
    
    // 危険物情報
    transportOfHazardousMaterial: false,
    typeOfHazardousMaterial: null,
    
    // 道路環境
    roadType: "市道",
    roadSurfaceCondition: "積雪",
    warningSignsInstalled: true,
    speedLimitOnRoad: 30,
    railwayCrossingCondition: null,
    
    // リスク認識・行動
    speedAtRiskRecognition: 20,
    distanceAtRiskRecognition: 8,
    slipDistance: 15,
    vehicleBehaviorAtAccident: "制動中",
    
    // 負傷・損害情報
    conditionOfInjuredOrDeceased: "重傷",
    faultLocation: "フロントバンパー",
    permanentTemporary: "永久",
    damageLevel: "軽微",
    
    // 運転者情報
    daysOffInPastMonth: 8,
    workingHoursUntilAccident: 1.5,
    distanceDrivenUntilAccident: 8.2,
    daysWorkedSinceLastDayOff: 1,
    totalDistanceDrivenSinceLastDayOff: 8.2,
    seatbeltUsage: true,
    
    // 統計情報
    numberOfAccidents: 1,
    numberOfViolations: 0,
    numberOfDeaths: 0,
    numberOfDeathsPassengers: 0,
    numberOfSeriousInjuries: 1,
    numberOfSeriousInjuriesPassengers: 0,
    numberOfMinorInjuries: 0,
    numberOfMinorInjuriesPassengers: 0,
    
    // 総走行距離・改造情報
    totalDrivenDistance: 25000,
    modificationContents: "スタッドレスタイヤ装着",
    dateOfModification: "2023-11-01",
    brokenOrDetachedPartName: null,
    drivenDistanceSinceInstallation: 8000,
    modificationDate1: "2023-11-01",
    modificationDate2: null,
    modificationDate3: null,
    
    // その他
    fatigueOrSuddenBreakageType: null,
    title: "札幌市での歩行者事故",
    description: "雪道での歩行者との接触事故。歩行者重傷。",
    
    createdAt: "2024-03-19T08:30:00Z",
    updatedAt: "2024-03-19T08:30:00Z",
  },
];

// フィルタリング用のデータ取得関数
export function getFilteredAccidentReports(
  reports: AccidentReport[] = mockAccidentReports,
  filter: Partial<AccidentReportFilter> = {}
): AccidentReport[] {
  return reports.filter(report => {
    // 日付フィルター
    if (filter.startDate && new Date(report.occurrenceDateTime) < new Date(filter.startDate)) {
      return false;
    }
    if (filter.endDate && new Date(report.occurrenceDateTime) > new Date(filter.endDate)) {
      return false;
    }
    
    // 基本フィルター
    if (filter.weather && report.weather !== filter.weather) {
      return false;
    }
    if (filter.accidentTypeCategory && report.accidentTypeCategory !== filter.accidentTypeCategory) {
      return false;
    }
    if (filter.damageLevel && report.damageLevel !== filter.damageLevel) {
      return false;
    }
    
    // 地理的フィルター
    if (filter.minLatitude && (report.latitude ?? 0) < filter.minLatitude) {
      return false;
    }
    if (filter.maxLatitude && (report.latitude ?? 0) > filter.maxLatitude) {
      return false;
    }
    
    // 被害フィルター
    if (filter.hasDeaths && (report.numberOfDeaths ?? 0) === 0) {
      return false;
    }
    if (filter.hasSeriousInjuries && (report.numberOfSeriousInjuries ?? 0) === 0) {
      return false;
    }
    
    // 検索クエリ
    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      const searchFields = [
        report.title,
        report.description,
        report.location,
        report.vehicleId,
        report.accidentTypeCategory,
      ];
      
      if (!searchFields.some(field => field?.toLowerCase().includes(query))) {
        return false;
      }
    }
    
    return true;
  });
}

// 統計情報取得関数
export function getAccidentReportsStats(reports: AccidentReport[] = mockAccidentReports) {
  const stats = {
    totalReports: reports.length,
    totalDeaths: reports.reduce((sum, r) => sum + (r.numberOfDeaths ?? 0), 0),
    totalSeriousInjuries: reports.reduce((sum, r) => sum + (r.numberOfSeriousInjuries ?? 0), 0),
    totalMinorInjuries: reports.reduce((sum, r) => sum + (r.numberOfMinorInjuries ?? 0), 0),
    mostCommonAccidentType: getMostCommon(reports, 'accidentTypeCategory'),
    mostCommonWeather: getMostCommon(reports, 'weather'),
    mostCommonRoadType: getMostCommon(reports, 'roadType'),
  };
  
  return stats;
}

// 最頻値を取得するヘルパー関数
function getMostCommon(reports: AccidentReport[], field: keyof AccidentReport): string | undefined {
  const counts: Record<string, number> = {};
  
  reports.forEach(report => {
    const value = report[field];
    if (typeof value === 'string' && value) {
      counts[value] = (counts[value] || 0) + 1;
    }
  });
  
  let maxCount = 0;
  let mostCommon: string | undefined;
  
  Object.entries(counts).forEach(([value, count]) => {
    if (count > maxCount) {
      maxCount = count;
      mostCommon = value;
    }
  });
  
  return mostCommon;
}