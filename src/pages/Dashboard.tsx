import { useState, useMemo } from 'react';
import { useHabits } from '../hooks/useHabits';
import HabitCard from '../components/HabitCard';
import HabitTableView from '../components/HabitTableView'; // Your new component
import CreateHabitModal from '../components/CreateHabitModal';
import StatsOverview from '../components/StatsOverview';
import DashboardSkeleton from '../components/DashboardSkeleton';
import { Plus, Search, Filter, Sparkles, LayoutGrid, List } from 'lucide-react';

export default function Dashboard() {
  const { habits, logs, isLoading, toggleHabit, createHabit } = useHabits();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // UI States
  const [searchTerm, setSearchTerm] = useState('');
  const [frequencyFilter, setFrequencyFilter] = useState<'all' | 'daily' | 'weekly'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Filter Logic
  const filteredHabits = useMemo(() => {
    return habits.filter((habit) => {
      const matchesSearch = habit.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = frequencyFilter === 'all' || habit.frequency === frequencyFilter;
      return matchesSearch && matchesFilter;
    });
  }, [habits, searchTerm, frequencyFilter]);

  // Abstracted Toggle Logic to keep code DRY
  const handleToggle = (habitId: string, date: string) => {
    const existing = logs.find((l) => l.habit_id === habitId && l.date === date);
    toggleHabit({ habitId, date, existingLogId: existing?.id });
  };

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            Welcome back <Sparkles className="w-6 h-6 text-yellow-500" />
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            You have {habits.filter(h => !logs.some(l => l.habit_id === h.id && l.date === today)).length} habits left for today.
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>New Habit</span>
        </button>
      </header>

      {/* Stats Summary Section */}
      <section>
        <StatsOverview habits={habits} habitLogs={logs} />
      </section>

      {/* Filters & View Toggle Bar */}
      <section className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search your rituals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all dark:text-white outline-none"
            />
          </div>
          
          {/* Frequency Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-gray-400 hidden sm:block" />
            <select
              value={frequencyFilter}
              onChange={(e) => setFrequencyFilter(e.target.value as any)}
              className="w-full sm:w-40 px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm dark:text-white cursor-pointer outline-none"
            >
              <option value="all">All Frequencies</option>
              <option value="daily">Daily Only</option>
              <option value="weekly">Weekly Only</option>
            </select>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-900 p-1 rounded-xl w-full sm:w-auto justify-center">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              viewMode === 'grid' 
              ? 'bg-white dark:bg-gray-800 shadow-sm text-blue-600 dark:text-blue-400' 
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">Grid</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              viewMode === 'table' 
              ? 'bg-white dark:bg-gray-800 shadow-sm text-blue-600 dark:text-blue-400' 
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">Table</span>
          </button>
        </div>
      </section>

      {/* Habits Content */}
      <section>
        {filteredHabits.length === 0 ? (
          <EmptyState 
            isFiltering={searchTerm !== '' || frequencyFilter !== 'all'} 
            onClear={() => { setSearchTerm(''); setFrequencyFilter('all'); }}
            onAdd={() => setIsCreateModalOpen(true)}
          />
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredHabits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                habitLogs={logs.filter((l) => l.habit_id === habit.id)}
                onToggle={(date) => handleToggle(habit.id, date)}
              />
            ))}
          </div>
        ) : (
          <HabitTableView
            habits={filteredHabits}
            logs={logs}
            today={today}
            onToggle={(date: string, habitId: string) => handleToggle(habitId, date)}
          />
        )}
      </section>

      {/* Modals */}
      {isCreateModalOpen && (
        <CreateHabitModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={async (data) => {
            await createHabit(data);
            setIsCreateModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

// Sub-component remains the same
function EmptyState({ isFiltering, onClear, onAdd }: { isFiltering: boolean; onClear: () => void; onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 bg-white dark:bg-gray-800/30 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-gray-400">
        <Search className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {isFiltering ? 'No matches found' : 'Ready to start a new habit?'}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm mb-6">
        {isFiltering 
          ? "We couldn't find any habits matching your current search or filter." 
          : "Consistency is the only thing that matters. Create your first habit and start your journey today!"}
      </p>
      {isFiltering ? (
        <button onClick={onClear} className="text-blue-600 font-semibold hover:underline">Clear all filters</button>
      ) : (
        <button
          onClick={onAdd}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 active:scale-95"
        >
          Create My First Habit
        </button>
      )}
    </div>
  );
}