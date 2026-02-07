export function calculateStreak(lastActivityDate: string, currentDate: Date = new Date()): boolean {
  const lastActivity = new Date(lastActivityDate)
  const hoursDiff = (currentDate.getTime() - lastActivity.getTime()) / (1000 * 60 * 60)
  
  // Streak continues if within 24 hours
  return hoursDiff <= 24
}

export function shouldResetStreak(lastActivityDate: string): boolean {
  return !calculateStreak(lastActivityDate)
}
