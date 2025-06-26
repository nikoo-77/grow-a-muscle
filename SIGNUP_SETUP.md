# Signup Page Setup Guide

## Firebase Configuration

To enable user registration functionality, you need to set up Firebase Authentication. Follow these steps:

### 1. Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter your project name (e.g., "grow-a-muscle")
4. Follow the setup wizard

### 2. Enable Authentication
1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable "Email/Password" authentication
5. Click "Save"

### 3. Get Your Firebase Config
1. In your Firebase project, click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>)
5. Register your app with a nickname
6. Copy the firebaseConfig object

### 4. Set Environment Variables
Create a `.env.local` file in your project root with the following variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_SUPABASE_URL=https://coajmlurzlemzbkuuzbq.supabase.co
NEXT_PUBLIC_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvYWptbHVyemxlbXpia3V1emJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5MzQyMjUsImV4cCI6MjA2NjUxMDIyNX0.A1e1LvOKbCDYBRrlqCunBU5yej3gA_CObFLKtzY5UXs
```

Replace the values with your actual Firebase configuration.

### 5. Test the Signup Page
1. Run your development server: `npm run dev`
2. Navigate to `/signup` or click the "Sign Up" button
3. Try creating a new account

## Features Included

The signup page includes:
- ✅ User registration with email and password
- ✅ Form validation (password confirmation, minimum length)
- ✅ Fitness goal selection
- ✅ Error handling and loading states
- ✅ Responsive design matching your theme
- ✅ Firebase Authentication integration
- ✅ Navigation integration

## Next Steps

Consider adding:
- Email verification
- Password strength requirements
- Social login (Google, Facebook, etc.)
- User profile creation in Firestore
- Welcome email functionality 