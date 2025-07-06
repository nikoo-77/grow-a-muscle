# Fix Community Likes Issue

The issue where likes are shared between users occurs because the `post_likes` table might not have the proper unique constraint or RLS policies.

## Solution 1: Run the Community Setup Script

```bash
node scripts/setupCommunityDatabase.js
```

## Solution 2: Manual SQL Commands (Run in Supabase SQL Editor)

If the script doesn't work, run these SQL commands directly in your Supabase SQL Editor:

### Step 1: Create/Update Community Tables

```sql
-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content text,
  image_url text,
  image_urls text[],
  created_at timestamp with time zone DEFAULT timezone('utc', now()),
  updated_at timestamp with time zone DEFAULT timezone('utc', now())
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content text,
  image_url text,
  created_at timestamp with time zone DEFAULT timezone('utc', now())
);

-- Create post_likes table with unique constraint
CREATE TABLE IF NOT EXISTS post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc', now()),
  UNIQUE(post_id, user_id)
);
```

### Step 2: Add Unique Constraint to Existing post_likes Table

If the table already exists, add the unique constraint:

```sql
-- Add unique constraint to prevent duplicate likes
ALTER TABLE post_likes 
ADD CONSTRAINT post_likes_post_user_unique 
UNIQUE (post_id, user_id);
```

### Step 3: Enable RLS and Create Policies

```sql
-- Enable RLS on all tables
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view all posts" ON posts;
DROP POLICY IF EXISTS "Users can create their own posts" ON posts;
DROP POLICY IF EXISTS "Users can update their own posts" ON posts;
DROP POLICY IF EXISTS "Users can delete their own posts" ON posts;

DROP POLICY IF EXISTS "Users can view all comments" ON comments;
DROP POLICY IF EXISTS "Users can create their own comments" ON comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON comments;

DROP POLICY IF EXISTS "Users can view all likes" ON post_likes;
DROP POLICY IF EXISTS "Users can create their own likes" ON post_likes;
DROP POLICY IF EXISTS "Users can delete their own likes" ON post_likes;

-- Create RLS policies for posts
CREATE POLICY "Users can view all posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Users can create their own posts" ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own posts" ON posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own posts" ON posts FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for comments
CREATE POLICY "Users can view all comments" ON comments FOR SELECT USING (true);
CREATE POLICY "Users can create their own comments" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own comments" ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments" ON comments FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for likes
CREATE POLICY "Users can view all likes" ON post_likes FOR SELECT USING (true);
CREATE POLICY "Users can create their own likes" ON post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own likes" ON post_likes FOR DELETE USING (auth.uid() = user_id);
```

### Step 4: Create Storage Bucket

```sql
-- This will be handled by the Supabase dashboard or the setup script
-- Go to Storage in your Supabase dashboard and create a bucket named 'community-posts'
```

## Why This Fixes the Issue

1. **Unique Constraint**: The `UNIQUE(post_id, user_id)` constraint ensures that each user can only like a post once
2. **Proper RLS Policies**: The policies allow users to create their own likes but prevent them from creating likes for other users
3. **Correct Table Structure**: Each like record is tied to a specific user and post combination

## Testing the Fix

After applying these changes:

1. Create a post with User A
2. Like the post with User A
3. Switch to User B
4. Like the same post with User B
5. Both users should see their own likes independently

The like count should show the total number of likes, and each user should see their own like status correctly.

## Alternative: Temporary Disable RLS (For Testing Only)

If you want to test without RLS temporarily:

```sql
-- Disable RLS temporarily
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes DISABLE ROW LEVEL SECURITY;

-- Re-enable when done testing
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
``` 