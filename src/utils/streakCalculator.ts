// src/utils/streakCalculator.ts
export function calculateStreak(logs: { date: string }[]) {
  if (!logs.length) return { current: 0, longest: 0 };

  const sortedDates = logs
    .map(l => new Date(l.date).setHours(0,0,0,0))
    .sort((a, b) => b - a);

  let current = 0;
  let longest = 0;
  let tempLongest = 0;
  let today = new Date().setHours(0,0,0,0);

  // Check if completed today or yesterday to maintain current streak
  const lastLog = sortedDates[0];
  const diff = (today - lastLog) / (1000 * 60 * 60 * 24);

  if (diff <= 1) {
    let checkDate = lastLog;
    for (let i = 0; i < sortedDates.length; i++) {
      if (sortedDates[i] === checkDate) {
        current++;
        checkDate -= (1000 * 60 * 60 * 24);
      } else break;
    }
  }

  // Longest streak logic...
  return { current, longest }; 
}