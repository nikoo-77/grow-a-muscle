# Setup Weekly Workout Tracking

This system allows users to complete each workout session only once per week, with workouts refreshing every Monday.

## Solution 1: Run the Setup Script

```bash
node scripts/setupWeeklyWorkouts.js
```

## Solution 2: Manual SQL Commands (Run in Supabase SQL Editor)

If the script doesn't work, run these SQL commands directly in your Supabase SQL Editor:

### Step 1: Create the Weekly Workout Sessions Table

```sql
-- Create weekly_workout_sessions table
CREATE TABLE IF NOT EXISTS weekly_workout_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  workout_type text NOT NULL,
  day_of_week text NOT NULL,
  exercises jsonb,
  completed_at timestamp with time zone DEFAULT timezone('utc', now()),
  week_start timestamp with time zone NOT NULL,
  week_end timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc', now()),
  UNIQUE(user_id, workout_type, day_of_week, week_start)
);
```

### Step 2: Enable RLS and Create Policies

```sql
-- Enable RLS on the table
ALTER TABLE weekly_workout_sessions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own weekly workouts" ON weekly_workout_sessions;
DROP POLICY IF EXISTS "Users can create their own weekly workouts" ON weekly_workout_sessions;
DROP POLICY IF EXISTS "Users can update their own weekly workouts" ON weekly_workout_sessions;
DROP POLICY IF EXISTS "Users can delete their own weekly workouts" ON weekly_workout_sessions;

-- Create RLS policies for weekly workout sessions
CREATE POLICY "Users can view their own weekly workouts" 
ON weekly_workout_sessions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own weekly workouts" 
ON weekly_workout_sessions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weekly workouts" 
ON weekly_workout_sessions FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weekly workouts" 
ON weekly_workout_sessions FOR DELETE 
USING (auth.uid() = user_id);
```

## How the System Works

### Weekly Reset
- **Week starts**: Monday at 00:00:00
- **Week ends**: Sunday at 23:59:59
- **Reset**: Every Monday, all workout sessions become available again

### User Experience
1. **View Progress**: Users can see which days they've completed this week
2. **Complete Once**: Each day's workout can only be completed once per week
3. **Flexible Timing**: Users can complete workouts on any day, not just the assigned day
4. **Visual Feedback**: Completed days show a green checkmark
5. **Week Display**: Shows the current week's date range

### Database Structure

**weekly_workout_sessions table:**
- `user_id`: Links to the user
- `workout_type`: Type of workout (e.g., 'strength-training', 'muscle-building')
- `day_of_week`: Day of the week (Monday, Tuesday, etc.)
- `exercises`: JSON array of completed exercises with details
- `completed_at`: When the session was completed
- `week_start`: Start of the week (Monday)
- `week_end`: End of the week (Sunday)
- `unique constraint`: Prevents duplicate completions for the same week

### Features Implemented

✅ **Weekly Reset**: Workouts refresh every Monday
✅ **Once Per Week**: Each session can only be completed once per week
✅ **Flexible Timing**: Users can complete workouts on any day
✅ **Visual Progress**: Shows completed days with checkmarks
✅ **Week Display**: Shows current week's date range
✅ **Error Prevention**: Prevents duplicate completions
✅ **Backward Compatibility**: Still saves to existing user_workouts table

### Testing the System

1. **Complete a workout**: Finish a day's workout session
2. **Try to repeat**: Attempt to complete the same day again (should be blocked)
3. **Check progress**: Verify the day shows as completed with a checkmark
4. **Wait for reset**: After Monday, the workout should become available again

The system ensures users can only complete each workout session once per week while maintaining flexibility in when they perform their workouts. 