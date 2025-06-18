# Complete Firebase Setup Guide for Login/Signup

## 🔧 **Step 1: Enable Firebase Authentication**

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project** (grow-a-muscle)
3. **Click "Authentication"** in the left sidebar
4. **Click "Get started"**
5. **Go to "Sign-in method" tab**
6. **Enable "Email/Password"** authentication:
   - Click on "Email/Password"
   - Toggle the switch to "Enable"
   - Click "Save"

## 🔧 **Step 2: Set Up Firestore Database**

1. **In Firebase Console**, click "Firestore Database" in the left sidebar
2. **Click "Create database"**
3. **Choose security mode**:
   - Select "Start in test mode" (for development)
   - Click "Next"
4. **Choose location**:
   - Select a region close to your users (e.g., "asia-southeast1")
   - Click "Done"

## 🔧 **Step 3: Set Up Firestore Security Rules**

1. **In Firestore Database**, go to "Rules" tab
2. **Replace the default rules** with these secure rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow read access to public data (if any)
    match /public/{document=**} {
      allow read: if true;
    }
  }
}
```

3. **Click "Publish"**

## 🔧 **Step 4: Test Your Setup**

### Test Signup:
1. **Run your app**: `npm run dev`
2. **Go to `/signup`**
3. **Create a test account** with:
   - First Name: Test
   - Last Name: User
   - Email: test@example.com
   - Password: test123456
   - Fitness Goal: Build Muscle
4. **Click "Create Account"**

### Test Login:
1. **Go to `/login`**
2. **Sign in** with the same credentials
3. **You should be redirected** to the homepage

## 🔧 **Step 5: Verify Data in Firebase**

### Check Authentication:
1. **In Firebase Console**, go to "Authentication" → "Users"
2. **You should see** your test user listed

### Check Firestore:
1. **In Firebase Console**, go to "Firestore Database" → "Data"
2. **You should see** a "users" collection
3. **Click on the user document** to see stored data:
   - firstName: "Test"
   - lastName: "User"
   - email: "test@example.com"
   - fitnessGoal: "build-muscle"
   - createdAt: [timestamp]
   - lastLogin: [timestamp]

## 📊 **Database Structure**

Your Firestore will have this structure:

```
users/
  {userId}/
    firstName: string
    lastName: string
    email: string
    fitnessGoal: string
    createdAt: timestamp
    lastLogin: timestamp
```

## 🔒 **Security Features**

- ✅ **User authentication** with email/password
- ✅ **Secure data access** - users can only access their own data
- ✅ **Input validation** on both client and server
- ✅ **Error handling** for common authentication issues
- ✅ **Password requirements** (minimum 6 characters)

## 🚀 **What's Now Working**

1. **User Registration**: Creates Firebase Auth account + Firestore profile
2. **User Login**: Authenticates users and updates last login time
3. **Data Storage**: Stores user profile information securely
4. **Error Handling**: Shows specific error messages for different issues
5. **Navigation**: Seamless flow between signup, login, and homepage

## 🔄 **Next Steps (Optional)**

Consider adding:
- **Email verification** for new accounts
- **Password reset** functionality
- **Social login** (Google, Facebook)
- **User profile editing**
- **Session management**
- **Protected routes** for authenticated users

## 🐛 **Troubleshooting**

### Common Issues:

1. **"Permission denied" error**:
   - Check Firestore security rules
   - Make sure rules allow authenticated users to read/write their data

2. **"Invalid API key" error**:
   - Verify your Firebase config in `lib/firebaseConfig.js`
   - Check that all config values are correct

3. **"User not found" error**:
   - Make sure Email/Password authentication is enabled
   - Check that the user account was created successfully

4. **"Network error"**:
   - Check your internet connection
   - Verify Firebase project is in the correct region 