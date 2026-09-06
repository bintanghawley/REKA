export default function ProtectedLoading() {
  return (
    <div className="space-y-6 animate-pulse w-full">
      {/* Top Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#e4e5e1] pb-5">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-[#e4e5e1] rounded-[4px]" />
          <div className="h-4 w-72 bg-[#ecece9] rounded-[4px]" />
        </div>
        <div className="h-9 w-32 bg-[#e4e5e1] rounded-[4px]" />
      </div>

      {/* KPI Cards Row Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-[#ffffff] rounded-[12px] p-5 border border-[#e4e5e1] space-y-3 shadow-xs"
          >
            <div className="flex justify-between items-center">
              <div className="h-3 w-24 bg-[#ecece9] rounded" />
              <div className="h-4 w-4 bg-[#e4e5e1] rounded" />
            </div>
            <div className="h-7 w-36 bg-[#e4e5e1] rounded" />
            <div className="h-3 w-20 bg-[#ecece9] rounded" />
          </div>
        ))}
      </div>

      {/* Main Content / Chart Area Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 bg-[#ffffff] rounded-[12px] p-6 border border-[#e4e5e1] space-y-4 shadow-xs">
          <div className="flex justify-between items-center">
            <div className="h-5 w-36 bg-[#e4e5e1] rounded" />
            <div className="h-6 w-44 bg-[#ecece9] rounded" />
          </div>
          <div className="h-56 bg-[#f7f7f5] rounded-[8px] border border-[#f0f0ef]" />
        </div>
        <div className="lg:col-span-5 bg-[#ffffff] rounded-[12px] p-6 border border-[#e4e5e1] space-y-4 shadow-xs">
          <div className="flex justify-between items-center">
            <div className="h-5 w-28 bg-[#e4e5e1] rounded" />
            <div className="h-6 w-32 bg-[#ecece9] rounded" />
          </div>
          <div className="h-56 bg-[#f7f7f5] rounded-[8px] border border-[#f0f0ef]" />
        </div>
      </div>
    </div>
  );
}
