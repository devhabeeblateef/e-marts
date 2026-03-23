export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200 animate-pulse">
      <div className="w-full aspect-square bg-gray-200" />
      
      <div className="p-3 space-y-3">
        <div className="h-3 bg-gray-200 rounded w-20" />
        
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>

        <div className="h-5 bg-gray-200 rounded w-24" />
        
        <div className="h-9 bg-gray-200 rounded w-full" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <ProductCardSkeleton />
        </div>
      ))}
    </div>
  );
}
