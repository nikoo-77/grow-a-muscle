# Fix RLS Error for User Signup

The error "new row violates row-level security policy for table 'users'" occurs because the RLS (Row Level Security) policies are too restrictive for the signup process.

## Solution 1: Run the Updated Setup Script

```bash
node scripts/setupDatabase.js
```

## Solution 2: Manual SQL Commands (Run in Supabase SQL Editor)

If the script doesn't work, run these SQL commands directly in your Supabase SQL Editor:

### Step 1: Drop existing policies
```sql
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can delete their own profile" ON users;
```

### Step 2: Create new policies with more permissive insert policy
```sql
-- Allow users to insert their own profile (more permissive for signup)
CREATE POLICY "Users can insert their own profile" 
ON users FOR INSERT 
WITH CHECK (auth.uid() = id OR auth.uid() IS NULL);

-- Allow users to view their own profile
CREATE POLICY "Users can view their own profile" 
ON users FOR SELECT 
USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile" 
ON users FOR UPDATE 
USING (auth.uid() = id);

-- Allow users to delete their own profile
CREATE POLICY "Users can delete their own profile" 
ON users FOR DELETE 
USING (auth.uid() = id);
```

## Solution 3: Temporary Disable RLS (For Testing Only)

If you want to test without RLS temporarily:

```sql
-- Disable RLS temporarily
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Re-enable when done testing
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
```

## Why This Happens

During signup:
1. User creates auth account with `supabase.auth.signUp()`
2. User profile is inserted into `users` table
3. RLS policy checks `auth.uid() = id`
4. But during signup, the user might not be fully authenticated yet
5. The policy `auth.uid() = id OR auth.uid() IS NULL` allows the insert to succeed

## Alternative: Use Database Triggers

You could also use a database trigger to automatically create user profiles:

```sql
-- Create a trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, created_at, last_login)
  VALUES (new.id, new.email, now(), now());
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

This would automatically create a user profile when someone signs up, eliminating the need for manual insertion in your signup code. 