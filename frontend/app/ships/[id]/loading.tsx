import { Skeleton } from '@/components/ui/Skeleton';

export default function ShipDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダースケルトン */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="w-20 h-4" />
              <span>/</span>
              <Skeleton className="w-16 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="w-16 h-4" />
              <Skeleton className="w-8 h-6 rounded-full" />
              <Skeleton className="w-20 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツスケルトン */}
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* ヘッダーカード */}
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <Skeleton className="w-14 h-14 rounded-full" />
              <div>
                <Skeleton className="w-32 h-8 mb-2" />
                <Skeleton className="w-24 h-6 mb-1" />
                <Skeleton className="w-20 h-4" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="w-24 h-10" />
              <Skeleton className="w-20 h-10" />
            </div>
          </div>
        </div>

        {/* 基本情報グリッド */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg border">
              <div className="flex items-center gap-2 mb-4">
                <Skeleton className="w-5 h-5" />
                <Skeleton className="w-20 h-6" />
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="bg-gray-50 p-3 rounded-lg">
                      <Skeleton className="w-16 h-3 mb-1" />
                      <Skeleton className="w-12 h-5" />
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="flex justify-between">
                      <Skeleton className="w-16 h-4" />
                      <Skeleton className="w-20 h-4" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 詳細セクション */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg border">
              <div className="flex items-center gap-2 mb-4">
                <Skeleton className="w-5 h-5" />
                <Skeleton className="w-24 h-6" />
              </div>
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, j) => (
                  <div key={j} className="flex justify-between">
                    <Skeleton className="w-20 h-4" />
                    <Skeleton className="w-16 h-4" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* フローティングボタンスケルトン */}
      <div className="fixed bottom-6 right-6">
        <Skeleton className="w-40 h-12 rounded-lg" />
      </div>
    </div>
  );
}
