import { supabase } from './supabaseClient';

// Get the start of the current week (Monday)
export function getWeekStart() {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Sunday = 0, Monday = 1
  const monday = new Date(now);
  monday.setDate(now.getDate() - daysToMonday);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

// Get the end of the current week (Sunday)
export function getWeekEnd() {
  const weekStart = getWeekStart();
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  return weekEnd;
}

// Check if a workout session is completed for the current week
export async function checkWeeklyWorkoutCompletion(userId, workoutType, dayOfWeek) {
  const weekStart = getWeekStart();
  const weekEnd = getWeekEnd();

  const { data, error } = await supabase
    .from('weekly_workout_sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('workout_type', workoutType)
    .eq('day_of_week', dayOfWeek)
    .gte('completed_at', weekStart.toISOString())
    .lte('completed_at', weekEnd.toISOString())
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    throw error;
  }

  return data || null;
}

// Mark a workout session as completed for the week
export async function markWeeklyWorkoutCompleted(userId, workoutType, dayOfWeek, exercises) {
  const weekStart = getWeekStart();
  const weekEnd = getWeekEnd();

  // Check if already completed this week
  const existing = await checkWeeklyWorkoutCompletion(userId, workoutType, dayOfWeek);
  if (existing) {
    throw new Error('This workout session has already been completed this week');
  }

  const { data, error } = await supabase
    .from('weekly_workout_sessions')
    .insert([{
      user_id: userId,
      workout_type: workoutType,
      day_of_week: dayOfWeek,
      exercises: exercises,
      completed_at: new Date().toISOString(),
      week_start: weekStart.toISOString(),
      week_end: weekEnd.toISOString()
    }])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

// Get all completed workouts for the current week
export async function getWeeklyWorkoutProgress(userId, workoutType) {
  const weekStart = getWeekStart();
  const weekEnd = getWeekEnd();

  const { data, error } = await supabase
    .from('weekly_workout_sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('workout_type', workoutType)
    .gte('completed_at', weekStart.toISOString())
    .lte('completed_at', weekEnd.toISOString())
    .order('completed_at', { ascending: true });

  if (error) {
    throw error;
  }

  return data || [];
}

// Get workout completion status for all days of the week
export async function getWeeklyWorkoutStatus(userId, workoutType) {
  const weekProgress = await getWeeklyWorkoutProgress(userId, workoutType);
  
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const status = {};
  
  weekDays.forEach(day => {
    const completed = weekProgress.find(session => session.day_of_week === day);
    status[day] = completed ? {
      completed: true,
      completedAt: completed.completed_at,
      exercises: completed.exercises
    } : {
      completed: false,
      completedAt: null,
      exercises: []
    };
  });

  return status;
}

// Check if it's a new week (for resetting progress)
export async function checkIfNewWeek(userId, workoutType) {
  const lastSession = await supabase
    .from('weekly_workout_sessions')
    .select('week_start')
    .eq('user_id', userId)
    .eq('workout_type', workoutType)
    .order('completed_at', { ascending: false })
    .limit(1)
    .single();

  if (!lastSession.data) {
    return true; // First time user
  }

  const currentWeekStart = getWeekStart();
  const lastWeekStart = new Date(lastSession.data.week_start);
  
  return currentWeekStart.getTime() !== lastWeekStart.getTime();
} 