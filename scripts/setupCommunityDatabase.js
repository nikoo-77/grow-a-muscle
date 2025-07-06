// This script sets up the community database tables and storage bucket in Supabase.
// Usage:
//   1. npm install @supabase/supabase-js
//   2. node scripts/setupCommunityDatabase.js

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://coajmlurzlemzbkuuzbq.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvYWptbHVyemxlbXpia3V1emJxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDkzNDIyNSwiZXhwIjoyMDY2NTEwMjI1fQ.eGoeBUpY5xGTnay5AZcrYFIVPenb9qbTWX4sGmgp7Ao';
const supabase = createClient(supabaseUrl, serviceRoleKey);

async function setupCommunityTables() {
  try {
    console.log('Setting up community database tables and policies...');

    // Create posts table
    const { error: postsTableError } = await supabase.rpc('exec_sql', {
      sql: `
        create table if not exists posts (
          id uuid primary key default gen_random_uuid(),
          user_id uuid references auth.users(id) on delete cascade not null,
          content text,
          image_url text,
          image_urls text[],
          created_at timestamp with time zone default timezone('utc', now()),
          updated_at timestamp with time zone default timezone('utc', now())
        );
      `
    });

    if (postsTableError) {
      console.log('Posts table might already exist or error:', postsTableError.message);
    }

    // Create comments table
    const { error: commentsTableError } = await supabase.rpc('exec_sql', {
      sql: `
        create table if not exists comments (
          id uuid primary key default gen_random_uuid(),
          post_id uuid references posts(id) on delete cascade not null,
          user_id uuid references auth.users(id) on delete cascade not null,
          content text,
          image_url text,
          created_at timestamp with time zone default timezone('utc', now())
        );
      `
    });

    if (commentsTableError) {
      console.log('Comments table might already exist or error:', commentsTableError.message);
    }

    // Create post_likes table with unique constraint
    const { error: likesTableError } = await supabase.rpc('exec_sql', {
      sql: `
        create table if not exists post_likes (
          id uuid primary key default gen_random_uuid(),
          post_id uuid references posts(id) on delete cascade not null,
          user_id uuid references auth.users(id) on delete cascade not null,
          created_at timestamp with time zone default timezone('utc', now()),
          unique(post_id, user_id)
        );
      `
    });

    if (likesTableError) {
      console.log('Post likes table might already exist or error:', likesTableError.message);
    }

    // Enable RLS on all tables
    const rlsTables = ['posts', 'comments', 'post_likes'];
    for (const table of rlsTables) {
      const { error: rlsError } = await supabase.rpc('exec_sql', {
        sql: `alter table ${table} enable row level security;`
      });
      if (rlsError) {
        console.log(`RLS might already be enabled on ${table} or error:`, rlsError.message);
      }
    }

    // Drop existing policies to avoid conflicts
    const dropPolicies = [
      // Posts policies
      `drop policy if exists "Users can view all posts" on posts;`,
      `drop policy if exists "Users can create their own posts" on posts;`,
      `drop policy if exists "Users can update their own posts" on posts;`,
      `drop policy if exists "Users can delete their own posts" on posts;`,
      
      // Comments policies
      `drop policy if exists "Users can view all comments" on comments;`,
      `drop policy if exists "Users can create their own comments" on comments;`,
      `drop policy if exists "Users can update their own comments" on comments;`,
      `drop policy if exists "Users can delete their own comments" on comments;`,
      
      // Likes policies
      `drop policy if exists "Users can view all likes" on post_likes;`,
      `drop policy if exists "Users can create their own likes" on post_likes;`,
      `drop policy if exists "Users can delete their own likes" on post_likes;`
    ];

    for (const policy of dropPolicies) {
      const { error } = await supabase.rpc('exec_sql', { sql: policy });
      if (error) {
        console.log('Policy drop error (might not exist):', error.message);
      }
    }

    // Create RLS policies for posts
    const postPolicies = [
      `create policy "Users can view all posts" on posts for select using (true);`,
      `create policy "Users can create their own posts" on posts for insert with check (auth.uid() = user_id);`,
      `create policy "Users can update their own posts" on posts for update using (auth.uid() = user_id);`,
      `create policy "Users can delete their own posts" on posts for delete using (auth.uid() = user_id);`
    ];

    // Create RLS policies for comments
    const commentPolicies = [
      `create policy "Users can view all comments" on comments for select using (true);`,
      `create policy "Users can create their own comments" on comments for insert with check (auth.uid() = user_id);`,
      `create policy "Users can update their own comments" on comments for update using (auth.uid() = user_id);`,
      `create policy "Users can delete their own comments" on comments for delete using (auth.uid() = user_id);`
    ];

    // Create RLS policies for likes
    const likePolicies = [
      `create policy "Users can view all likes" on post_likes for select using (true);`,
      `create policy "Users can create their own likes" on post_likes for insert with check (auth.uid() = user_id);`,
      `create policy "Users can delete their own likes" on post_likes for delete using (auth.uid() = user_id);`
    ];

    // Apply all policies
    const allPolicies = [...postPolicies, ...commentPolicies, ...likePolicies];
    for (const policy of allPolicies) {
      const { error } = await supabase.rpc('exec_sql', { sql: policy });
      if (error) {
        console.log('Policy creation error:', error.message);
      } else {
        console.log('Policy created successfully');
      }
    }

    console.log('Community tables and RLS policies setup complete!');

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
    await setupCommunityTables();
    await setupStorage();
    console.log('Community database and storage setup complete!');
  } catch (err) {
    console.error('Setup failed:', err);
  }
}

main(); 