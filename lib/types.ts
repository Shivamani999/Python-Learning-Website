export interface UserProgress {
  id: string
  user_id: string
  day_number: number
  completed: boolean
  completed_at: string | null
  last_accessed: string
}

export interface UserStreak {
  id: string
  user_id: string
  current_streak: number
  longest_streak: number
  last_activity_date: string
}
