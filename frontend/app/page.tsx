'use client';

import Link from 'next/link';
import { useShips, useShipComparison } from '@/hooks/useShips';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Ship, Search, GitCompare, ArrowRight } from 'lucide-react';

export default function Home() {
  const { ships, filteredShips, totalCount, filteredCount } = useShips();
  const { selectedShips, selectedCount, addShip, removeShip, clearAll } = useShipComparison();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="container mx-auto px-4 py-12">
        {/* ヘーダー */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-4 rounded-full">
              <Ship className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            船舶情報比較・検索アプリ
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            船舶データベースから詳細な船舶情報を検索し、複数の船舶を比較できるシステムです
          </p>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="py-8">
              <div className="text-4xl font-bold text-blue-600 mb-2">{totalCount}</div>
              <div className="text-gray-600">登録船舶数</div>
              <div className="text-sm text-gray-500 mt-1">データベース内の総数</div>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="py-8">
              <div className="text-4xl font-bold text-green-600 mb-2">5</div>
              <div className="text-gray-600">船舶種類</div>
              <div className="text-sm text-gray-500 mt-1">旅客船、貨物船、漁船等</div>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="py-8">
              <div className="text-4xl font-bold text-purple-600 mb-2">3</div>
              <div className="text-gray-600">最大比較数</div>
              <div className="text-sm text-gray-500 mt-1">同時に比較可能な船舶数</div>
            </CardContent>
          </Card>
        </div>

        {/* アクションカード */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="hover:shadow-lg transition-all group">
            <CardContent className="p-8">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <Search className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">船舶検索</h3>
                  <p className="text-gray-600">詳細な条件で船舶を検索</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                船舶の種類、総トン数、速力などの条件を指定して、目的に合った船舶を効率的に検索できます。
              </p>
              <Link href="/ships">
                <Button className="w-full group-hover:bg-blue-700 transition-colors">
                  船舶を検索する
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all group">
            <CardContent className="p-8">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <GitCompare className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">船舶比較</h3>
                  <p className="text-gray-600">複数船舶の詳細比較</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                最大3隻の船舶を選択して、スペックや性能を並べて比較検討することができます。
              </p>
              <Link href="/ships">
                <Button variant="outline" className="w-full group-hover:bg-green-50 transition-colors">
                  比較を開始する
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* 比較中の船舶表示 */}
        {selectedCount > 0 && (
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <GitCompare className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-blue-900">
                    比較選択中の船舶 ({selectedCount}/3)
                  </h2>
                </div>
                <Button variant="outline" size="sm" onClick={clearAll}>
                  すべてクリア
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {selectedShips.map(ship => (
                  <div key={ship.ship_ID} className="bg-white p-4 rounded-lg border">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{ship.ship_ID}</h4>
                        <p className="text-sm text-blue-600">{ship.ship_kind}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeShip(ship.ship_ID)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        ×
                      </Button>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>{ship.ship_weight}トン</div>
                      <div>{ship.Maximum_Speed}ノット</div>
                      <div>{ship.Overall_Length}m</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Link href="/ships" className="flex-1">
                  <Button variant="outline" className="w-full">
                    さらに追加する
                  </Button>
                </Link>
                {selectedCount >= 2 && (
                  <Link href="/ships/compare" className="flex-1">
                    <Button className="w-full">
                      比較する
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 機能紹介 */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold text-gray-900 text-center">主な機能</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">詳細検索</h3>
                <p className="text-gray-600 text-sm">
                  船舶の種類、総トン数、速力、定員などの様々な条件での検索
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GitCompare className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">比較機能</h3>
                <p className="text-gray-600 text-sm">
                  複数船舶のスペックを並べて表示し、詳細な比較が可能
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Ship className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">詳細情報</h3>
                <p className="text-gray-600 text-sm">
                  各船舶の詳細な仕様、性能、設備情報の確認
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
