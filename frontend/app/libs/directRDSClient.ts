import { RDSDataClient, ExecuteStatementCommand } from '@aws-sdk/client-rds-data';
import { log } from 'console';

/**
 * 事故データの型定義（実際のDBスキーマに基づく）
 */
export interface AccidentData {
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
 * 直接RDSアクセスクライアント
 * セキュリティを無視して直接データベースにアクセス
 */
class DirectRDSClient {
  private client: RDSDataClient;
  private clusterArn: string;
  private secretArn: string;
  private database: string;

  constructor() {
    // 環境変数から設定を取得（セキュリティ無視）
    const credentials = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID && process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY 
      ? {
          accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
        }
      : undefined; // undefinedの場合はデフォルト認証を使用

    this.client = new RDSDataClient({
      region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
      credentials
    });
    
    // jiko-database の設定（環境変数から取得）
    this.clusterArn = process.env.NEXT_PUBLIC_AURORA_CLUSTER_ARN || 
      'arn:aws:rds:us-east-1:083439127731:cluster:jiko-database';
    this.secretArn = process.env.NEXT_PUBLIC_AURORA_SECRET_ARN || 
      'arn:aws:secretsmanager:us-east-1:083439127731:secret:rds-db-credentials/jiko-database/postgres/1757820517108-EiJcng';
    this.database = process.env.NEXT_PUBLIC_AURORA_DATABASE_NAME || 'jiko_database';
    
    console.log('DirectRDS Client initialized:', {
      region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
      clusterArn: this.clusterArn.substring(0, 50) + '...',
      database: this.database,
      hasCredentials: !!credentials
    });
  }

  /**
   * データベース接続テスト
   */
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const command = new ExecuteStatementCommand({
        resourceArn: this.clusterArn,
        secretArn: this.secretArn,
        database: this.database,
        sql: 'SELECT NOW() as current_time, version() as db_version'
      });

