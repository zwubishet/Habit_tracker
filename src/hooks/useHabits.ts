import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export function useHabits() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch Habits
  const habitsQuery = useQuery({
    queryKey: ['habits', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  // Fetch Logs (Last 30 days only for performance)
  const logsQuery = useQuery({
    queryKey: ['habit_logs', user?.id],
    queryFn: async () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data, error } = await supabase
        .from('habit_logs')
        .select('*')
        .gte('date', thirtyDaysAgo.toISOString().split('T')[0]);
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  // Toggle Mutation with Optimistic UI
  const toggleHabit = useMutation({
    mutationFn: async ({ habitId, date, existingLogId }: { habitId: string; date: string; existingLogId?: string }) => {
      if (existingLogId) {
        const { error } = await supabase.from('habit_logs').delete().eq('id', existingLogId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('habit_logs').insert([
          { habit_id: habitId, user_id: user!.id, date, completed: true }
        ]);
        if (error) throw error;
      }
    },
    onMutate: async ({ habitId, date, existingLogId }) => {
      await queryClient.cancelQueries({ queryKey: ['habit_logs', user?.id] });
      const previousLogs = queryClient.getQueryData(['habit_logs', user?.id]);

      queryClient.setQueryData(['habit_logs', user?.id], (old: any[] | undefined) => {
        if (existingLogId) return old?.filter(l => l.id !== existingLogId);
        return [...(old || []), { id: 'temp', habit_id: habitId, date, completed: true }];
      });

      return { previousLogs };
    },
    onError: (err, __, context) => {
      queryClient.setQueryData(['habit_logs', user?.id], context?.previousLogs);
      toast.error('Connection error. Try again.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['habit_logs', user?.id] });
    },
  });

  // Create Habit Mutation
  const createHabit = useMutation({
    mutationFn: async (newHabit: any) => {
      const { error } = await supabase.from('habits').insert([{ ...newHabit, user_id: user!.id }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits', user?.id] });
      toast.success('Habit created!');
    },
  });

  return {
    habits: habitsQuery.data || [],
    logs: logsQuery.data || [],
    isLoading: habitsQuery.isLoading || logsQuery.isLoading,
    toggleHabit: toggleHabit.mutate,
    createHabit: createHabit.mutateAsync,
  };
}