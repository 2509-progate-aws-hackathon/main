import { Skeleton } from '@/components/ui/Skeleton';

export default function CompareLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダースケルトン */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="w-20 h-4" />
              <span>/</span>
              <Skeleton className="w-12 h-4" />
            </div>
            <Skeleton className="w-32 h-8" />
          </div>
        </div>
      </div>

      {/* メインコンテンツスケルトン */}
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* ヘッダー */}
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="w-24 h-8 mb-2" />
            <Skeleton className="w-32 h-4" />
          </div>
          <Skeleton className="w-24 h-8" />
        </div>

        {/* 比較テーブルスケルトン */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 w-48">
                    <Skeleton className="w-12 h-4" />
                  </th>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <th key={i} className="px-4 py-3 min-w-48">
                      <div className="space-y-2">
                        <Skeleton className="w-20 h-5 mx-auto" />
                        <Skeleton className="w-16 h-3 mx-auto" />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 12 }).map((_, i) => (
                  <tr key={i} className="border-b">
                    <td className="px-4 py-4 border-r bg-gray-50">
                      <div className="flex items-center gap-2">
                        <Skeleton className="w-4 h-4" />
                        <Skeleton className="w-16 h-4" />
                      </div>
                    </td>
                    {Array.from({ length: 3 }).map((_, j) => (
                      <td key={j} className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Skeleton className="w-16 h-4" />
                          <Skeleton className="w-6 h-6 rounded-full" />
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 統計サマリースケルトン */}
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="w-5 h-5" />
            <Skeleton className="w-20 h-6" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="text-center">
                <Skeleton className="w-12 h-6 mb-1 mx-auto" />
                <Skeleton className="w-20 h-4 mb-1 mx-auto" />
                <Skeleton className="w-24 h-3 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
