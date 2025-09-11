import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダースケルトン */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div>
                <Skeleton className="w-48 h-8 mb-2" />
                <Skeleton className="w-64 h-4" />
              </div>
            </div>
            <Skeleton className="w-32 h-10" />
          </div>
        </div>
      </div>

      {/* メインコンテンツスケルトン */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* 船舶一覧スケルトン */}
          <div className="flex-1 space-y-6">
            {/* 検索フィルタースケルトン */}
            <div className="bg-white p-6 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Skeleton className="w-full h-10" />
                <Skeleton className="w-full h-10" />
                <Skeleton className="w-full h-10" />
              </div>
            </div>

            {/* ツールバースケルトン */}
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex justify-between items-center">
                <Skeleton className="w-32 h-6" />
                <div className="flex gap-2">
                  <Skeleton className="w-20 h-8" />
                  <Skeleton className="w-20 h-8" />
                  <Skeleton className="w-32 h-8" />
                </div>
              </div>
            </div>

            {/* 船舶カードスケルトン */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg border">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <Skeleton className="w-24 h-6 mb-2" />
                      <Skeleton className="w-16 h-4" />
                    </div>
                    <Skeleton className="w-12 h-5 rounded-full" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <div key={j} className="bg-gray-50 p-2 rounded">
                        <Skeleton className="w-16 h-3 mb-1" />
                        <Skeleton className="w-12 h-4" />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <Skeleton className="w-12 h-4" />
                      <Skeleton className="w-16 h-4" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="w-16 h-4" />
                      <Skeleton className="w-20 h-4" />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Skeleton className="flex-1 h-8" />
                    <Skeleton className="flex-1 h-8" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* サイドバースケルトン */}
          <div className="w-80">
            <div className="bg-white p-6 rounded-lg border">
              <div className="flex justify-between items-center mb-4">
                <Skeleton className="w-20 h-6" />
                <Skeleton className="w-6 h-6" />
              </div>
              
              <div className="space-y-4">
                <div>
                  <Skeleton className="w-16 h-5 mb-2" />
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex justify-between">
                        <Skeleton className="w-16 h-4" />
                        <Skeleton className="w-20 h-4" />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Skeleton className="w-12 h-5 mb-2" />
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex justify-between">
                        <Skeleton className="w-20 h-4" />
                        <Skeleton className="w-16 h-4" />
                      </div>
                    ))}
                  </div>
                </div>

                <Skeleton className="w-full h-10 mt-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
