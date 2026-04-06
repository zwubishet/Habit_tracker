export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />)}
        </div>
      </div>
    </div>
  );
}