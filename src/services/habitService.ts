import { supabase } from '../lib/supabase';

export const habitService = {
  async fetchHabits() {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async fetchLogs(days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const { data, error } = await supabase
      .from('habit_logs')
      .select('*')
      .gte('date', startDate.toISOString().split('T')[0]);
    if (error) throw error;
    return data || [];
  },

  async toggleLog(habitId: string, userId: string, date: string, existingId?: string) {
    if (existingId) {
      return supabase.from('habit_logs').delete().eq('id', existingId);
    }
    return supabase.from('habit_logs').insert([{ habit_id: habitId, user_id: userId, date, completed: true }]);
  }
};