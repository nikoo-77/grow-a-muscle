// This script sets up the required tables and storage bucket in Supabase for the app.
// Usage:
//   1. npm install node-fetch @supabase/supabase-js
//   2. node scripts/setupDatabase.js

const fetch = require('node-fetch');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://coajmlurzlemzbkuuzbq.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvYWptbHVyemxlbXpia3V1emJxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDkzNDIyNSwiZXhwIjoyMDY2NTEwMjI1fQ.eGoeBUpY5xGTnay5AZcrYFIVPenb9qbTWX4sGmgp7Ao';
const supabase = createClient(supabaseUrl, serviceRoleKey);

async function executeSQL(sql) {
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/execute_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${serviceRoleKey}`,
      'apikey': serviceRoleKey
    },
    body: JSON.stringify({ sql })
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`SQL Error: ${error}`);
  }
  return response.json();
}

async function setupTables() {
  // 1. weight_logs
  await executeSQL(`
    create table if not exists weight_logs (
      id uuid primary key default gen_random_uuid(),
      user_id uuid references auth.users(id) on delete cascade,
      weight float not null,
      logged_at timestamp with time zone default timezone('utc', now())
    );
  `);

  // 2. workout_programs
  await executeSQL(`
    create table if not exists workout_programs (
      id uuid primary key default gen_random_uuid(),
      name text not null,
      description text
    );
  `);

  // 3. user_workouts
  await executeSQL(`
    create table if not exists user_workouts (
      id uuid primary key default gen_random_uuid(),
      user_id uuid references auth.users(id) on delete cascade,
      program_id uuid references workout_programs(id) on delete set null,
      date timestamp with time zone default timezone('utc', now()),
      weight float,
      sets integer,
      reps integer
    );
  `);

  // 4. posts
  await executeSQL(`
    create table if not exists posts (
      id uuid primary key default gen_random_uuid(),
      user_id uuid references auth.users(id) on delete cascade,
      title text not null,
      content text,
      image_url text,
      created_at timestamp with time zone default timezone('utc', now())
    );
  `);

  // 5. comments
  await executeSQL(`
    create table if not exists comments (
      id uuid primary key default gen_random_uuid(),
      post_id uuid references posts(id) on delete cascade,
      user_id uuid references auth.users(id) on delete cascade,
      content text not null,
      created_at timestamp with time zone default timezone('utc', now())
    );
  `);

  // 6. post_likes
  await executeSQL(`
    create table if not exists post_likes (
      id uuid primary key default gen_random_uuid(),
      post_id uuid references posts(id) on delete cascade,
      user_id uuid references auth.users(id) on delete cascade,
      created_at timestamp with time zone default timezone('utc', now())
    );
  `);

  // SQL to create login_history table for tracking user logins
  await executeSQL(`
    create table if not exists login_history (
      id uuid primary key default gen_random_uuid(),
      user_id uuid references auth.users(id) on delete cascade,
      login_at timestamptz not null default timezone('utc', now())
    );
  `);
}

async function setupStorage() {
  // Create storage bucket for community posts images
  const { error } = await supabase.storage.createBucket('community-posts', {
    public: true
  });
  if (error && !error.message.includes('already exists')) {
    console.error('Error creating storage bucket:', error.message);
  } else {
    console.log('Storage bucket created or already exists.');
  }
}

async function main() {
  try {
    await setupTables();
    await setupStorage();
    console.log('Database and storage setup complete!');
  } catch (err) {
    console.error('Setup failed:', err);
  }
}

main(); 