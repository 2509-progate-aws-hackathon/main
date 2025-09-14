// 交通事故レポート用モックデータ
// 58カラムに対応したリアルなテストデータ20件

import type { AccidentReport, AccidentReportFilter } from '../types/AccidentReport';

export const mockAccidentReports: AccidentReport[] = [
  // --- testdata.csv 1件目 ---
  {
    id: "0",
    occurrenceDateTime: "2005-10-07T06:55:00+09:00",
    weather: "晴れ",
    location: "小山市大塚町",
    latitude: 36.31381,
    longitude: 139.78748,
    vehicleId: "300000001",
    accidentTypeCategory: "その他",
    orderOfAccidentOccurrence: "その他",
    fallHeight: 0.0,
    waterDepth: 0.0,
    collisionCondition: "",
    vehicle1ModelName: "いすゞ",
    vehicle1ModelType: "KC-LV782R1",
    vehicle1BodyType: "リヤーエンジン",
    vehicle1YearOfRegistration: 1999,
    vehicle1SeatingCapacity: 55,
    vehicle1LoadAtTime: 2.0,
    vehicle1MaxLoadCapacity: 0.0,
    cargoContents: "",
    transportOfHazardousMaterial: false,
    typeOfHazardousMaterial: "",
    roadType: "道路(その他)",
    roadSurfaceCondition: "乾",
    warningSignsInstalled: true,
    speedLimitOnRoad: 50.0,
    railwayCrossingCondition: "",
    speedAtRiskRecognition: 40.0,
    distanceAtRiskRecognition: -1.0,
    slipDistance: -1.0,
    vehicleBehaviorAtAccident: "直進(定速)",
    accidentLocation: "車道",
    conditionOfInjuredOrDeceased: "",
    faultLocation: "その他",
    permanentTemporary: "本務",
    daysOffInPastMonth: 7.0,
    workingHoursUntilAccident: 0.5,
    distanceDrivenUntilAccident: 15.0,
    daysWorkedSinceLastDayOff: 1.0,
    totalDistanceDrivenSinceLastDayOff: 15.0,
    damageLevel: "無傷",
    seatbeltUsage: true,
    numberOfAccidents: 1,
    numberOfViolations: 1,
    numberOfDeaths: 0,
    numberOfDeathsPassengers: 0,
    numberOfSeriousInjuries: 0,
    numberOfSeriousInjuriesPassengers: 0,
    numberOfMinorInjuries: 0,
    numberOfMinorInjuriesPassengers: 0,
    totalDrivenDistance: 0.0,
    modificationContents: "",
    dateOfModification: "",
    brokenOrDetachedPartName: "",
    drivenDistanceSinceInstallation: 0.0,
    modificationDate1: "",
    modificationDate2: "",
    modificationDate3: "",
    fatigueOrSuddenBreakageType: "",
    title: "小山市大塚町での交通事故",
    description: "2005年10月7日6時55分、小山市大塚町で交通事故が発生しました。天候は晴れで、事故の類型は「その他」、発生形態も「その他」でした。この事故では死者はいませんが、負傷者の情報は不明です。詳細な状況については、さらなる調査が必要と思われます。",
    createdAt: "2005-10-07T06:55:00+09:00",
    updatedAt: "2005-10-07T06:55:00+09:00",
  },
  // --- testdata.csv 2件目 ---
  {
    id: "1",
    occurrenceDateTime: "2008-09-13T01:50:00+09:00",
    weather: "雨",
    location: "大津市",
    latitude: 35.01836,
    longitude: 135.85466,
    vehicleId: "300000002",
    accidentTypeCategory: "その他",
    orderOfAccidentOccurrence: "車両故障、その他",
    fallHeight: 0.0,
    waterDepth: 0.0,
    collisionCondition: "",
    vehicle1ModelName: "ＮＴＫ",
    vehicle1ModelType: "KC-CYM50V1W",
    vehicle1BodyType: "キャブオーバ",
    vehicle1YearOfRegistration: 1997,
    vehicle1SeatingCapacity: 2,
    vehicle1LoadAtTime: 1.0,
    vehicle1MaxLoadCapacity: 13600.0,
    cargoContents: "",
    transportOfHazardousMaterial: true,
    typeOfHazardousMaterial: "危険物",
    roadType: "道路(その他)",
    roadSurfaceCondition: "湿",
    warningSignsInstalled: true,
    speedLimitOnRoad: 80.0,
    railwayCrossingCondition: "",
    speedAtRiskRecognition: 0.0,
    distanceAtRiskRecognition: 0.0,
    slipDistance: 0.0,
    vehicleBehaviorAtAccident: "停車",
    accidentLocation: "路肩",
    conditionOfInjuredOrDeceased: "",
    faultLocation: "タイヤ",
    permanentTemporary: "本務",
    daysOffInPastMonth: 0.0,
    workingHoursUntilAccident: 6.5,
    distanceDrivenUntilAccident: 159.0,
    daysWorkedSinceLastDayOff: 4.0,
    totalDistanceDrivenSinceLastDayOff: 1244.0,
    damageLevel: "",
    seatbeltUsage: true,
    numberOfAccidents: 1,
    numberOfViolations: 1,
    numberOfDeaths: 0,
    numberOfDeathsPassengers: 0,
    numberOfSeriousInjuries: 0,
    numberOfSeriousInjuriesPassengers: 0,
    numberOfMinorInjuries: 0,
    numberOfMinorInjuriesPassengers: 0,
    totalDrivenDistance: 0.0,
    modificationContents: "",
    dateOfModification: "",
    brokenOrDetachedPartName: "",
    drivenDistanceSinceInstallation: 0.0,
    modificationDate1: "",
    modificationDate2: "",
    modificationDate3: "",
    fatigueOrSuddenBreakageType: "",
    title: "大津市での車両故障事故",
    description: "2008年9月13日1時50分、大津市で発生した事故です。天候は雨で、事故類型はその他、発生形態は車両故障とその他でした。死者はいませんが、負傷者数は不明です。",
    createdAt: "2008-09-13T01:50:00+09:00",
    updatedAt: "2008-09-13T01:50:00+09:00",
  },
  // --- testdata.csv 3件目 ---
  {
    id: "2",
    occurrenceDateTime: "2021-01-18T06:00:00+09:00",
    weather: "晴れ",
    location: "熊谷市樋春１０４　県道３８５号線",
    latitude: 36.13407,
    longitude: 139.3515,
    vehicleId: "300000003",
    accidentTypeCategory: "その他",
    orderOfAccidentOccurrence: "車両故障、その他、衝突",
    collisionCondition: "接触",
    vehicle1ModelName: "いすゞ",
    vehicle1ModelType: "QKG-CYL77A",
    vehicle1BodyType: "バン",
    vehicle1YearOfRegistration: 2012,
    vehicle1SeatingCapacity: 2,
    vehicle1LoadAtTime: 1.0,
    vehicle1MaxLoadCapacity: 13400.0,
    cargoContents: "",
    transportOfHazardousMaterial: false,
    typeOfHazardousMaterial: "",
    roadType: "道路(その他)",
    roadSurfaceCondition: "乾",
    warningSignsInstalled: false,
    speedLimitOnRoad: 50.0,
    railwayCrossingCondition: "",
    speedAtRiskRecognition: 5.0,
    distanceAtRiskRecognition: 5.0,
    slipDistance: 0.0,
    vehicleBehaviorAtAccident: "左折",
    accidentLocation: "交差点",
    conditionOfInjuredOrDeceased: "",
    faultLocation: "タイヤ",
    permanentTemporary: "本務",
    daysOffInPastMonth: 10.0,
    workingHoursUntilAccident: 0.5,
    distanceDrivenUntilAccident: 3.0,
    daysWorkedSinceLastDayOff: 1.0,
    totalDistanceDrivenSinceLastDayOff: 3.0,
    damageLevel: "",
    seatbeltUsage: true,
    numberOfAccidents: 1,
    numberOfViolations: 1,
    numberOfDeaths: 0,
    numberOfDeathsPassengers: 0,
    numberOfSeriousInjuries: 0,
    numberOfSeriousInjuriesPassengers: 0,
    numberOfMinorInjuries: 0,
    numberOfMinorInjuriesPassengers: 0,
    totalDrivenDistance: 3378.0,
    modificationContents: "",
    dateOfModification: "2020-12-10",
    brokenOrDetachedPartName: "タイヤホイル２本（左後輪前側）",
    drivenDistanceSinceInstallation: 3378.0,
    modificationDate1: "2020-12-10",
    modificationDate2: "",
    modificationDate3: "",
    fatigueOrSuddenBreakageType: "",
    title: "熊谷市での車両故障事故",
    description: "2021年1月18日6時に、熊谷市樋春104の県道385号線で車両故障事故が発生しました。事故の形態は車両故障、その他、衝突でした。天候は晴れでしたが、詳細な被害状況は不明です。",
    createdAt: "2021-01-18T06:00:00+09:00",
    updatedAt: "2021-01-18T06:00:00+09:00",
  },
  // --- testdata.csv 4件目 ---
  {
    id: "3",
    occurrenceDateTime: "2022-12-16T01:30:00+09:00",
    weather: "晴れ",
    location: "塩尻市広丘野村１７８７−１４付近",
    latitude: 36.13825,
    longitude: 137.95189,
    vehicleId: "300000004",
    accidentTypeCategory: "その他",
    orderOfAccidentOccurrence: "車両故障、その他",
    collisionCondition: "",
    vehicle1ModelName: "いすゞ",
    vehicle1ModelType: "2PG-CYJ77C",
    vehicle1BodyType: "バン",
    vehicle1YearOfRegistration: 2019,
    vehicle1SeatingCapacity: 2,
    vehicle1LoadAtTime: 1.0,
    vehicle1MaxLoadCapacity: 13300.0,
    cargoContents: "その他",
    transportOfHazardousMaterial: false,
    typeOfHazardousMaterial: "",
    roadType: "道路(その他)",
    roadSurfaceCondition: "乾",
    warningSignsInstalled: false,
    speedLimitOnRoad: 50.0,
    railwayCrossingCondition: "",
    speedAtRiskRecognition: 50.0,
    distanceAtRiskRecognition: 0.0,
    slipDistance: 0.0,
    vehicleBehaviorAtAccident: "直進(定速)",
    accidentLocation: "車道",
    conditionOfInjuredOrDeceased: "",
    faultLocation: "タイヤ",
    permanentTemporary: "本務",
    daysOffInPastMonth: 8.0,
    workingHoursUntilAccident: 3.75,
    distanceDrivenUntilAccident: 188.0,
    daysWorkedSinceLastDayOff: 4.0,
    totalDistanceDrivenSinceLastDayOff: 1560.0,
    damageLevel: "",
    seatbeltUsage: true,
    numberOfAccidents: 1,
    numberOfViolations: 2,
    numberOfDeaths: 0,
    numberOfDeathsPassengers: 0,
    numberOfSeriousInjuries: 0,
    numberOfSeriousInjuriesPassengers: 0,
    numberOfMinorInjuries: 0,
    numberOfMinorInjuriesPassengers: 0,
    totalDrivenDistance: 537755.0,
    modificationContents: "",
    dateOfModification: "2022-12-12",
    brokenOrDetachedPartName: "左４軸タイヤホイール",
    drivenDistanceSinceInstallation: 1560.0,
    modificationDate1: "2022-12-12",
    modificationDate2: "2022-12-13",
    modificationDate3: "",
    fatigueOrSuddenBreakageType: "",
    title: "塩尻市での車両故障事故",
    description: "2022年12月16日1時30分頃、塩尻市広丘野村1787-14付近で車両故障事故が発生しました。天候は晴れでしたが、事故の詳細な発生形態は不明です。事故による死傷者はいないと報告されています。",
    createdAt: "2022-12-16T01:30:00+09:00",
    updatedAt: "2022-12-16T01:30:00+09:00",
  },
  // --- testdata.csv 5件目 ---
  {
    id: "4",
    occurrenceDateTime: "2004-07-19T11:10:00+09:00",
    weather: "晴れ",
    location: "下高井郡山ノ内町",
    latitude: 36.74461,
    longitude: 138.41263,
    vehicleId: "300000005",
    accidentTypeCategory: "その他",
    orderOfAccidentOccurrence: "その他",
    fallHeight: 0.0,
    waterDepth: 0.0,
    collisionCondition: "",
    vehicle1ModelName: "三菱",
    vehicle1ModelType: "P-MS725N",
    vehicle1BodyType: "リヤーエンジン",
    vehicle1YearOfRegistration: 1988,
    vehicle1SeatingCapacity: 57.0,
    vehicle1LoadAtTime: 40.0,
    vehicle1MaxLoadCapacity: 0.0,
    cargoContents: "",
    transportOfHazardousMaterial: false,
    typeOfHazardousMaterial: "",
    roadType: "道路(その他)",
    roadSurfaceCondition: "乾",
    warningSignsInstalled: false,
    speedLimitOnRoad: 40.0,
    railwayCrossingCondition: "",
    speedAtRiskRecognition: 30.0,
    distanceAtRiskRecognition: -1.0,
    slipDistance: -1.0,
    vehicleBehaviorAtAccident: "直進(減速)",
    accidentLocation: "車道",
    conditionOfInjuredOrDeceased: "",
    faultLocation: "制動装置",
    permanentTemporary: "本務",
    daysOffInPastMonth: 11.0,
    workingHoursUntilAccident: 3.0,
    distanceDrivenUntilAccident: 35.0,
    daysWorkedSinceLastDayOff: 6.0,
    totalDistanceDrivenSinceLastDayOff: 1237.0,
    damageLevel: "無傷",
    seatbeltUsage: true,
    numberOfAccidents: 1,
    numberOfViolations: 1,
    numberOfDeaths: 0,
    numberOfDeathsPassengers: 0,
    numberOfSeriousInjuries: 0,
    numberOfSeriousInjuriesPassengers: 0,
    numberOfMinorInjuries: 0,
    numberOfMinorInjuriesPassengers: 0,
    totalDrivenDistance: 0.0,
    modificationContents: "",
    dateOfModification: "",
    brokenOrDetachedPartName: "",
    drivenDistanceSinceInstallation: 0.0,
    modificationDate1: "",
    modificationDate2: "",
    modificationDate3: "",
    fatigueOrSuddenBreakageType: "指定なし",
    title: "山ノ内町での交通事故",
    description: "2004年7月19日11時10分、下高井郡山ノ内町で交通事故が発生しました。事故の詳細は不明ですが、事故類型は「その他」、発生形態も「その他」とされています。事故により死者は0名、負傷者数は不明となっています。",
    createdAt: "2004-07-19T11:10:00+09:00",
    updatedAt: "2004-07-19T11:10:00+09:00",
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