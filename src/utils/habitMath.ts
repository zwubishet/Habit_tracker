// Pure function - easy to test!
export const calculateStats = (logs: any[], today: string) => {
  const completedToday = logs.some(l => l.date === today);
  // Add complex streak logic here...
  return { completedToday, currentStreak: 5 }; // Simplified for example
};