      const result = await this.client.send(command);
      return {
        success: true,
        message: `接続成功: ${result.records?.[0]?.[0]?.stringValue}`
      };
    } catch (error) {
      return {
        success: false,
        message: `接続失敗: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * テーブル一覧を取得
   */
  async listTables(): Promise<{ success: boolean; tables: string[]; message?: string }> {
    try {
      const command = new ExecuteStatementCommand({
        resourceArn: this.clusterArn,
        secretArn: this.secretArn,
        database: this.database,
        sql: `
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public'
          ORDER BY table_name
        `
      });

      const result = await this.client.send(command);
      const tables = (result.records || []).map(record => 
        record[0]?.stringValue || ''
      ).filter(Boolean);

      return {
        success: true,
        tables
      };
    } catch (error) {
      return {
        success: false,
        tables: [],
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * PostGISクエリでルート周辺の事故を検索
   */
  async searchAccidentsNearRoute(
    routeLine: string, 
    distanceMeters: number = 100
  ): Promise<{ success: boolean; accidents: AccidentData[]; count: number }> {
    // PostGIS geography型をRDS Data API対応形式に変換
    const sql = `
      SELECT 
          OCCURRENCE_DATE_AND_TIME,
          WEATHER,
          LOCATION,
          ACCIDENT_TYPE_CATEGORY,
          VEHICLE_1_MODEL_NAME,
          ROAD_TYPE,
          DAMAGE_LEVEL,
          NUMBER_OF_DEATHS,
          NUMBER_OF_SERIOUS_INJURIES,
          NUMBER_OF_MINOR_INJURIES,
          TITLE,
          DESCRIPTION,
          ST_AsText(GEOG::geometry) as geog_wkt,
          ST_X(GEOG::geometry) as longitude,
          ST_Y(GEOG::geometry) as latitude,
          ST_Distance(
              GEOG::geometry,
              ST_GeomFromText('${routeLine}', 4326)::geometry
          ) as distance_meters
      FROM accident_data
      WHERE GEOG IS NOT NULL
      AND ST_DWithin(
          GEOG::geometry,
          ST_GeomFromText('${routeLine}', 4326)::geometry,
          ${distanceMeters}
      )
      ORDER BY distance_meters
      LIMIT 100;
    `;

    try {
      const command = new ExecuteStatementCommand({
        resourceArn: this.clusterArn,
        secretArn: this.secretArn,
        database: this.database,
        sql
      });

      console.log('Executing PostGIS route search:', { routeLine, distanceMeters });
      const result = await this.client.send(command);

      // 結果をパース
      const accidents = (result.records || []).map(record => ({
        OCCURRENCE_DATE_AND_TIME: record[0]?.stringValue,
        WEATHER: record[1]?.stringValue,
        LOCATION: record[2]?.stringValue,
        ACCIDENT_TYPE_CATEGORY: record[3]?.stringValue,
        VEHICLE_1_MODEL_NAME: record[4]?.stringValue,
        ROAD_TYPE: record[5]?.stringValue,
        DAMAGE_LEVEL: record[6]?.stringValue,
        NUMBER_OF_DEATHS: record[7]?.longValue,
        NUMBER_OF_SERIOUS_INJURIES: record[8]?.longValue,
        NUMBER_OF_MINOR_INJURIES: record[9]?.longValue,
        TITLE: record[10]?.stringValue,
        DESCRIPTION: record[11]?.stringValue,
        GEOG: record[12]?.stringValue, // WKT形式の座標データ
        longitude: record[13]?.doubleValue,
        latitude: record[14]?.doubleValue,
        distance_meters: Math.round((record[15]?.doubleValue || 0) * 100) / 100
      }));

      return {
        success: true,
        accidents,
        count: accidents.length
      };

    } catch (error) {
      console.error('PostGIS route search error:', error);
      throw new Error(`ルート周辺事故検索に失敗: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 全事故データを取得（title, description, occurrence_date_and_time, geog のみ取得）
   */
  async getAllAccidents(limit: number = 100): Promise<{ success: boolean; accidents: AccidentData[]; count: number }> {
    const sql = `
      SELECT 
          TITLE,
          DESCRIPTION,
          OCCURRENCE_DATE_AND_TIME,
          ST_AsText(GEOG::geometry) as geog_wkt
      FROM accident_data
      WHERE GEOG IS NOT NULL
      ORDER BY OCCURRENCE_DATE_AND_TIME DESC
      LIMIT ${limit};
    `;

    try {
      const command = new ExecuteStatementCommand({
        resourceArn: this.clusterArn,
        secretArn: this.secretArn,
        database: this.database,
        sql
      });

      const result = await this.client.send(command);

      const accidents = (result.records || []).map(record => ({
        TITLE: record[0]?.stringValue,
        DESCRIPTION: record[1]?.stringValue,
        OCCURRENCE_DATE_AND_TIME: record[2]?.stringValue,
        GEOG: record[3]?.stringValue // WKT形式の座標データ
      }));

      return {
        success: true,
        accidents,
        count: accidents.length
      };

    } catch (error) {
      console.error('Get all accidents error:', error);
      throw new Error(`全事故データ取得に失敗: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 地理的範囲検索（PostGIS使用）
   */
  async searchAccidentsInBounds(
    minLat: number, 
    maxLat: number, 
    minLng: number, 
    maxLng: number
  ): Promise<{ success: boolean; accidents: AccidentData[]; count: number }> {
    // 矩形範囲のPolygonを作成
    const boundingBox = `POLYGON((${minLng} ${minLat}, ${maxLng} ${minLat}, ${maxLng} ${maxLat}, ${minLng} ${maxLat}, ${minLng} ${minLat}))`;
    
    const sql = `
      SELECT 
          OCCURRENCE_DATE_AND_TIME,
          WEATHER,
          LOCATION,
          ACCIDENT_TYPE_CATEGORY,
          VEHICLE_1_MODEL_NAME,
          ROAD_TYPE,
          DAMAGE_LEVEL,
          NUMBER_OF_DEATHS,
          NUMBER_OF_SERIOUS_INJURIES,
          NUMBER_OF_MINOR_INJURIES,
          TITLE,
          DESCRIPTION,
          ST_AsText(GEOG::geometry) as geog_wkt,
          ST_X(GEOG::geometry) as longitude,
          ST_Y(GEOG::geometry) as latitude
      FROM accident_data
      WHERE GEOG IS NOT NULL
      AND ST_Intersects(
          GEOG::geometry,
          ST_GeomFromText('${boundingBox}', 4326)
      )
      ORDER BY OCCURRENCE_DATE_AND_TIME DESC
      LIMIT 500;
    `;

    try {
      const command = new ExecuteStatementCommand({
        resourceArn: this.clusterArn,
        secretArn: this.secretArn,
        database: this.database,
        sql
      });

      const result = await this.client.send(command);

      const accidents = (result.records || []).map(record => ({
        OCCURRENCE_DATE_AND_TIME: record[0]?.stringValue,
        WEATHER: record[1]?.stringValue,
        LOCATION: record[2]?.stringValue,
        ACCIDENT_TYPE_CATEGORY: record[3]?.stringValue,
        VEHICLE_1_MODEL_NAME: record[4]?.stringValue,
        ROAD_TYPE: record[5]?.stringValue,
        DAMAGE_LEVEL: record[6]?.stringValue,
        NUMBER_OF_DEATHS: record[7]?.longValue,
        NUMBER_OF_SERIOUS_INJURIES: record[8]?.longValue,
        NUMBER_OF_MINOR_INJURIES: record[9]?.longValue,
        TITLE: record[10]?.stringValue,
        DESCRIPTION: record[11]?.stringValue,
        GEOG: record[12]?.stringValue, // WKT形式の座標データ
        longitude: record[13]?.doubleValue,
        latitude: record[14]?.doubleValue
      }));

      return {
        success: true,
        accidents,
        count: accidents.length
      };

    } catch (error) {
      console.error('PostGIS bounds search error:', error);
      throw new Error(`範囲検索に失敗: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 特定の条件で事故を検索
   */
  async searchAccidentsByConditions(filters: {
    weather?: string;
    accidentType?: string;
    roadType?: string;
    damageLevel?: string;
    dateFrom?: string;
    dateTo?: string;
    hasDeaths?: boolean;
    hasInjuries?: boolean;
  }): Promise<{ success: boolean; accidents: AccidentData[]; count: number }> {
    
    let whereConditions: string[] = ['GEOG IS NOT NULL'];

    // 動的にWHERE条件を構築（直接値埋め込み）
    if (filters.weather) {
      whereConditions.push(`WEATHER = '${filters.weather}'`);
    }

    if (filters.accidentType) {
      whereConditions.push(`ACCIDENT_TYPE_CATEGORY = '${filters.accidentType}'`);
    }

    if (filters.roadType) {
      whereConditions.push(`ROAD_TYPE = '${filters.roadType}'`);
    }

    if (filters.damageLevel) {
      whereConditions.push(`DAMAGE_LEVEL = '${filters.damageLevel}'`);
    }

    if (filters.dateFrom) {
      whereConditions.push(`OCCURRENCE_DATE_AND_TIME >= '${filters.dateFrom}'`);
    }

    if (filters.dateTo) {
      whereConditions.push(`OCCURRENCE_DATE_AND_TIME <= '${filters.dateTo}'`);
    }

    if (filters.hasDeaths) {
      whereConditions.push(`NUMBER_OF_DEATHS > 0`);
    }

    if (filters.hasInjuries) {
      whereConditions.push(`(NUMBER_OF_SERIOUS_INJURIES > 0 OR NUMBER_OF_MINOR_INJURIES > 0)`);
    }

    const sql = `
      SELECT 
          OCCURRENCE_DATE_AND_TIME,
          WEATHER,
          LOCATION,
          ACCIDENT_TYPE_CATEGORY,
          VEHICLE_1_MODEL_NAME,
          VEHICLE_1_BODY_TYPE,
          ROAD_TYPE,
          ROAD_SURFACE_CONDITION,
          DAMAGE_LEVEL,
          NUMBER_OF_DEATHS,
          NUMBER_OF_SERIOUS_INJURIES,
          NUMBER_OF_MINOR_INJURIES,
          SPEED_LIMIT_ON_ROAD,
          VEHICLE_BEHAVIOR_AT_ACCIDENT,
          TITLE,
          DESCRIPTION,
          ST_AsText(GEOG::geometry) as geog_wkt,
          ST_X(GEOG::geometry) as longitude,
          ST_Y(GEOG::geometry) as latitude
      FROM accident_data
      WHERE ${whereConditions.join(' AND ')}
      ORDER BY OCCURRENCE_DATE_AND_TIME DESC
      LIMIT 200;
    `;

    try {
      const command = new ExecuteStatementCommand({
        resourceArn: this.clusterArn,
        secretArn: this.secretArn,
        database: this.database,
        sql
      });

      const result = await this.client.send(command);

      const accidents = (result.records || []).map(record => ({
        OCCURRENCE_DATE_AND_TIME: record[0]?.stringValue,
        WEATHER: record[1]?.stringValue,
        LOCATION: record[2]?.stringValue,
        ACCIDENT_TYPE_CATEGORY: record[3]?.stringValue,
        VEHICLE_1_MODEL_NAME: record[4]?.stringValue,
        VEHICLE_1_BODY_TYPE: record[5]?.stringValue,
        ROAD_TYPE: record[6]?.stringValue,
        ROAD_SURFACE_CONDITION: record[7]?.stringValue,
        DAMAGE_LEVEL: record[8]?.stringValue,
        NUMBER_OF_DEATHS: record[9]?.longValue,
        NUMBER_OF_SERIOUS_INJURIES: record[10]?.longValue,
        NUMBER_OF_MINOR_INJURIES: record[11]?.longValue,
        SPEED_LIMIT_ON_ROAD: record[12]?.longValue,
        VEHICLE_BEHAVIOR_AT_ACCIDENT: record[13]?.stringValue,
        TITLE: record[14]?.stringValue,
        DESCRIPTION: record[15]?.stringValue,
        GEOG: record[16]?.stringValue,
        longitude: record[17]?.doubleValue,
        latitude: record[18]?.doubleValue
      }));

      return {
        success: true,
        accidents,
        count: accidents.length
      };

    } catch (error) {
      console.error('Conditional search error:', error);
      throw new Error(`条件検索に失敗: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 統計データを取得
   */
  async getAccidentStatistics(): Promise<{
    success: boolean;
    statistics: {
      totalAccidents: number;
      totalDeaths: number;
      totalSeriousInjuries: number;
      totalMinorInjuries: number;
      byWeather: Record<string, number>;
      byAccidentType: Record<string, number>;
      byRoadType: Record<string, number>;
    };
  }> {
    const sql = `
      WITH stats AS (
        SELECT 
          COUNT(*) as total_accidents,
          COALESCE(SUM(NUMBER_OF_DEATHS), 0) as total_deaths,
          COALESCE(SUM(NUMBER_OF_SERIOUS_INJURIES), 0) as total_serious_injuries,
          COALESCE(SUM(NUMBER_OF_MINOR_INJURIES), 0) as total_minor_injuries
        FROM accident_data
        WHERE GEOG IS NOT NULL
      ),
      weather_stats AS (
        SELECT WEATHER, COUNT(*) as count
        FROM accident_data 
        WHERE WEATHER IS NOT NULL AND GEOG IS NOT NULL
        GROUP BY WEATHER
      ),
      type_stats AS (
        SELECT ACCIDENT_TYPE_CATEGORY, COUNT(*) as count
        FROM accident_data 
        WHERE ACCIDENT_TYPE_CATEGORY IS NOT NULL AND GEOG IS NOT NULL
        GROUP BY ACCIDENT_TYPE_CATEGORY
      ),
      road_stats AS (
        SELECT ROAD_TYPE, COUNT(*) as count
        FROM accident_data 
        WHERE ROAD_TYPE IS NOT NULL AND GEOG IS NOT NULL
        GROUP BY ROAD_TYPE
      )
      SELECT 
        (SELECT total_accidents FROM stats) as total_accidents,
        (SELECT total_deaths FROM stats) as total_deaths,
        (SELECT total_serious_injuries FROM stats) as total_serious_injuries,
        (SELECT total_minor_injuries FROM stats) as total_minor_injuries,
        'weather' as category, WEATHER as subcategory, count
      FROM weather_stats
      UNION ALL
      SELECT 
        (SELECT total_accidents FROM stats) as total_accidents,
        (SELECT total_deaths FROM stats) as total_deaths,
        (SELECT total_serious_injuries FROM stats) as total_serious_injuries,
        (SELECT total_minor_injuries FROM stats) as total_minor_injuries,
        'accident_type' as category, ACCIDENT_TYPE_CATEGORY as subcategory, count
      FROM type_stats
      UNION ALL
      SELECT 
        (SELECT total_accidents FROM stats) as total_accidents,
        (SELECT total_deaths FROM stats) as total_deaths,
        (SELECT total_serious_injuries FROM stats) as total_serious_injuries,
        (SELECT total_minor_injuries FROM stats) as total_minor_injuries,
        'road_type' as category, ROAD_TYPE as subcategory, count
      FROM road_stats;
    `;

    try {
      const command = new ExecuteStatementCommand({
        resourceArn: this.clusterArn,
        secretArn: this.secretArn,
        database: this.database,
        sql
      });

      const result = await this.client.send(command);

      const byWeather: Record<string, number> = {};
      const byAccidentType: Record<string, number> = {};
      const byRoadType: Record<string, number> = {};
      
      let totalAccidents = 0;
      let totalDeaths = 0;
      let totalSeriousInjuries = 0;
      let totalMinorInjuries = 0;

      (result.records || []).forEach(record => {
        if (!totalAccidents) {
          totalAccidents = record[0]?.longValue || 0;
          totalDeaths = record[1]?.longValue || 0;
          totalSeriousInjuries = record[2]?.longValue || 0;
          totalMinorInjuries = record[3]?.longValue || 0;
        }

        const category = record[4]?.stringValue;
        const subcategory = record[5]?.stringValue;
        const count = record[6]?.longValue || 0;

        if (category && subcategory) {
          switch (category) {
            case 'weather':
              byWeather[subcategory] = count;
              break;
            case 'accident_type':
              byAccidentType[subcategory] = count;
              break;
            case 'road_type':
              byRoadType[subcategory] = count;
              break;
          }
        }
      });

      return {
        success: true,
        statistics: {
          totalAccidents,
          totalDeaths,
          totalSeriousInjuries,
          totalMinorInjuries,
          byWeather,
          byAccidentType,
          byRoadType
        }
      };

    } catch (error) {
      console.error('Statistics error:', error);
      throw new Error(`統計取得に失敗: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// シングルトンインスタンス
export const directRDSClient = new DirectRDSClient();