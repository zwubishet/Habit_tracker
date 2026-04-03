import { Target, TrendingUp, Calendar, Award } from 'lucide-react';
import type { Database } from '../lib/database.types';

type Habit = Database['public']['Tables']['habits']['Row'];
type HabitLog = Database['public']['Tables']['habit_logs']['Row'];

interface StatsOverviewProps {
  habits: Habit[];
  habitLogs: HabitLog[];
}

export default function StatsOverview({ habits, habitLogs }: StatsOverviewProps) {
  const today = new Date().toISOString().split('T')[0];

  const completedToday = habitLogs.filter(
    (log) => log.date === today && log.completed
  ).length;

  const getWeekLogs = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return habitLogs.filter((log) => new Date(log.date) >= weekAgo && log.completed);
  };

  const getMonthLogs = () => {
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);
    return habitLogs.filter((log) => new Date(log.date) >= monthAgo && log.completed);
  };

  const weekLogs = getWeekLogs();
  const monthLogs = getMonthLogs();

  const totalPoints = habitLogs.filter((log) => log.completed).length * 10;

  const weeklyAverage = habits.length > 0
    ? Math.round((weekLogs.length / (habits.length * 7)) * 100)
    : 0;

  const stats = [
    {
      label: 'Completed Today',
      value: `${completedToday}/${habits.length}`,
      icon: Target,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      label: 'Weekly Progress',
      value: `${weeklyAverage}%`,
      icon: TrendingUp,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      label: 'This Month',
      value: monthLogs.length,
      icon: Calendar,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    },
    {
      label: 'Total Points',
      value: totalPoints,
      icon: Award,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {stat.value}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
