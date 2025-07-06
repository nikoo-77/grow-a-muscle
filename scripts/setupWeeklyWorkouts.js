// This script sets up the weekly workout tracking table in Supabase.
// Usage:
//   1. npm install @supabase/supabase-js
//   2. node scripts/setupWeeklyWorkouts.js

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://coajmlurzlemzbkuuzbq.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvYWptbHVyemxlbXpia3V1emJxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDkzNDIyNSwiZXhwIjoyMDY2NTEwMjI1fQ.eGoeBUpY5xGTnay5AZcrYFIVPenb9qbTWX4sGmgp7Ao';
const supabase = createClient(supabaseUrl, serviceRoleKey);

async function setupWeeklyWorkouts() {
  try {
    console.log('Setting up weekly workout tracking...');

    // Create weekly_workout_sessions table
    const { error: tableError } = await supabase.rpc('exec_sql', {
      sql: `
        create table if not exists weekly_workout_sessions (
          id uuid primary key default gen_random_uuid(),
          user_id uuid references auth.users(id) on delete cascade not null,
          workout_type text not null,
          day_of_week text not null,
          exercises jsonb,
          completed_at timestamp with time zone default timezone('utc', now()),
          week_start timestamp with time zone not null,
          week_end timestamp with time zone not null,
          created_at timestamp with time zone default timezone('utc', now()),
          unique(user_id, workout_type, day_of_week, week_start)
        );
      `
    });

    if (tableError) {
      console.log('Table might already exist or error:', tableError.message);
    }

    // Enable RLS on the table
    const { error: rlsError } = await supabase.rpc('exec_sql', {
      sql: `alter table weekly_workout_sessions enable row level security;`
    });

    if (rlsError) {
      console.log('RLS might already be enabled or error:', rlsError.message);
    }

    // Drop existing policies to avoid conflicts
    const dropPolicies = [
      `drop policy if exists "Users can view their own weekly workouts" on weekly_workout_sessions;`,
      `drop policy if exists "Users can create their own weekly workouts" on weekly_workout_sessions;`,
      `drop policy if exists "Users can update their own weekly workouts" on weekly_workout_sessions;`,
      `drop policy if exists "Users can delete their own weekly workouts" on weekly_workout_sessions;`
    ];

    for (const policy of dropPolicies) {
      const { error } = await supabase.rpc('exec_sql', { sql: policy });
      if (error) {
        console.log('Policy drop error (might not exist):', error.message);
      }
    }

    // Create RLS policies for weekly workout sessions
    const policies = [
      `create policy "Users can view their own weekly workouts" on weekly_workout_sessions for select using (auth.uid() = user_id);`,
      `create policy "Users can create their own weekly workouts" on weekly_workout_sessions for insert with check (auth.uid() = user_id);`,
      `create policy "Users can update their own weekly workouts" on weekly_workout_sessions for update using (auth.uid() = user_id);`,
      `create policy "Users can delete their own weekly workouts" on weekly_workout_sessions for delete using (auth.uid() = user_id);`
    ];

    for (const policy of policies) {
      const { error } = await supabase.rpc('exec_sql', { sql: policy });
      if (error) {
        console.log('Policy creation error:', error.message);
      } else {
        console.log('Policy created successfully');
      }
    }

    console.log('Weekly workout tracking setup complete!');

  } catch (err) {
    console.error('Setup failed:', err);
  }
}

async function main() {
  try {
    await setupWeeklyWorkouts();
    console.log('Weekly workout tracking setup complete!');
  } catch (err) {
    console.error('Setup failed:', err);
  }
}

main(); 