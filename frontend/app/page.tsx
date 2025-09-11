"use client";

import Link from "next/link";
import { useShips, useShipComparison } from "@/hooks/useShips";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Ship, Search, GitCompare, ArrowRight, Bot } from "lucide-react";

export default function Home() {
  const { ships, filteredShips, totalCount, filteredCount } = useShips();
  const { selectedShips, selectedCount, addShip, removeShip, clearAll } =
    useShipComparison();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="container mx-auto px-4 py-12">
        {/* ヘッダー */}
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

        {/* アクションカード */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="hover:shadow-lg transition-all group">
            <CardContent className="p-8">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <Search className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    船舶検索
                  </h3>
                  <p className="text-gray-600">詳細な条件で船舶を検索</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                船舶の種類、総トン数、速力などの条件を指定して、目的に合った船舶を効率的に検索できます。
              </p>
              <Link href="/ships" prefetch={true}>
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
                  <h3 className="text-xl font-semibold text-gray-900">
                    船舶比較
                  </h3>
                  <p className="text-gray-600">複数船舶の詳細比較</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                最大3隻の船舶を選択して、スペックや性能を並べて比較検討することができます。
              </p>
              <Link href="/ships/compare" prefetch={true}>
                <Button
                  variant="outline"
                  className="w-full group-hover:bg-green-50 transition-colors"
                >
                  比較を開始する
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all group">
            <CardContent className="p-8">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <Bot className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    AI アシスタント
                  </h3>
                  <p className="text-gray-600">船舶について質問</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                AIが船舶データベースを分析して、あなたの質問に詳しく回答します。検索や比較のお手伝いをします。
              </p>
              <Link href="/chat" prefetch={true}>
                <Button
                  variant="outline"
                  className="w-full group-hover:bg-purple-50 transition-colors"
                >
                  チャットを開始する
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
