import { Ship } from '@/types/ship';
import { ShipReference } from '@/types/chat';
import { getMockShips } from './ships';

// TODO: 高度なRAG機能
// - ベクトル検索エンジン統合
// - 意味的類似性検索
// - 多言語対応
// - 画像認識・生成
// - 音声認識・合成

export interface RAGResponse {
  answer: string;
  sources: ShipReference[];
  confidence: number;
  // TODO: 拡張レスポンス情報
  // - searchQuery: string;
  // - processingTime: number;
  // - suggestedQuestions: string[];
}

class MockRAGSystem {
  private ships: Ship[];

  constructor() {
    this.ships = getMockShips();
  }

  // 基本的な質問パターンマッチング
  async processQuery(query: string): Promise<RAGResponse> {
    const normalizedQuery = query.toLowerCase();
    
    // TODO: より高度な自然言語処理
    // - 意図認識（Intent Recognition）
    // - エンティティ抽出（Named Entity Recognition）
    // - 感情分析（Sentiment Analysis）
    // - 文脈理解（Context Awareness）

    // 基本的なパターンマッチング
    if (this.isSpeedQuery(normalizedQuery)) {
      return this.handleSpeedQuery(normalizedQuery);
    } else if (this.isTonnageQuery(normalizedQuery)) {
      return this.handleTonnageQuery(normalizedQuery);
    } else if (this.isComparisonQuery(normalizedQuery)) {
      return this.handleComparisonQuery(normalizedQuery);
    } else if (this.isRecommendationQuery(normalizedQuery)) {
      return this.handleRecommendationQuery(normalizedQuery);
    } else {
      return this.handleGeneralQuery(normalizedQuery);
    }
  }

  private isSpeedQuery(query: string): boolean {
    return /速度|スピード|速力|ノット|早い|遅い/.test(query);
  }

  private isTonnageQuery(query: string): boolean {
    return /トン数|重量|大きさ|サイズ|容量/.test(query);
  }

  private isComparisonQuery(query: string): boolean {
    return /比較|違い|どちら|vs|対/.test(query);
  }

  private isRecommendationQuery(query: string): boolean {
    return /おすすめ|推奨|最適|選んで|良い/.test(query);
  }

  private async handleSpeedQuery(query: string): Promise<RAGResponse> {
    const fastestShips = this.ships
      .sort((a, b) => b.Maximum_Speed - a.Maximum_Speed)
      .slice(0, 3);

    const sources: ShipReference[] = fastestShips.map(ship => ({
      shipId: ship.ship_ID,
      relevantFields: ['Maximum_Speed', 'Cruising_Speed'],
      confidence: 0.9
    }));

    return {
      answer: `最高速力について説明します。最も速い船舶は${fastestShips[0].ship_ID}で、最高速力は${fastestShips[0].Maximum_Speed}ノットです。次に${fastestShips[1].ship_ID}が${fastestShips[1].Maximum_Speed}ノット、${fastestShips[2].ship_ID}が${fastestShips[2].Maximum_Speed}ノットとなっています。`,
      sources,
      confidence: 0.85
    };
  }

  private async handleTonnageQuery(query: string): Promise<RAGResponse> {
    const largestShips = this.ships
      .sort((a, b) => b.ship_weight - a.ship_weight)
      .slice(0, 3);

    const sources: ShipReference[] = largestShips.map(ship => ({
      shipId: ship.ship_ID,
      relevantFields: ['ship_weight', 'Overall_Length', 'Width'],
      confidence: 0.9
    }));

    return {
      answer: `総トン数について説明します。最大の船舶は${largestShips[0].ship_ID}で、総トン数は${largestShips[0].ship_weight}トンです。全長は${largestShips[0].Overall_Length}m、全幅は${largestShips[0].Width}mとなっています。`,
      sources,
      confidence: 0.9
    };
  }

  private async handleComparisonQuery(query: string): Promise<RAGResponse> {
    // TODO: より高度な比較機能
    // - 多次元比較（性能、コスト、効率等）
    // - ビジュアル比較チャート生成
    // - 詳細な項目別分析
    
    const randomShips = this.ships.slice(0, 2);
    const sources: ShipReference[] = randomShips.map(ship => ({
      shipId: ship.ship_ID,
      relevantFields: ['Maximum_Speed', 'ship_weight', 'capacity_passengers'],
      confidence: 0.8
    }));

    return {
      answer: `${randomShips[0].ship_ID}と${randomShips[1].ship_ID}を比較します。速力は${randomShips[0].Maximum_Speed}ノット対${randomShips[1].Maximum_Speed}ノット、総トン数は${randomShips[0].ship_weight}トン対${randomShips[1].ship_weight}トンです。`,
      sources,
      confidence: 0.75
    };
  }

  private async handleRecommendationQuery(query: string): Promise<RAGResponse> {
    // TODO: 高度な推奨アルゴリズム
    // - ユーザープロファイル分析
    // - 用途別最適化
    // - 機械学習ベース推奨
    // - 協調フィルタリング

    const recommendedShip = this.ships[0]; // 簡単な推奨
    const sources: ShipReference[] = [{
      shipId: recommendedShip.ship_ID,
      relevantFields: ['ship_kind', 'purpose', 'Maximum_Speed', 'capacity_passengers'],
      confidence: 0.7
    }];

    return {
      answer: `${recommendedShip.ship_ID}をお勧めします。${recommendedShip.ship_kind}として設計されており、${recommendedShip.purpose}に適しています。最高速力${recommendedShip.Maximum_Speed}ノットで、定員は${recommendedShip.capacity_passengers}人です。`,
      sources,
      confidence: 0.7
    };
  }

  private async handleGeneralQuery(query: string): Promise<RAGResponse> {
    // TODO: 汎用的な質問応答機能
    // - 一般的な船舶知識ベース
    // - 外部データソース連携
    // - 多段階推論
    
    const randomShip = this.ships[Math.floor(Math.random() * this.ships.length)];
    const sources: ShipReference[] = [{
      shipId: randomShip.ship_ID,
      relevantFields: ['ship_kind', 'ship_quality'],
      confidence: 0.5
    }];

    return {
      answer: `申し訳ありませんが、その質問についてはより具体的な内容でお聞かせください。船舶の速度、大きさ、比較、推奨などについてお答えできます。例として、${randomShip.ship_ID}は${randomShip.ship_kind}です。`,
      sources,
      confidence: 0.5
    };
  }
}

// TODO: RAGシステムの高度化
// - チャンクベースの検索
// - ベクトルデータベース統合
// - LLM API連携
// - キャッシュシステム
// - A/Bテスト機能

export const mockRAGSystem = new MockRAGSystem();
