import { Ship } from '@/types/ship';

/**
 * 船舶のモックデータ
 */
export const mockShips: Ship[] = [
  {
    ship_ID: "55193259388",
    ship_kind: "旅客船",
    ship_quality: "軽合金",
    navigation_area: "沿海区域",
    ship_owner_ID: "9000000001",
    purpose: "旅客船",
    ship_weight: 19,
    capacity_passengers: "65",
    capacity_crew: "2",
    capacity_other_boarders: "0",
    main_engine_type: "ディーゼル",
    Continuous_Maximum_Output: 1072,
    Maximum_Speed: 25,
    Cruising_Speed: 21,
    Overall_Length: 18.16,
    Width: 4.51,
    Maximum_Height: 1.59,
    Maximum_Full_Load_Draft: 1.45,
    SHIPYARD_ID: 9000000001,
    Radio_Equipment: "あり",
    Maneuverability_Turning_Radius: "50×50",
    Maneuverability_Drift_Distance: "約15230ノット航海速力時",
    Special_Maneuvering_Equipment: "1レーダー1基、推進機の数3基、GPS1基",
    Barrier_Free_Support_Status: "バリフリ対応"
  },
  {
    ship_ID: "55193259389",
    ship_kind: "貨物船",
    ship_quality: "鋼",
    navigation_area: "近海区域",
    ship_owner_ID: "9000000002",
    purpose: "貨物船",
    ship_weight: 45,
    capacity_passengers: "0",
    capacity_crew: "5",
    capacity_other_boarders: "2",
    main_engine_type: "ディーゼル",
    Continuous_Maximum_Output: 2400,
    Maximum_Speed: 18,
    Cruising_Speed: 15,
    Overall_Length: 28.5,
    Width: 6.2,
    Maximum_Height: 2.8,
    Maximum_Full_Load_Draft: 2.1,
    SHIPYARD_ID: 9000000002,
    Radio_Equipment: "あり",
    Maneuverability_Turning_Radius: "80×80",
    Maneuverability_Drift_Distance: "約200m（15ノット航海速力時）",
    Special_Maneuvering_Equipment: "レーダー2基、GPS1基、自動操舵装置",
    Barrier_Free_Support_Status: "対応なし"
  },
  {
    ship_ID: "55193259390",
    ship_kind: "漁船",
    ship_quality: "FRP",
    navigation_area: "沿岸区域",
    ship_owner_ID: "9000000003",
    purpose: "漁船",
    ship_weight: 8,
    capacity_passengers: "0",
    capacity_crew: "4",
    capacity_other_boarders: "0",
    main_engine_type: "ディーゼル",
    Continuous_Maximum_Output: 320,
    Maximum_Speed: 30,
    Cruising_Speed: 25,
    Overall_Length: 12.8,
    Width: 3.2,
    Maximum_Height: 1.2,
    Maximum_Full_Load_Draft: 0.8,
    SHIPYARD_ID: 9000000003,
    Radio_Equipment: "あり",
    Maneuverability_Turning_Radius: "30×30",
    Maneuverability_Drift_Distance: "約80m（25ノット航海速力時）",
    Special_Maneuvering_Equipment: "GPS1基、魚群探知機",
    Barrier_Free_Support_Status: "対応なし"
  },
  {
    ship_ID: "55193259391",
    ship_kind: "旅客船",
    ship_quality: "鋼",
    navigation_area: "沿海区域",
    ship_owner_ID: "9000000004",
    purpose: "旅客船",
    ship_weight: 120,
    capacity_passengers: "200",
    capacity_crew: "8",
    capacity_other_boarders: "5",
    main_engine_type: "ディーゼル",
    Continuous_Maximum_Output: 3600,
    Maximum_Speed: 22,
    Cruising_Speed: 18,
    Overall_Length: 45.2,
    Width: 8.5,
    Maximum_Height: 4.2,
    Maximum_Full_Load_Draft: 2.8,
    SHIPYARD_ID: 9000000001,
    Radio_Equipment: "あり",
    Maneuverability_Turning_Radius: "120×120",
    Maneuverability_Drift_Distance: "約350m（18ノット航海速力時）",
    Special_Maneuvering_Equipment: "レーダー2基、GPS2基、自動操舵装置、推進機の数2基",
    Barrier_Free_Support_Status: "バリフリ対応"
  },
  {
    ship_ID: "55193259392",
    ship_kind: "タンカー",
    ship_quality: "鋼",
    navigation_area: "遠洋区域",
    ship_owner_ID: "9000000005",
    purpose: "タンカー",
    ship_weight: 5000,
    capacity_passengers: "0",
    capacity_crew: "15",
    capacity_other_boarders: "3",
    main_engine_type: "ディーゼル",
    Continuous_Maximum_Output: 12000,
    Maximum_Speed: 16,
    Cruising_Speed: 14,
    Overall_Length: 135.8,
    Width: 21.2,
    Maximum_Height: 12.5,
    Maximum_Full_Load_Draft: 8.2,
    SHIPYARD_ID: 9000000004,
    Radio_Equipment: "あり",
    Maneuverability_Turning_Radius: "500×500",
    Maneuverability_Drift_Distance: "約1000m（14ノット航海速力時）",
    Special_Maneuvering_Equipment: "レーダー3基、GPS3基、自動操舵装置、推進機の数1基",
    Barrier_Free_Support_Status: "対応なし"
  }
];

/**
 * 全モックデータを取得
 */
export const getMockShips = (): Ship[] => mockShips;

/**
 * IDから特定の船舶データを取得
 */
export const getMockShipById = (id: string): Ship | undefined => 
  mockShips.find(ship => ship.ship_ID === id);

/**
 * 船舶の種類一覧を取得
 */
export const getShipKinds = (): string[] => 
  Array.from(new Set(mockShips.map(ship => ship.ship_kind)));

/**
 * ランダムな船舶を取得（推奨表示用）
 */
export const getRandomShips = (count: number): Ship[] => {
  const shuffled = [...mockShips].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, mockShips.length));
};
