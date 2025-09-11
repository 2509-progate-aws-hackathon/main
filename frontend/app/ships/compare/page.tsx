'use client';

import { ShipComparison } from '@/features/ships/components/ShipComparison';
import { useRouter } from 'next/navigation';
import { useShipComparison } from '@/hooks/useShips';
import { Button } from '@/components/ui/Button';
import { Ship as ShipIcon, ArrowLeft } from 'lucide-react';

export default function ComparePage() {
  const router = useRouter();
  const { selectedShips } = useShipComparison();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <nav className="flex items-center gap-2 text-sm text-gray-600">
              <button 
                onClick={() => router.push('/ships')}
                className="hover:text-blue-600 transition-colors"
              >
                船舶一覧
              </button>
              <span>/</span>
              <span className="text-gray-900 font-medium">比較</span>
            </nav>
            
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/ships')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                船舶一覧に戻る
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="container mx-auto px-4 py-6">
        <ShipComparison showBackButton={false} />
      </div>
    </div>
  );
}
