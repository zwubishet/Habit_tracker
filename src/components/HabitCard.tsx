import { useState } from 'react';
import { CheckCircle2, Circle, Flame, Trash2, Calendar, Clock } from 'lucide-react';
import type { Database } from '../lib/database.types';

type Habit = Database['public']['Tables']['habits']['Row'];
type HabitLog = Database['public']['Tables']['habit_logs']['Row'];

interface HabitCardProps {
  habit: Habit;
  habitLogs: HabitLog[];
  onToggle: (habitId: string, date: string) => void;
  onDelete: (habitId: string) => void;
}

export default function HabitCard({ habit, habitLogs, onToggle, onDelete }: HabitCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = habitLogs.some((log) => log.date === today && log.completed);

  const calculateStreak = () => {
    const sortedLogs = [...habitLogs]
      .filter((log) => log.completed)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (sortedLogs.length === 0) return { current: 0, longest: 0 };

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let expectedDate = new Date();
    expectedDate.setHours(0, 0, 0, 0);

    for (const log of sortedLogs) {
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);

      const diffTime = expectedDate.getTime() - logDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        tempStreak++;
        if (currentStreak === 0) currentStreak = tempStreak;
        expectedDate.setDate(expectedDate.getDate() - 1);
      } else if (diffDays === 1) {
        tempStreak++;
        if (currentStreak === 0) currentStreak = tempStreak;
        expectedDate = new Date(logDate);
        expectedDate.setDate(expectedDate.getDate() - 1);
      } else {
        if (currentStreak === 0) {
          currentStreak = 0;
        }
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
        expectedDate = new Date(logDate);
        expectedDate.setDate(expectedDate.getDate() - 1);
      }

      longestStreak = Math.max(longestStreak, tempStreak);
    }

    return { current: currentStreak, longest: longestStreak };
  };

  const streak = calculateStreak();

  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const isCompleted = habitLogs.some((log) => log.date === dateStr && log.completed);
      days.push({
        date: dateStr,
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        isCompleted,
      });
    }
    return days;
  };

  const last7Days = getLast7Days();
  const completionRate = habitLogs.length > 0
    ? Math.round((habitLogs.filter((log) => log.completed).length / habitLogs.length) * 100)
    : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {habit.title}
          </h3>
          {habit.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400">{habit.description}</p>
          )}
        </div>
        <button
          onClick={() => setShowConfirm(true)}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-4 mb-4 text-sm">
        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <Calendar className="w-4 h-4" />
          <span className="capitalize">{habit.frequency}</span>
        </div>
        {habit.reminder_time && (
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{habit.reminder_time}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-6 mb-4">
        <div className="flex items-center gap-2">
          <Flame className={`w-5 h-5 ${streak.current > 0 ? 'text-orange-500' : 'text-gray-400'}`} />
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{streak.current}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Current Streak</div>
          </div>
        </div>
        <div className="border-l border-gray-200 dark:border-gray-700 pl-6">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{streak.longest}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Best Streak</div>
        </div>
        <div className="border-l border-gray-200 dark:border-gray-700 pl-6">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{completionRate}%</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Completion</div>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {last7Days.map((day) => (
          <div key={day.date} className="flex-1 text-center">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{day.day}</div>
            <div
              className={`w-full h-2 rounded-full ${
                day.isCompleted
                  ? 'bg-green-500'
                  : day.date === today
                  ? 'bg-gray-300 dark:bg-gray-600'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          </div>
        ))}
      </div>

      <button
        onClick={() => onToggle(habit.id, today)}
        className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
          isCompletedToday
            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {isCompletedToday ? (
          <>
            <CheckCircle2 className="w-5 h-5" />
            Completed Today
          </>
        ) : (
          <>
            <Circle className="w-5 h-5" />
            Mark as Done
          </>
        )}
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Delete Habit?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              This will permanently delete "{habit.title}" and all its history.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(habit.id);
                  setShowConfirm(false);
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
