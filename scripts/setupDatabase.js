// This script sets up the required tables and storage bucket in Supabase for the app.
// Usage:
//   1. npm install @supabase/supabase-js
//   2. node scripts/setupDatabase.js

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://coajmlurzlemzbkuuzbq.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvYWptbHVyemxlbXpia3V1emJxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDkzNDIyNSwiZXhwIjoyMDY2NTEwMjI1fQ.eGoeBUpY5xGTnay5AZcrYFIVPenb9qbTWX4sGmgp7Ao';
const supabase = createClient(supabaseUrl, serviceRoleKey);

async function setupTables() {
  try {
    console.log('Setting up database tables and policies...');

    // Create users table if it doesn't exist
    const { error: usersTableError } = await supabase.rpc('exec_sql', {
      sql: `
        create table if not exists users (
          id uuid primary key references auth.users(id) on delete cascade,
          first_name text,
          last_name text,
          email text,
          fitness_goal text,
          gender text,
          height float,
          weight float,
          medical_info text,
          profile_picture text,
          created_at timestamp with time zone default timezone('utc', now()),
          last_login timestamp with time zone default timezone('utc', now())
        );
      `
    });

    if (usersTableError) {
      console.log('Users table might already exist or error:', usersTableError.message);
    }

    // Enable RLS on users table
    const { error: rlsError } = await supabase.rpc('exec_sql', {
      sql: `alter table users enable row level security;`
    });

    if (rlsError) {
      console.log('RLS might already be enabled or error:', rlsError.message);
    }

    // Create RLS policies for users table
    const policies = [
      `create policy if not exists "Users can insert their own profile" on users for insert with check (auth.uid() = id);`,
      `create policy if not exists "Users can view their own profile" on users for select using (auth.uid() = id);`,
      `create policy if not exists "Users can update their own profile" on users for update using (auth.uid() = id);`,
      `create policy if not exists "Users can delete their own profile" on users for delete using (auth.uid() = id);`
    ];

    for (const policy of policies) {
      const { error } = await supabase.rpc('exec_sql', { sql: policy });
      if (error) {
        console.log('Policy might already exist or error:', error.message);
      }
    }

    console.log('Users table and RLS policies setup complete!');
    console.log('You can now create accounts without the RLS error.');

  } catch (err) {
    console.error('Setup failed:', err);
  }
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