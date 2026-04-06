import { Check, X, Clock } from 'lucide-react';

export default function HabitTableView({ habits, logs, onToggle, today }: any) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">
            <th className="px-6 py-4 font-semibold">Habit</th>
            <th className="px-6 py-4 font-semibold">Frequency</th>
            <th className="px-6 py-4 font-semibold text-center">Status (Today)</th>
            <th className="px-6 py-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {habits.map((habit: any) => {
            const isCompleted = logs.some((l: any) => l.habit_id === habit.id && l.date === today);
            
            return (
              <tr key={habit.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors group">
                <td className="px-6 py-4">
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">{habit.title}</div>
                    <div className="text-xs text-gray-500 truncate max-w-xs">{habit.description || 'No description'}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    <Clock className="w-3 h-3" /> {habit.frequency}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    {isCompleted ? (
                      <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                        <Check className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                        <X className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onToggle(today, habit.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                      isCompleted 
                      ? 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400' 
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20'
                    }`}
                  >
                    {isCompleted ? 'Undo' : 'Complete'}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}