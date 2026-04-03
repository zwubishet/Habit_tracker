import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import HabitCard from '../components/HabitCard';
import CreateHabitModal from '../components/CreateHabitModal';
import StatsOverview from '../components/StatsOverview';
import { Plus, LogOut, Moon, Sun } from 'lucide-react';
import type { Database } from '../lib/database.types';

type Habit = Database['public']['Tables']['habits']['Row'];
type HabitLog = Database['public']['Tables']['habit_logs']['Row'];

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    loadHabits();
    loadHabitLogs();
  }, []);

  const loadHabits = async () => {
    try {
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHabits(data || []);
    } catch (error) {
      console.error('Error loading habits:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadHabitLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('habit_logs')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setHabitLogs(data || []);
    } catch (error) {
      console.error('Error loading habit logs:', error);
    }
  };

  const handleCreateHabit = async (habitData: {
    title: string;
    description: string;
    frequency: 'daily' | 'weekly';
    reminder_time: string | null;
  }) => {
    try {
      const { error } = await supabase.from('habits').insert([
        {
          ...habitData,
          user_id: user!.id,
        },
      ]);

      if (error) throw error;
      await loadHabits();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating habit:', error);
    }
  };

  const handleDeleteHabit = async (habitId: string) => {
    try {
      const { error } = await supabase.from('habits').delete().eq('id', habitId);

      if (error) throw error;
      await loadHabits();
      await loadHabitLogs();
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  const handleToggleHabit = async (habitId: string, date: string) => {
    const existingLog = habitLogs.find(
      (log) => log.habit_id === habitId && log.date === date
    );

    try {
      if (existingLog) {
        const { error } = await supabase
          .from('habit_logs')
          .delete()
          .eq('id', existingLog.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('habit_logs').insert([
          {
            habit_id: habitId,
            user_id: user!.id,
            date,
            completed: true,
          },
        ]);

        if (error) throw error;
      }
      await loadHabitLogs();
    } catch (error) {
      console.error('Error toggling habit:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Habit Tracker</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {user?.user_metadata?.name || user?.email}
              </span>
              <button
                onClick={signOut}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StatsOverview habits={habits} habitLogs={habitLogs} />

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Habits</h2>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Habit
          </button>
        </div>

        {habits.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">No habits yet. Create your first habit to get started!</p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Your First Habit
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                habitLogs={habitLogs.filter((log) => log.habit_id === habit.id)}
                onToggle={handleToggleHabit}
                onDelete={handleDeleteHabit}
              />
            ))}
          </div>
        )}
      </main>

      {isCreateModalOpen && (
        <CreateHabitModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateHabit}
        />
      )}
    </div>
  );
}
